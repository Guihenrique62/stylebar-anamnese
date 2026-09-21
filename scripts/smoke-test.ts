/**
 * Teste de fumaça dos serviços contra o banco real. Envia fichas dos 3 tipos para uma
 * paciente de teste, valida regras e apaga tudo no final.
 * Uso: npm run test:smoke
 */
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { db } from "../src/server/db";
import { ENVIO_SCHEMA, TIPOS, ehBot } from "../src/lib/validation/anamnese";
import {
  contarPorTipo,
  listarFichas,
  listarPacientes,
  obterFicha,
  obterPaciente,
  revisarFicha,
  salvarFicha,
} from "../src/server/anamnese";

function ok(cond: unknown, msg: string) {
  if (!cond) throw new Error(`FALHOU: ${msg}`);
  console.log(`ok  ${msg}`);
}

const TELEFONE = "11988887777";

const pessoais = {
  nome: "Paciente Teste",
  telefone: "(11) 98888-7777",
  email: "",
  dataNascimento: "1990-05-10",
  aceitaTermos: "on",
  site: "",
};

const formularios = {
  MASSOTERAPIA: { ...pessoais, queixaPrincipal: "Dor lombar", nivelDor: "6", gestante: "on", pressaoArterial: "NORMAL", qualidadeSono: "BOA", nivelEstresse: "4", pressaoToque: "FORTE" },
  HEAD_SPA: { ...pessoais, tipoCabelo: "Cacheado", tipoCouro: "OLEOSO", frequenciaLavagem: "ALTERNADA", objetivo: "Reduzir oleosidade", quedaCabelo: "on", dataQuimica: "2026-08-01" },
  DEPILACAO: { ...pessoais, areas: "Pernas e axilas", metodoPreferido: "CERA_QUENTE", tipoPele: "SENSIVEL", pelosEncravados: "on", ultimaDepilacao: "2026-08-15" },
} as const;

async function limpar() {
  const p = await db.paciente.findUnique({ where: { telefone: TELEFONE } });
  if (!p) return;
  await db.fichaMassoterapia.deleteMany({ where: { pacienteId: p.id } });
  await db.fichaHeadSpa.deleteMany({ where: { pacienteId: p.id } });
  await db.fichaDepilacao.deleteMany({ where: { pacienteId: p.id } });
  await db.paciente.delete({ where: { id: p.id } });
}

async function main() {
  await limpar();
  const terapeuta = await db.terapeuta.create({
    data: { authUserId: randomUUID(), nome: "Terapeuta Teste", email: `teste-${Date.now()}@exemplo.com` },
  });

  try {
    // validação
    const semTermos = ENVIO_SCHEMA.MASSOTERAPIA.safeParse({ ...formularios.MASSOTERAPIA, aceitaTermos: "" });
    ok(!semTermos.success, "rejeita sem aceitar termos");
    const semAreas = ENVIO_SCHEMA.DEPILACAO.safeParse({ ...formularios.DEPILACAO, areas: "" });
    ok(!semAreas.success, "depilação exige áreas");
    ok(ehBot({ site: "http://spam" }) && !ehBot({ site: "" }), "honeypot detecta bot");

    // envio dos 3 tipos
    for (const tipo of TIPOS) {
      const parsed = ENVIO_SCHEMA[tipo].safeParse(formularios[tipo]);
      ok(parsed.success, `schema ${tipo} aceita dados válidos`);
      if (!parsed.success) throw parsed.error;
      const r = await salvarFicha(tipo, parsed.data as never);
      ok(r.fichaId, `ficha ${tipo} salva`);
    }

    // reenvio cria nova ficha (histórico)
    await salvarFicha("MASSOTERAPIA", ENVIO_SCHEMA.MASSOTERAPIA.parse(formularios.MASSOTERAPIA));
    const pacientes = await db.paciente.findMany({ where: { telefone: TELEFONE } });
    ok(pacientes.length === 1, "uma paciente por telefone normalizado");
    ok(pacientes[0].dataNascimento instanceof Date, "data de nascimento salva");
    const historico = await obterPaciente(pacientes[0].id);
    ok(historico?.fichasMassoterapia.length === 2, "reenvio gera segunda ficha de Massoterapia (histórico)");
    ok(historico?.fichasHeadSpa.length === 1 && historico.fichasDepilacao.length === 1, "uma ficha de cada outro tipo");

    // listagem, detalhe, revisão
    const lista = await listarFichas("MASSOTERAPIA", { busca: "teste" });
    ok(lista.filter((f) => f.paciente.id === pacientes[0].id).length === 2, "listagem por busca traz as 2 fichas");
    const detalhe = await obterFicha("MASSOTERAPIA", lista[0].id);
    ok(detalhe && "gestante" in detalhe && detalhe.gestante === true && "nivelDor" in detalhe && detalhe.nivelDor === 6, "detalhe com colunas corretas");
    await revisarFicha("MASSOTERAPIA", lista[0].id, terapeuta.id, "Revisado no teste");
    const revisada = await obterFicha("MASSOTERAPIA", lista[0].id);
    ok(revisada?.status === "REVISADA" && revisada.revisadaPor?.id === terapeuta.id, "revisão registrada");

    const dep = await listarFichas("DEPILACAO", { busca: TELEFONE });
    const depDetalhe = await obterFicha("DEPILACAO", dep[0].id);
    ok(depDetalhe && "tipoPele" in depDetalhe && depDetalhe.tipoPele === "SENSIVEL" && depDetalhe.pelosEncravados === true, "depilação salva com colunas corretas");

    const contagem = await contarPorTipo();
    ok(contagem.porTipo.MASSOTERAPIA.total >= 2 && contagem.totalPacientes >= 1, "contagem por tipo e pacientes");
    const lp = await listarPacientes("Paciente Teste");
    ok(lp[0]?._count.fichasMassoterapia === 2, "listagem de pacientes com contagem");

    console.log("\nTodos os testes passaram.");
  } finally {
    await limpar();
    await db.terapeuta.delete({ where: { id: terapeuta.id } });
    await db.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

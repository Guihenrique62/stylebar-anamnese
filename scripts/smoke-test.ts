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
  MASSOTERAPIA: {
    ...pessoais,
    objetivos: ["ALIVIO_DORES", "OUTRO"],
    objetivoOutro: "Melhorar o sono",
    regiaoAtencao: "Lombar",
    problemaCardiaco: "sim", problemaCardiacoQual: "Arritmia leve",
    problemaRespiratorio: "nao", problemaColuna: "nao", problemaMuscular: "nao", problemaPele: "nao",
    pressaoArterial: "NAO_SEI",
    medicamentoContinuo: "nao", alergiaProdutos: "nao",
    gestante: "sim", gestanteSemanas: "20",
    produto: "OLEO", pressao: "FORTE",
    jaFezMassagem: "sim", experienciaAnterior: "Relaxante, gostei",
  },
  HEAD_SPA: {
    ...pessoais,
    objetivos: ["RELAXAMENTO", "OUTRO"],
    objetivoOutro: "Brilho",
    couroSensivel: "sim", coceira: "nao", descamacaoCaspa: "nao", oleosidadeExcessiva: "sim",
    feridasLesoes: "nao", vermelhidaoIrritacao: "nao", dorSensibilidadeToque: "nao", quedaIntensa: "nao",
    doencaCouro: "nao", alergia: "sim", alergiaQual: "Níquel", gestante: "nao", problemaCardiaco: "nao",
    medicamentoContinuo: "nao", tipoCabelo: "CACHEADO", quimicaColoracao: "sim", quimicaQual: "Coloração",
    intensidadeMassagem: "FORTE",
  },
  DEPILACAO: {
    ...pessoais,
    areas: ["AXILAS", "OUTRA"],
    areaOutra: "Nuca",
    peleSensivel: "sim", alergiaCosmetico: "sim", alergiaCosmeticoQual: "Cera com resina",
    doencaPele: "nao", feridasCortes: "nao", irritacaoVermelhidao: "nao", foliculiteEncravados: "sim", manchasSensibilidade: "nao",
    gestante: "nao", medicamentoContinuo: "nao", produtoAcne: "sim", produtoAcneQual: "Ácido retinoico",
    procedimentoEstetico: "nao", alergiaConhecida: "nao",
    jaDepilou: "sim", metodos: ["CERA_QUENTE", "LASER"], laserDetalhe: "Axilas, 2025", reacaoAnterior: "nao",
    preferencias: "Cera morna",
  },
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
    const semSemanas = ENVIO_SCHEMA.MASSOTERAPIA.safeParse({ ...formularios.MASSOTERAPIA, gestanteSemanas: "" });
    ok(!semSemanas.success && JSON.stringify(semSemanas.error?.issues).includes("gestanteSemanas"), "massoterapia exige semanas quando gestante = sim");
    const semCardiaco = ENVIO_SCHEMA.MASSOTERAPIA.safeParse({ ...formularios.MASSOTERAPIA, problemaCardiacoQual: "" });
    ok(!semCardiaco.success && JSON.stringify(semCardiaco.error?.issues).includes("problemaCardiacoQual"), "massoterapia exige 'qual' quando problema cardíaco = sim");
    const semAreas = ENVIO_SCHEMA.DEPILACAO.safeParse({ ...formularios.DEPILACAO, areas: "" });
    ok(!semAreas.success, "depilação exige áreas");
    const semMetodos = ENVIO_SCHEMA.DEPILACAO.safeParse({ ...formularios.DEPILACAO, metodos: undefined, laserDetalhe: "" });
    ok(!semMetodos.success && JSON.stringify(semMetodos.error?.issues).includes("metodos"), "depilação exige método quando já depilou");
    const semQualDep = ENVIO_SCHEMA.DEPILACAO.safeParse({ ...formularios.DEPILACAO, alergiaCosmeticoQual: "" });
    ok(!semQualDep.success && JSON.stringify(semQualDep.error?.issues).includes("alergiaCosmeticoQual"), "depilação exige 'qual' quando alergia a cosmético = sim");
    const semLaser = ENVIO_SCHEMA.DEPILACAO.safeParse({ ...formularios.DEPILACAO, laserDetalhe: "" });
    ok(!semLaser.success && JSON.stringify(semLaser.error?.issues).includes("laserDetalhe"), "depilação exige detalhe do laser quando LASER marcado");
    ok(ehBot({ site: "http://spam" }) && !ehBot({ site: "" }), "honeypot detecta bot");
    const semQual = ENVIO_SCHEMA.HEAD_SPA.safeParse({ ...formularios.HEAD_SPA, alergiaQual: "" });
    ok(!semQual.success && JSON.stringify(semQual.error?.issues).includes("alergiaQual"), "head spa exige 'qual' quando alergia = sim");
    const semSimNao = ENVIO_SCHEMA.HEAD_SPA.safeParse({ ...formularios.HEAD_SPA, coceira: undefined });
    ok(!semSimNao.success, "head spa exige resposta sim/não");
    const soUmObjetivo = ENVIO_SCHEMA.HEAD_SPA.safeParse({ ...formularios.HEAD_SPA, objetivos: "RELAXAMENTO", objetivoOutro: "" });
    ok(soUmObjetivo.success && soUmObjetivo.data.objetivos.length === 1, "head spa aceita um único objetivo como string");

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
    ok(detalhe && "produto" in detalhe && detalhe.objetivos.length === 2 && detalhe.pressaoArterial === "NAO_SEI" && detalhe.gestanteSemanas === "20" && detalhe.produto === "OLEO" && detalhe.jaFezMassagem === true, "massoterapia salva com colunas corretas");
    await revisarFicha("MASSOTERAPIA", lista[0].id, terapeuta.id, "Revisado no teste");
    const revisada = await obterFicha("MASSOTERAPIA", lista[0].id);
    ok(revisada?.status === "REVISADA" && revisada.revisadaPor?.id === terapeuta.id, "revisão registrada");

    const hs = await listarFichas("HEAD_SPA", { busca: TELEFONE });
    const hsDetalhe = await obterFicha("HEAD_SPA", hs[0].id);
    ok(hsDetalhe && "tipoCabelo" in hsDetalhe && hsDetalhe.objetivos.length === 2 && hsDetalhe.couroSensivel === true && hsDetalhe.alergiaQual === "Níquel" && hsDetalhe.tipoCabelo === "CACHEADO", "head spa salva com colunas corretas");

    const dep = await listarFichas("DEPILACAO", { busca: TELEFONE });
    const depDetalhe = await obterFicha("DEPILACAO", dep[0].id);
    ok(depDetalhe && "areas" in depDetalhe && depDetalhe.areas.length === 2 && depDetalhe.metodos.includes("LASER") && depDetalhe.peleSensivel === true && depDetalhe.areaOutra === "Nuca", "depilação salva com colunas corretas");

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

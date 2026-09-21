import { db } from "@/server/db";
import type { FichaStatus, TipoFicha } from "@/generated/prisma/enums";
import type { DadosPessoais, EnvioInput } from "@/lib/validation/anamnese";
import { encontrarOuCriarPaciente } from "./pacientes";

/** Respostas do formulário sem os dados pessoais (que vão para a tabela pacientes) nem o honeypot. */
type Respostas<T extends TipoFicha> = Omit<EnvioInput[T], keyof DadosPessoais | "site">;

function semDadosPessoais<T extends TipoFicha>(dados: EnvioInput[T]): Record<string, unknown> {
  const { nome, telefone, email, dataNascimento, site, ...resto } = dados as EnvioInput[T] &
    DadosPessoais & { site?: string };
  void nome; void telefone; void email; void dataNascimento; void site;
  return resto;
}

const RESUMO_SELECT = {
  id: true,
  status: true,
  enviadaEm: true,
  paciente: { select: { id: true, nome: true, telefone: true } },
  revisadaPor: { select: { id: true, nome: true } },
} as const;

const DETALHE_INCLUDE = {
  paciente: true,
  revisadaPor: { select: { id: true, nome: true } },
} as const;

/**
 * Salva uma ficha a partir do envio público. Em uma transação, encontra ou cria a
 * paciente pelo telefone e grava a ficha do tipo. Cada envio gera uma ficha nova
 * (histórico por paciente).
 */
export async function salvarFicha<T extends TipoFicha>(tipo: T, dados: EnvioInput[T]) {
  return db.$transaction(async (tx) => {
    const paciente = await encontrarOuCriarPaciente(tx, dados);
    const respostas = semDadosPessoais(dados);
    const vinculos = { pacienteId: paciente.id };

    let fichaId: string;
    switch (tipo) {
      case "MASSOTERAPIA": {
        const f = await tx.fichaMassoterapia.create({
          data: { ...vinculos, ...(respostas as Respostas<"MASSOTERAPIA">) },
        });
        fichaId = f.id;
        break;
      }
      case "HEAD_SPA": {
        const f = await tx.fichaHeadSpa.create({
          data: { ...vinculos, ...(respostas as Respostas<"HEAD_SPA">) },
        });
        fichaId = f.id;
        break;
      }
      case "DEPILACAO": {
        const f = await tx.fichaDepilacao.create({
          data: { ...vinculos, ...(respostas as Respostas<"DEPILACAO">) },
        });
        fichaId = f.id;
        break;
      }
      default:
        throw new Error(`Tipo de ficha desconhecido: ${String(tipo)}`);
    }

    return { fichaId, pacienteId: paciente.id };
  });
}

export type FiltrosFicha = {
  busca?: string;
  status?: FichaStatus;
  limite?: number;
};

function whereListagem(f: FiltrosFicha) {
  const termo = f.busca?.trim();
  return {
    ...(f.status ? { status: f.status } : {}),
    ...(termo
      ? {
          paciente: {
            OR: [
              { nome: { contains: termo, mode: "insensitive" as const } },
              { telefone: { contains: termo.replace(/\D/g, "") || termo } },
            ],
          },
        }
      : {}),
  };
}

/** Lista resumida das fichas de um tipo, mais recentes primeiro. */
export async function listarFichas(tipo: TipoFicha, filtros: FiltrosFicha = {}) {
  const args = {
    where: whereListagem(filtros),
    orderBy: { enviadaEm: "desc" as const },
    take: filtros.limite ?? 100,
    select: RESUMO_SELECT,
  };
  switch (tipo) {
    case "MASSOTERAPIA":
      return db.fichaMassoterapia.findMany(args);
    case "HEAD_SPA":
      return db.fichaHeadSpa.findMany(args);
    case "DEPILACAO":
      return db.fichaDepilacao.findMany(args);
  }
}

export type FichaResumo = Awaited<ReturnType<typeof listarFichas>>[number];

/** Ficha completa de um tipo, com paciente e revisora. */
export async function obterFicha(tipo: TipoFicha, id: string) {
  const args = { where: { id }, include: DETALHE_INCLUDE };
  switch (tipo) {
    case "MASSOTERAPIA":
      return db.fichaMassoterapia.findUnique(args);
    case "HEAD_SPA":
      return db.fichaHeadSpa.findUnique(args);
    case "DEPILACAO":
      return db.fichaDepilacao.findUnique(args);
  }
}

export type FichaDetalhe = NonNullable<Awaited<ReturnType<typeof obterFicha>>>;

/** Marca a ficha como revisada e registra observações da terapeuta. */
export async function revisarFicha(
  tipo: TipoFicha,
  id: string,
  revisadaPorId: string,
  observacoesTerapeuta?: string,
) {
  const args = {
    where: { id },
    data: { status: "REVISADA" as const, revisadaPorId, observacoesTerapeuta: observacoesTerapeuta ?? null },
  };
  switch (tipo) {
    case "MASSOTERAPIA":
      return db.fichaMassoterapia.update(args);
    case "HEAD_SPA":
      return db.fichaHeadSpa.update(args);
    case "DEPILACAO":
      return db.fichaDepilacao.update(args);
  }
}

/** Contagem total e pendente (ENVIADA) por tipo, e total de pacientes, para o resumo do admin. */
export async function contarPorTipo() {
  const [m, h, d, mp, hp, dp, totalPacientes] = await Promise.all([
    db.fichaMassoterapia.count(),
    db.fichaHeadSpa.count(),
    db.fichaDepilacao.count(),
    db.fichaMassoterapia.count({ where: { status: "ENVIADA" } }),
    db.fichaHeadSpa.count({ where: { status: "ENVIADA" } }),
    db.fichaDepilacao.count({ where: { status: "ENVIADA" } }),
    db.paciente.count(),
  ]);
  return {
    porTipo: {
      MASSOTERAPIA: { total: m, pendentes: mp },
      HEAD_SPA: { total: h, pendentes: hp },
      DEPILACAO: { total: d, pendentes: dp },
    } satisfies Record<TipoFicha, { total: number; pendentes: number }>,
    totalPacientes,
  };
}

import { db } from "@/server/db";
import type { Prisma } from "@/generated/prisma/client";
import type { DadosPessoais } from "@/lib/validation/anamnese";

type Tx = Prisma.TransactionClient;

/**
 * Encontra a paciente pelo telefone normalizado ou cria uma nova.
 * Atualiza nome/e-mail/nascimento com os dados mais recentes informados.
 */
export async function encontrarOuCriarPaciente(tx: Tx, dados: DadosPessoais) {
  return tx.paciente.upsert({
    where: { telefone: dados.telefone },
    update: {
      nome: dados.nome,
      ...(dados.email ? { email: dados.email } : {}),
      ...(dados.dataNascimento ? { dataNascimento: dados.dataNascimento } : {}),
    },
    create: {
      nome: dados.nome,
      telefone: dados.telefone,
      email: dados.email,
      dataNascimento: dados.dataNascimento,
    },
  });
}

/** Pacientes com contagem de fichas por tipo. */
export async function listarPacientes(busca?: string) {
  const termo = busca?.trim();
  return db.paciente.findMany({
    where: termo
      ? {
          OR: [
            { nome: { contains: termo, mode: "insensitive" } },
            { telefone: { contains: termo.replace(/\D/g, "") || termo } },
          ],
        }
      : undefined,
    orderBy: { nome: "asc" },
    take: 200,
    include: {
      _count: {
        select: { fichasMassoterapia: true, fichasHeadSpa: true, fichasDepilacao: true },
      },
    },
  });
}

export async function obterPaciente(id: string) {
  return db.paciente.findUnique({
    where: { id },
    include: {
      fichasMassoterapia: { select: { id: true, status: true, enviadaEm: true } },
      fichasHeadSpa: { select: { id: true, status: true, enviadaEm: true } },
      fichasDepilacao: { select: { id: true, status: true, enviadaEm: true } },
    },
  });
}

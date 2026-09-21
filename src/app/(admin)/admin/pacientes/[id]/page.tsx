import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ICONE_POR_TIPO } from "@/components/anamnese/icones";
import { Chevron } from "@/components/painel/lista-fichas";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { FichaStatus, TipoFicha } from "@/generated/prisma/enums";
import { formatDate } from "@/lib/utils";
import { NOME_POR_TIPO, SLUG_POR_TIPO, TIPOS } from "@/lib/validation/anamnese";
import { obterPaciente } from "@/server/anamnese";
import { requireTerapeuta } from "@/server/auth";

export const metadata: Metadata = { title: "Paciente" };
export const dynamic = "force-dynamic";

type FichaDaPaciente = { tipo: TipoFicha; id: string; status: FichaStatus; enviadaEm: Date };

/** Página da paciente: dados e histórico de todas as fichas, com link para as respostas. */
export default async function PacientePage(props: PageProps<"/admin/pacientes/[id]">) {
  await requireTerapeuta();
  const { id } = await props.params;
  const paciente = await obterPaciente(id);
  if (!paciente) notFound();

  const fichas: FichaDaPaciente[] = [
    ...paciente.fichasMassoterapia.map((f) => ({ ...f, tipo: "MASSOTERAPIA" as const })),
    ...paciente.fichasHeadSpa.map((f) => ({ ...f, tipo: "HEAD_SPA" as const })),
    ...paciente.fichasDepilacao.map((f) => ({ ...f, tipo: "DEPILACAO" as const })),
  ].sort((a, b) => b.enviadaEm.getTime() - a.enviadaEm.getTime());

  const porTipo: Record<TipoFicha, number> = {
    MASSOTERAPIA: paciente.fichasMassoterapia.length,
    HEAD_SPA: paciente.fichasHeadSpa.length,
    DEPILACAO: paciente.fichasDepilacao.length,
  };
  const nascimento = paciente.dataNascimento
    ? new Intl.DateTimeFormat("pt-BR").format(paciente.dataNascimento)
    : null;

  return (
    <>
      <Link href="/admin/pacientes" className="inline-flex min-h-10 items-center gap-1 text-sm text-muted hover:text-primary">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Pacientes
      </Link>

      <Card className="mt-2">
        <h1 className="text-2xl leading-tight sm:text-3xl">{paciente.nome}</h1>
        <p className="mt-1 text-sm text-muted">
          <a href={`tel:+55${paciente.telefone}`} className="font-medium text-primary underline-offset-4 hover:underline">
            {paciente.telefone}
          </a>
          {paciente.email ? ` · ${paciente.email}` : ""}
          {nascimento ? ` · nasc. ${nascimento}` : ""}
        </p>
        <p className="mt-1 text-xs text-muted">Cliente desde {formatDate(paciente.criadoEm)}</p>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-200 pt-4">
          {TIPOS.map((tipo) => (
            <Badge key={tipo} tom={porTipo[tipo] > 0 ? "laranja" : "cinza"}>
              {NOME_POR_TIPO[tipo]} · {porTipo[tipo]}
            </Badge>
          ))}
        </div>
      </Card>

      <div className="mt-6 flex items-baseline justify-between gap-3">
        <CardTitle>Fichas preenchidas</CardTitle>
        <p className="text-sm text-muted">{fichas.length} {fichas.length === 1 ? "ficha" : "fichas"}</p>
      </div>

      <div className="mt-3">
        {fichas.length === 0 ? (
          <EmptyState titulo="Nenhuma ficha ainda" descricao="As fichas aparecem aqui assim que a paciente enviar." />
        ) : (
          <>
            <ul className="flex flex-col gap-3 md:hidden">
              {fichas.map((f) => {
                const Icone = ICONE_POR_TIPO[f.tipo];
                return (
                  <li key={f.id}>
                    <Link
                      href={`/admin/fichas/${SLUG_POR_TIPO[f.tipo]}/${f.id}`}
                      className="flex items-center gap-3 rounded-(--radius-card) border border-gray-200 bg-background p-4 shadow-(--shadow-card) active:bg-gray-100"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                        <Icone className="size-6" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{NOME_POR_TIPO[f.tipo]}</span>
                        <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                          <StatusBadge status={f.status} />
                          <span>{formatDate(f.enviadaEm)}</span>
                        </span>
                      </span>
                      <Chevron />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="hidden overflow-hidden rounded-(--radius-card) border border-gray-200 bg-background md:block">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-left text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Tipo</th>
                    <th className="px-4 py-3 font-medium">Enviada em</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {fichas.map((f) => (
                    <tr key={f.id} className="border-t border-gray-200 hover:bg-background-soft">
                      <td className="px-4 py-3 font-medium">{NOME_POR_TIPO[f.tipo]}</td>
                      <td className="px-4 py-3">{formatDate(f.enviadaEm)}</td>
                      <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/fichas/${SLUG_POR_TIPO[f.tipo]}/${f.id}`} className="font-medium text-primary hover:underline">
                          Ver respostas
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}

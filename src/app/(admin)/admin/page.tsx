import type { Metadata } from "next";
import Link from "next/link";
import { ICONE_POR_TIPO } from "@/components/anamnese/icones";
import { Chevron } from "@/components/painel/lista-fichas";
import { Badge } from "@/components/ui/badge";
import { NOME_POR_TIPO, SLUG_POR_TIPO, TIPOS } from "@/lib/validation/anamnese";
import { contarPorTipo } from "@/server/anamnese";
import { requireTerapeuta } from "@/server/auth";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const terapeuta = await requireTerapeuta();
  const { porTipo, totalPacientes } = await contarPorTipo();
  const pendentes = TIPOS.reduce((acc, t) => acc + porTipo[t].pendentes, 0);

  return (
    <>
      <p className="text-sm text-muted">Olá, {terapeuta.nome.split(" ")[0]}</p>
      <h1 className="mt-1 text-2xl sm:text-3xl">Fichas de anamnese</h1>
      <p className="mt-2 text-sm text-muted">
        {pendentes === 0 ? "Nenhuma ficha aguardando revisão." : `${pendentes} ficha${pendentes > 1 ? "s" : ""} aguardando revisão.`}
      </p>

      <ul className="mt-6 grid gap-3 md:grid-cols-3">
        {TIPOS.map((tipo) => {
          const Icone = ICONE_POR_TIPO[tipo];
          const { total, pendentes: p } = porTipo[tipo];
          return (
            <li key={tipo}>
              <Link
                href={`/admin/fichas/${SLUG_POR_TIPO[tipo]}`}
                className="flex items-center gap-4 rounded-(--radius-card) border border-gray-200 bg-background p-4 shadow-(--shadow-card) transition hover:border-primary active:bg-gray-100 md:flex-col md:items-start md:p-5"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <Icone className="size-7" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg leading-tight md:text-xl">{NOME_POR_TIPO[tipo]}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-2xl font-semibold text-primary md:text-3xl">{total}</span>
                    <span className="text-sm text-muted">{total === 1 ? "ficha" : "fichas"}</span>
                    {p > 0 ? <Badge tom="laranja">{p} a revisar</Badge> : null}
                  </span>
                </span>
                <Chevron />
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        href="/admin/pacientes"
        className="mt-3 flex items-center justify-between gap-4 rounded-(--radius-card) border border-gray-200 bg-background p-4 shadow-(--shadow-card) transition hover:border-primary active:bg-gray-100"
      >
        <span>
          <span className="block font-medium">Pacientes cadastradas</span>
          <span className="text-sm text-muted">{totalPacientes} no total</span>
        </span>
        <Chevron />
      </Link>
    </>
  );
}

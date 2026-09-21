import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Busca, Chips } from "@/components/painel/filtros";
import { ListaFichas } from "@/components/painel/lista-fichas";
import { NOME_POR_TIPO, tipoPorSlug } from "@/lib/validation/anamnese";
import { listarFichas } from "@/server/anamnese";
import { requireTerapeuta } from "@/server/auth";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/admin/fichas/[tipo]">): Promise<Metadata> {
  const { tipo } = await props.params;
  const t = tipoPorSlug(tipo);
  return { title: t ? `Fichas · ${NOME_POR_TIPO[t]}` : "Fichas" };
}

const CHIPS = [
  { valor: "", rotulo: "Todas" },
  { valor: "ENVIADA", rotulo: "A revisar" },
  { valor: "REVISADA", rotulo: "Revisadas" },
];

export default async function FichasPorTipoPage(props: PageProps<"/admin/fichas/[tipo]">) {
  await requireTerapeuta();
  const { tipo: slug } = await props.params;
  const tipo = tipoPorSlug(slug);
  if (!tipo) notFound();

  const sp = await props.searchParams;
  const busca = typeof sp.q === "string" ? sp.q : undefined;
  const status = sp.status === "ENVIADA" || sp.status === "REVISADA" ? sp.status : undefined;

  const fichas = await listarFichas(tipo, { busca, status });

  return (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl">{NOME_POR_TIPO[tipo]}</h1>
        <p className="shrink-0 text-sm text-muted">{fichas.length} {fichas.length === 1 ? "ficha" : "fichas"}</p>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <Busca valor={busca} placeholder="Buscar por nome ou telefone" hidden={{ status }} />
        <Chips chips={CHIPS} ativo={status ?? ""} hrefBase={`/admin/fichas/${slug}`} param="status" outros={{ q: busca }} />
      </div>

      <div className="mt-5">
        <ListaFichas fichas={fichas} slug={slug} />
      </div>
    </>
  );
}

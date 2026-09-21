import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FichaForm } from "@/components/anamnese/ficha-form";
import { secoesDoFormulario } from "@/components/anamnese/campos";
import { CompactHeader } from "@/components/ui/page-header";
import { NOME_POR_TIPO, tipoPorSlug } from "@/lib/validation/anamnese";

export async function generateMetadata(props: PageProps<"/ficha/[tipo]">): Promise<Metadata> {
  const { tipo } = await props.params;
  const t = tipoPorSlug(tipo);
  return { title: t ? NOME_POR_TIPO[t] : "Ficha" };
}

/** Formulário público de um tipo, em etapas. Slug inválido volta para a escolha de tipo em /. */
export default async function FormularioPage(props: PageProps<"/ficha/[tipo]">) {
  const { tipo: slug } = await props.params;
  const tipo = tipoPorSlug(slug);
  if (!tipo) redirect("/");

  return (
    <div className="flex flex-1 flex-col">
      <CompactHeader voltarPara="/" titulo={NOME_POR_TIPO[tipo]} subtitulo="Ficha de anamnese" />
      <FichaForm tipo={tipo} tipoSlug={slug} secoes={secoesDoFormulario(tipo)} />
    </div>
  );
}

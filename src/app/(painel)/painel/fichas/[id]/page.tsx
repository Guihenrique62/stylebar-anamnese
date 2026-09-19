import type { Metadata } from "next";

export const metadata: Metadata = { title: "Detalhe da ficha" };

export default async function FichaDetalhePage(
  props: PageProps<"/painel/fichas/[id]">,
) {
  const { id } = await props.params;
  return (
    <>
      <h1 className="text-3xl">Ficha</h1>
      <p className="mt-2 text-muted">
        Visualização completa da ficha <code>{id}</code>. Em construção.
      </p>
    </>
  );
}

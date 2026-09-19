import type { Metadata } from "next";

export const metadata: Metadata = { title: "Fichas" };

export default function FichasPage() {
  return (
    <>
      <h1 className="text-3xl">Fichas de anamnese</h1>
      <p className="mt-2 text-muted">Listagem com busca e filtros. Em construção.</p>
    </>
  );
}

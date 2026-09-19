import type { Metadata } from "next";

export const metadata: Metadata = { title: "Painel" };

export default function PainelHome() {
  return (
    <>
      <h1 className="text-3xl">Painel</h1>
      <p className="mt-2 text-muted">
        Resumo das fichas recebidas e links ativos. Em construção.
      </p>
    </>
  );
}

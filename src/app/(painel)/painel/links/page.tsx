import type { Metadata } from "next";

export const metadata: Metadata = { title: "Links de preenchimento" };

export default function LinksPage() {
  return (
    <>
      <h1 className="text-3xl">Links de preenchimento</h1>
      <p className="mt-2 text-muted">
        Geração de links únicos para enviar às clientes. Em construção.
      </p>
    </>
  );
}

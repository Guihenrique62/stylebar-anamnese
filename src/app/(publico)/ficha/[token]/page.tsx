import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ficha de anamnese" };

/**
 * Formulário público de anamnese.
 * O token identifica o link gerado pela terapeuta no painel; ele é validado
 * no servidor antes de renderizar o formulário (ver src/server/anamnese).
 */
export default async function FichaPage(
  props: PageProps<"/ficha/[token]">,
) {
  const { token } = await props.params;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <h1 className="text-3xl">Ficha de anamnese</h1>
      <p className="mt-2 text-muted">
        Preencha os dados abaixo com atenção. As informações são confidenciais
        e usadas apenas pela sua terapeuta.
      </p>
      <p className="mt-8 rounded-(--radius-card) border border-border bg-background p-6 text-sm text-muted">
        Formulário em construção. Token do link: <code>{token}</code>
      </p>
    </main>
  );
}

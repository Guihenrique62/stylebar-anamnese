import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ficha enviada" };

export default function ObrigadoPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-3xl">Ficha enviada</h1>
      <p className="mt-3 text-muted">
        Obrigado! Sua terapeuta já tem acesso às informações. Você pode fechar
        esta página.
      </p>
    </main>
  );
}

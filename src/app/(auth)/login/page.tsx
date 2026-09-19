import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-dark px-4 py-16">
      <section className="w-full max-w-sm rounded-(--radius-card) bg-background p-8 shadow-(--shadow-card)">
        <Image
          src="/logo-stylebar.png"
          alt="Stylebar"
          width={200}
          height={58}
          className="mx-auto rounded bg-dark p-3"
        />
        <h1 className="mt-6 text-center text-2xl">Acesso das terapeutas</h1>
        <p className="mt-2 text-center text-sm text-muted">
          Autenticação em construção.
        </p>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

const MENSAGENS: Record<string, string> = {
  inativa: "Seu acesso está desativado. Fale com a administração.",
  "sem-email": "Sua conta não tem e-mail associado.",
};

export default async function LoginPage(props: PageProps<"/login">) {
  const { next, erro } = await props.searchParams;
  const nextPath = typeof next === "string" ? next : undefined;
  const aviso = typeof erro === "string" ? MENSAGENS[erro] : undefined;

  return (
    <main className="flex flex-1 flex-col bg-dark px-4 py-8 sm:items-center sm:justify-center">
      <div className="mb-8 flex justify-center sm:mb-10">
        <Image src="/logo-stylebar.png" alt="Stylebar" width={200} height={58} priority className="h-auto w-44" />
      </div>

      <section className="w-full rounded-(--radius-card) bg-background p-6 shadow-(--shadow-card) sm:max-w-sm sm:p-8">
        <h1 className="text-2xl">Acesso das terapeutas</h1>
        <p className="mt-1 text-sm text-muted">Entre com seu e-mail e senha.</p>
        {aviso ? (
          <p role="alert" className="mt-4 rounded-xl border border-danger/30 bg-red-50 px-4 py-3 text-sm text-danger">
            {aviso}
          </p>
        ) : null}
        <LoginForm next={nextPath} />
      </section>

      <p className="mt-8 text-center text-sm">
        <Link href="/" className="text-white/70 underline-offset-4 hover:text-white hover:underline">
          Voltar para a ficha de anamnese
        </Link>
      </p>
    </main>
  );
}

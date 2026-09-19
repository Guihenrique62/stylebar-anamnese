import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 bg-dark px-4 py-16 text-white">
      <Image
        src="/logo-stylebar.png"
        alt="Stylebar"
        width={320}
        height={93}
        priority
      />
      <p className="max-w-md text-center text-white/80">
        Fichas de anamnese. Clientes preenchem pelo link recebido e as
        terapeutas consultam no painel.
      </p>
      <Link
        href="/login"
        className="rounded-md bg-primary px-10 py-4 text-xs font-medium uppercase tracking-[0.1em] text-white transition hover:bg-primary-hover"
      >
        Acesso das terapeutas
      </Link>
    </main>
  );
}

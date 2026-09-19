import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-3xl">Página não encontrada</h1>
      <p className="text-muted">O link pode ter expirado ou estar incorreto.</p>
      <Link href="/" className="text-primary underline">
        Voltar ao início
      </Link>
    </main>
  );
}

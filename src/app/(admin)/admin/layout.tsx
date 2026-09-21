import Image from "next/image";
import Link from "next/link";
import { logout } from "@/app/(auth)/login/actions";
import { BottomNav, TopNav } from "@/components/painel/bottom-nav";
import { requireTerapeuta } from "@/server/auth";

/**
 * Layout do admin. O proxy já redireciona quem não tem sessão; aqui a verificação
 * real acontece em requireTerapeuta() (claims validadas + registro em terapeutas).
 * Navegação: barra inferior no celular, horizontal no header a partir de md.
 */
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const terapeuta = await requireTerapeuta();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-30 bg-dark text-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-2.5">
          <Link href="/admin" className="shrink-0" aria-label="Início do admin">
            <Image src="/logo-stylebar.png" alt="Stylebar" width={120} height={35} className="h-auto w-28" />
          </Link>
          <TopNav />
          <form action={logout} className="flex items-center gap-3 text-sm">
            <span className="hidden max-w-40 truncate text-white/70 sm:inline">{terapeuta.nome}</span>
            <button
              type="submit"
              className="inline-flex min-h-10 items-center rounded-lg px-3 text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              Sair
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 md:pb-10">{children}</main>

      <BottomNav />
    </div>
  );
}

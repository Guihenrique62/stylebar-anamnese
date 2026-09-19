import Image from "next/image";
import Link from "next/link";

const nav = [
  { href: "/painel", label: "Início" },
  { href: "/painel/fichas", label: "Fichas" },
  { href: "/painel/pacientes", label: "Pacientes" },
  { href: "/painel/links", label: "Links" },
] as const;

/** Layout do painel das terapeutas. Acesso protegido em src/proxy.ts. */
export default function PainelLayout({ children }: LayoutProps<"/painel">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="bg-dark text-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-3">
          <Link href="/painel" className="shrink-0">
            <Image src="/logo-stylebar.png" alt="Stylebar" width={140} height={41} />
          </Link>
          <nav className="flex gap-5 text-sm">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/80 transition hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}

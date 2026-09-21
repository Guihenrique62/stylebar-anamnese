"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { IconeDepilacao, IconeHeadSpa, IconeMassoterapia } from "@/components/anamnese/icones";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; icone: (p: { className?: string }) => ReactNode; exato?: boolean };

const ITENS: Item[] = [
  { href: "/admin", label: "Início", exato: true, icone: (p) => <IconeInicio {...p} /> },
  { href: "/admin/fichas/massoterapia", label: "Masso", icone: (p) => <IconeMassoterapia {...p} /> },
  { href: "/admin/fichas/head-spa", label: "Head Spa", icone: (p) => <IconeHeadSpa {...p} /> },
  { href: "/admin/fichas/depilacao", label: "Depilação", icone: (p) => <IconeDepilacao {...p} /> },
  { href: "/admin/pacientes", label: "Pacientes", icone: (p) => <IconePessoas {...p} /> },
];

function ativo(pathname: string, item: Item) {
  return item.exato ? pathname === item.href : pathname.startsWith(item.href);
}

/** Barra inferior fixa no celular. */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Seções do admin" className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-background/95 backdrop-blur md:hidden">
      <ul className="mx-auto grid max-w-3xl grid-cols-5">
        {ITENS.map((item) => {
          const on = ativo(pathname, item);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                  on ? "text-primary" : "text-muted hover:text-foreground",
                )}
              >
                {item.icone({ className: "size-6" })}
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Navegação horizontal no header, a partir de md. */
export function TopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Seções do admin" className="hidden md:block">
      <ul className="flex gap-1">
        {ITENS.map((item) => {
          const on = ativo(pathname, item);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-10 items-center rounded-lg px-3 text-sm transition",
                  on ? "bg-white/10 text-primary" : "text-white/75 hover:bg-white/10 hover:text-white",
                )}
              >
                {item.label === "Masso" ? "Massoterapia" : item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function IconeInicio({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />
    </svg>
  );
}

function IconePessoas({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4.5-6.2" />
    </svg>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Faixa escura com o logo. Usada no topo das páginas públicas e do login. */
export function BrandBar({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={cn("bg-dark text-white", className)}>
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 px-4 py-6 text-center">
        <Image src="/logo-stylebar.png" alt="Stylebar" width={180} height={53} priority className="h-auto w-40 sm:w-44" />
        {children}
      </div>
    </div>
  );
}

/** Cabeçalho compacto com botão voltar e título, para telas internas. */
export function CompactHeader({ voltarPara, titulo, subtitulo }: { voltarPara: string; titulo: string; subtitulo?: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-2 px-2 py-2">
        <Link
          href={voltarPara}
          aria-label="Voltar"
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-gray-100"
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-xl leading-tight">{titulo}</h1>
          {subtitulo ? <p className="truncate text-xs text-muted">{subtitulo}</p> : null}
        </div>
      </div>
    </header>
  );
}

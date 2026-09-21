import type { Metadata } from "next";
import Link from "next/link";
import { ICONE_POR_TIPO } from "@/components/anamnese/icones";
import { Button } from "@/components/ui/button";
import { BrandBar } from "@/components/ui/page-header";
import { NOME_POR_TIPO, SLUG_POR_TIPO, TIPOS } from "@/lib/validation/anamnese";

export const metadata: Metadata = { title: "Ficha de anamnese" };

const DESCRICAO = {
  MASSOTERAPIA: "Massagens e terapias corporais.",
  HEAD_SPA: "Tratamento de couro cabeludo e cabelo.",
  DEPILACAO: "Depilação com cera e outros métodos.",
} as const;

/** Página pública única: a cliente escolhe o tipo de ficha e segue para o formulário. */
export default function EscolherTipoPage() {
  return (
    <div className="flex flex-1 flex-col">
      <BrandBar className="rounded-b-3xl">
        <p className="max-w-xs text-sm text-white/75">Ficha de anamnese</p>
      </BrandBar>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-10 pt-6">
        <h1 className="text-2xl sm:text-3xl">Qual atendimento você vai fazer?</h1>
        <p className="mt-2 text-sm text-muted sm:text-base">
          Preencha a ficha antes da sua sessão. Leva poucos minutos e suas respostas são confidenciais.
        </p>

        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {TIPOS.map((tipo) => {
            const Icone = ICONE_POR_TIPO[tipo];
            const href = `/ficha/${SLUG_POR_TIPO[tipo]}`;
            return (
              <li key={tipo}>
                <Link
                  href={href}
                  className="group flex h-full flex-col gap-4 rounded-(--radius-card) border border-gray-200 bg-background p-5 shadow-(--shadow-card) transition hover:border-primary active:scale-[0.99]"
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <Icone className="size-7" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-xl">{NOME_POR_TIPO[tipo]}</span>
                    <span className="mt-1 block text-sm text-muted">{DESCRICAO[tipo]}</span>
                  </span>
                  <span className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-xs font-medium uppercase tracking-[0.08em] text-white transition group-hover:bg-primary-hover">
                    Preencher
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex justify-center">
          <Button href="/admin" variante="ghost" tamanho="md">
            Acesso das terapeutas
          </Button>
        </div>
      </main>
    </div>
  );
}

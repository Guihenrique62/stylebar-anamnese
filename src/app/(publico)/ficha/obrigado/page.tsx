import type { Metadata } from "next";
import { IconeCheck } from "@/components/anamnese/icones";
import { Button } from "@/components/ui/button";
import { BrandBar } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Ficha enviada" };

export default function ObrigadoPage() {
  return (
    <div className="flex flex-1 flex-col">
      <BrandBar className="rounded-b-3xl" />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-primary-soft text-primary">
          <IconeCheck className="size-10" strokeWidth={2.2} />
        </span>
        <h1 className="mt-6 text-3xl">Ficha enviada</h1>
        <p className="mt-3 text-muted">
          Obrigado! Sua terapeuta já tem acesso às informações. Você pode fechar esta página.
        </p>
        <Button href="/" variante="secondary" tamanho="lg" largo className="mt-8">
          Preencher outra ficha
        </Button>
      </main>
    </div>
  );
}

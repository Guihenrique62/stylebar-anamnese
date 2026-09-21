import { Button } from "@/components/ui/button";
import { BrandBar } from "@/components/ui/page-header";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col">
      <BrandBar className="rounded-b-3xl" />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-12 text-center">
        <h1 className="text-3xl">Página não encontrada</h1>
        <p className="text-muted">O endereço pode estar incorreto.</p>
        <Button href="/" tamanho="lg" largo className="mt-4">
          Ir para a ficha de anamnese
        </Button>
      </main>
    </div>
  );
}

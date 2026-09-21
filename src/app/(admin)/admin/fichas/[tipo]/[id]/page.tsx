import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SECOES_POR_TIPO, consentimento, type Campo } from "@/components/anamnese/campos";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { TextArea } from "@/components/ui/field";
import { formatDate } from "@/lib/utils";
import { NOME_POR_TIPO, tipoPorSlug } from "@/lib/validation/anamnese";
import { obterFicha } from "@/server/anamnese";
import { requireTerapeuta } from "@/server/auth";
import { revisarFichaAction } from "./actions";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/admin/fichas/[tipo]/[id]">): Promise<Metadata> {
  const { tipo } = await props.params;
  const t = tipoPorSlug(tipo);
  return { title: t ? `Ficha · ${NOME_POR_TIPO[t]}` : "Ficha" };
}

export default async function FichaDetalhePage(props: PageProps<"/admin/fichas/[tipo]/[id]">) {
  await requireTerapeuta();
  const { tipo: slug, id } = await props.params;
  const tipo = tipoPorSlug(slug);
  if (!tipo) notFound();

  const ficha = await obterFicha(tipo, id);
  if (!ficha) notFound();

  // Acesso genérico às colunas para exibir com os rótulos de campos.ts
  const valores = ficha as unknown as Record<string, unknown>;
  const secoes = [...SECOES_POR_TIPO[tipo], consentimento(tipo)];
  const nascimento = ficha.paciente.dataNascimento
    ? new Intl.DateTimeFormat("pt-BR").format(ficha.paciente.dataNascimento)
    : null;

  return (
    <>
      <Link href={`/admin/fichas/${slug}`} className="inline-flex min-h-10 items-center gap-1 text-sm text-muted hover:text-primary">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {NOME_POR_TIPO[tipo]}
      </Link>

      <Card className="mt-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl leading-tight sm:text-3xl">{ficha.paciente.nome}</h1>
            <p className="mt-1 text-sm text-muted">
              <a href={`tel:+55${ficha.paciente.telefone}`} className="font-medium text-primary underline-offset-4 hover:underline">
                {ficha.paciente.telefone}
              </a>
              {ficha.paciente.email ? ` · ${ficha.paciente.email}` : ""}
              {nascimento ? ` · nasc. ${nascimento}` : ""}
            </p>
          </div>
          <StatusBadge status={ficha.status} />
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-200 pt-4 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Enviada em</dt>
            <dd className="mt-0.5">{formatDate(ficha.enviadaEm)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Revisada por</dt>
            <dd className="mt-0.5">{ficha.revisadaPor?.nome ?? "—"}</dd>
          </div>
        </dl>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr] lg:items-start">
        <div className="flex flex-col gap-4">
          {secoes.map((secao) => (
            <Card key={secao.titulo}>
              <CardTitle>{secao.titulo}</CardTitle>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                {secao.campos.map((campo) => (
                  <div key={campo.nome} className={campo.tipo === "textarea" ? "sm:col-span-2" : ""}>
                    <dt className="text-xs uppercase tracking-wide text-muted">{campo.rotulo}</dt>
                    <dd className="mt-1 text-sm">
                      <Valor campo={campo} valor={valores[campo.nome]} />
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>
          ))}
        </div>

        <Card className="lg:sticky lg:top-20">
          <CardTitle>Revisão</CardTitle>
          <form action={revisarFichaAction} className="mt-4 flex flex-col gap-4">
            <input type="hidden" name="tipo" value={slug} />
            <input type="hidden" name="id" value={ficha.id} />
            {/* Server Component: sem render-prop (Field é client); rótulo e controle direto. */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="observacoesTerapeuta" className="text-sm font-medium">
                Observações da terapeuta
              </label>
              <TextArea
                id="observacoesTerapeuta"
                name="observacoesTerapeuta"
                rows={6}
                defaultValue={ficha.observacoesTerapeuta ?? ""}
                aria-describedby="observacoes-ajuda"
              />
              <p id="observacoes-ajuda" className="text-xs text-muted">
                Visível só para a equipe.
              </p>
            </div>
            <Button type="submit" tamanho="lg" largo>
              {ficha.status === "ENVIADA" ? "Marcar como revisada" : "Salvar observações"}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}

function Valor({ campo, valor }: { campo: Campo; valor: unknown }) {
  if (campo.tipo === "multi") {
    const lista = Array.isArray(valor) ? (valor as string[]) : [];
    if (lista.length === 0) return <span className="text-muted">—</span>;
    return (
      <span className="flex flex-wrap gap-1.5">
        {lista.map((v) => (
          <Badge key={v} tom="laranja">
            {campo.opcoes.find((o) => o.valor === v)?.rotulo ?? v}
          </Badge>
        ))}
      </span>
    );
  }
  if (campo.tipo === "checkbox" || campo.tipo === "simnao") {
    return valor ? (
      <span className="inline-flex items-center gap-1.5 font-medium text-primary">
        <span className="size-2 rounded-full bg-primary" /> Sim
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 text-muted">
        <span className="size-2 rounded-full bg-gray-200" /> Não
      </span>
    );
  }
  if (valor === null || valor === undefined || valor === "") return <span className="text-muted">—</span>;
  if (campo.tipo === "select" || campo.tipo === "radio") return <>{campo.opcoes.find((o) => o.valor === valor)?.rotulo ?? String(valor)}</>;
  if (valor instanceof Date) return <>{new Intl.DateTimeFormat("pt-BR").format(valor)}</>;
  if (campo.tipo === "numero") {
    return (
      <span>
        <span className="font-semibold text-primary">{String(valor)}</span>
        <span className="text-muted"> / {campo.max}</span>
      </span>
    );
  }
  return <span className="whitespace-pre-line">{String(valor)}</span>;
}

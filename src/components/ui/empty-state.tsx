import type { ReactNode } from "react";

export function EmptyState({ titulo, descricao, acao }: { titulo: string; descricao?: string; acao?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-(--radius-card) border border-dashed border-border bg-background px-6 py-12 text-center">
      <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M8 4h8l4 4v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3z M9 13h6 M9 17h6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <p className="font-medium">{titulo}</p>
      {descricao ? <p className="max-w-xs text-sm text-muted">{descricao}</p> : null}
      {acao}
    </div>
  );
}

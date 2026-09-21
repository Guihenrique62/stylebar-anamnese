export function Progresso({ atual, total, rotulo }: { atual: number; total: number; rotulo: string }) {
  const pct = Math.round(((atual + 1) / total) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="truncate text-sm font-medium">{rotulo}</p>
        <p className="shrink-0 text-xs text-muted">
          Etapa {atual + 1} de {total}
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`Etapa ${atual + 1} de ${total}`}
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
      >
        <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

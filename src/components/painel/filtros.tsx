import Link from "next/link";
import { cn } from "@/lib/utils";

/** Campo de busca (GET) com ícone; preserva outros parâmetros via hidden inputs. */
export function Busca({ valor, placeholder, hidden }: { valor?: string; placeholder: string; hidden?: Record<string, string | undefined> }) {
  return (
    <form className="flex gap-2" role="search">
      {Object.entries(hidden ?? {}).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <label className="relative flex-1">
        <span className="sr-only">{placeholder}</span>
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          name="q"
          defaultValue={valor}
          placeholder={placeholder}
          enterKeyHint="search"
          className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-foreground placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>
      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-dark px-4 text-xs font-medium uppercase tracking-[0.08em] text-white hover:bg-dark-hover"
      >
        Buscar
      </button>
    </form>
  );
}

export type Chip = { valor: string; rotulo: string };

/** Filtro em chips (links GET), com rolagem horizontal no celular. */
export function Chips({ chips, ativo, hrefBase, param, outros }: { chips: Chip[]; ativo: string; hrefBase: string; param: string; outros?: Record<string, string | undefined> }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none]">
      <ul className="flex w-max gap-2">
        {chips.map((c) => {
          const params = new URLSearchParams();
          for (const [k, v] of Object.entries(outros ?? {})) if (v) params.set(k, v);
          if (c.valor) params.set(param, c.valor);
          const qs = params.toString();
          const on = c.valor === ativo;
          return (
            <li key={c.valor}>
              <Link
                href={qs ? `${hrefBase}?${qs}` : hrefBase}
                aria-current={on ? "true" : undefined}
                className={cn(
                  "inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium transition",
                  on ? "border-primary bg-primary text-white" : "border-border bg-background text-foreground hover:border-primary",
                )}
              >
                {c.rotulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

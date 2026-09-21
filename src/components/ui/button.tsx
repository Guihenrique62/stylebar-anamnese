import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variante = "primary" | "secondary" | "ghost" | "danger" | "dark";
type Tamanho = "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium uppercase tracking-[0.08em] transition select-none disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]";

const VARIANTES: Record<Variante, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover shadow-sm",
  secondary: "bg-background text-foreground border border-border hover:bg-gray-100",
  ghost: "text-primary hover:bg-primary-soft",
  danger: "text-danger hover:bg-red-50",
  dark: "bg-dark text-white hover:bg-dark-hover",
};

const TAMANHOS: Record<Tamanho, string> = {
  md: "min-h-11 px-5 text-xs",
  lg: "min-h-13 px-6 text-sm",
};

type Comum = {
  variante?: Variante;
  tamanho?: Tamanho;
  largo?: boolean;
  className?: string;
  children: ReactNode;
};

type BotaoProps = Comum & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; pending?: boolean };
type LinkProps = Comum & { href: string };

export function Button(props: BotaoProps | LinkProps) {
  const { variante = "primary", tamanho = "md", largo, className, children } = props;
  const classes = cn(BASE, VARIANTES[variante], TAMANHOS[tamanho], largo && "w-full", className);

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  // Remove as props próprias para não vazarem como atributos HTML nem sobrescreverem as classes.
  const { pending, disabled, type = "button", variante: _v, tamanho: _t, largo: _l, className: _c, children: _ch, ...rest } =
    props as BotaoProps;
  void _v; void _t; void _l; void _c; void _ch;
  return (
    <button type={type} disabled={disabled || pending} aria-busy={pending || undefined} {...rest} className={classes}>
      {pending ? <Spinner /> : null}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}

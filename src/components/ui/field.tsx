"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const CONTROLE =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted/70 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 aria-invalid:border-danger";

type FieldProps = {
  id?: string;
  rotulo: ReactNode;
  obrigatorio?: boolean;
  erro?: string;
  ajuda?: string;
  children: (id: string, describedBy: string | undefined) => ReactNode;
};

/** Rótulo + controle + ajuda + erro, com ids ligados para acessibilidade. */
export function Field({ id: idProp, rotulo, obrigatorio, erro, ajuda, children }: FieldProps) {
  const auto = useId();
  const id = idProp ?? auto;
  const erroId = erro ? `${id}-erro` : undefined;
  const ajudaId = ajuda ? `${id}-ajuda` : undefined;
  const describedBy = [erroId, ajudaId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {rotulo}
        {obrigatorio ? <span className="text-primary"> *</span> : null}
      </label>
      {children(id, describedBy)}
      {ajuda && !erro ? (
        <p id={ajudaId} className="text-xs text-muted">
          {ajuda}
        </p>
      ) : null}
      {erro ? (
        <p id={erroId} role="alert" className="text-sm text-danger">
          {erro}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({ className, invalido, ...props }: InputHTMLAttributes<HTMLInputElement> & { invalido?: boolean }) {
  return <input className={cn(CONTROLE, className)} aria-invalid={invalido || undefined} {...props} />;
}

export function TextArea({ className, invalido, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalido?: boolean }) {
  return <textarea rows={3} className={cn(CONTROLE, "resize-y", className)} aria-invalid={invalido || undefined} {...props} />;
}

export function Select({ className, invalido, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { invalido?: boolean }) {
  return (
    <div className="relative">
      <select className={cn(CONTROLE, "appearance-none pr-10", className)} aria-invalid={invalido || undefined} {...props}>
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/** Linha inteira clicável, caixa de 24px. Boa para listas de sim/não no celular. */
export function Checkbox({
  nome,
  rotulo,
  defaultChecked,
  erro,
}: {
  nome: string;
  rotulo: ReactNode;
  defaultChecked?: boolean;
  erro?: string;
}) {
  return (
    <div>
      <label className="flex min-h-13 cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 transition has-checked:border-primary has-checked:bg-primary-soft">
        <input
          type="checkbox"
          name={nome}
          defaultChecked={defaultChecked}
          className="size-6 shrink-0 accent-primary"
        />
        <span className="text-sm leading-snug">{rotulo}</span>
      </label>
      {erro ? (
        <p role="alert" className="mt-1 text-sm text-danger">
          {erro}
        </p>
      ) : null}
    </div>
  );
}

/** Escala numérica como botões, com input hidden para o FormData. */
export function NumberScale({
  nome,
  min,
  max,
  padrao,
  rotuloMin,
  rotuloMax,
}: {
  nome: string;
  min: number;
  max: number;
  padrao?: number;
  rotuloMin?: string;
  rotuloMax?: string;
}) {
  const [valor, setValor] = useState<number>(padrao ?? min);
  const opcoes = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div>
      <input type="hidden" name={nome} value={valor} />
      <div role="radiogroup" className="flex flex-wrap gap-2">
        {opcoes.map((n) => {
          const ativo = n === valor;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={ativo}
              onClick={() => setValor(n)}
              className={cn(
                "min-h-11 min-w-11 flex-1 rounded-xl border text-sm font-medium transition",
                ativo
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-background text-foreground hover:border-primary",
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
      {rotuloMin || rotuloMax ? (
        <div className="mt-1.5 flex justify-between text-xs text-muted">
          <span>{rotuloMin}</span>
          <span>{rotuloMax}</span>
        </div>
      ) : null}
    </div>
  );
}

/** Máscara leve de telefone brasileiro: (00) 00000-0000. */
export function mascararTelefone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function PhoneInput(props: InputHTMLAttributes<HTMLInputElement> & { invalido?: boolean }) {
  const [valor, setValor] = useState(String(props.defaultValue ?? ""));
  const { defaultValue, ...rest } = props;
  void defaultValue;
  return (
    <TextInput
      {...rest}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      value={valor}
      onChange={(e) => setValor(mascararTelefone(e.target.value))}
      placeholder="(11) 99999-9999"
    />
  );
}

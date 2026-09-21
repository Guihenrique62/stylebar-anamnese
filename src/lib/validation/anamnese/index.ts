import { z } from "zod";
import type { TipoFicha } from "@/generated/prisma/enums";
import { consentimentoSchema, dadosPessoaisSchema, honeypotSchema } from "./comum";
import { depilacaoCampos, depilacaoRegras } from "./depilacao";
import { headSpaCampos, headSpaRegras } from "./head-spa";
import { massoterapiaCampos, massoterapiaRegras } from "./massoterapia";

export * from "./comum";
export * from "./massoterapia";
export * from "./head-spa";
export * from "./depilacao";

/** Slug usado na URL ↔ enum do banco. */
export const TIPO_POR_SLUG = {
  massoterapia: "MASSOTERAPIA",
  "head-spa": "HEAD_SPA",
  depilacao: "DEPILACAO",
} as const satisfies Record<string, TipoFicha>;

export type TipoSlug = keyof typeof TIPO_POR_SLUG;

export const SLUG_POR_TIPO: Record<TipoFicha, TipoSlug> = {
  MASSOTERAPIA: "massoterapia",
  HEAD_SPA: "head-spa",
  DEPILACAO: "depilacao",
};

export const TIPOS: readonly TipoFicha[] = ["MASSOTERAPIA", "HEAD_SPA", "DEPILACAO"];

export const NOME_POR_TIPO: Record<TipoFicha, string> = {
  MASSOTERAPIA: "Massoterapia",
  HEAD_SPA: "Head Spa",
  DEPILACAO: "Depilação",
};

export function tipoPorSlug(slug: string): TipoFicha | null {
  return (TIPO_POR_SLUG as Record<string, TipoFicha>)[slug] ?? null;
}

const base = dadosPessoaisSchema.extend(consentimentoSchema.shape).extend(honeypotSchema.shape);

/** Schema completo do envio público: dados pessoais + consentimento + perguntas do tipo. */
export const ENVIO_SCHEMA = {
  MASSOTERAPIA: base.extend(massoterapiaCampos.shape).superRefine(massoterapiaRegras),
  HEAD_SPA: base.extend(headSpaCampos.shape).superRefine(headSpaRegras),
  DEPILACAO: base.extend(depilacaoCampos.shape).superRefine(depilacaoRegras),
} as const;

/**
 * Regras condicionais por tipo, expostas separadamente porque o Zod não executa o
 * superRefine quando já há outros erros. O formulário em etapas as roda à parte.
 */
export const REGRAS_POR_TIPO: Record<TipoFicha, ((d: Record<string, unknown>, ctx: z.RefinementCtx) => void) | null> = {
  MASSOTERAPIA: massoterapiaRegras,
  HEAD_SPA: headSpaRegras,
  DEPILACAO: depilacaoRegras,
};

/** Roda as regras condicionais sobre valores brutos e devolve { campo: mensagem }. */
export function errosDasRegras(tipo: TipoFicha, valores: Record<string, unknown>) {
  const regras = REGRAS_POR_TIPO[tipo];
  if (!regras) return {} as Record<string, string>;
  const issues: z.core.$ZodIssue[] = [];
  const ctx = { addIssue: (i: z.core.$ZodRawIssue) => issues.push({ ...i, path: i.path ?? [] } as z.core.$ZodIssue), value: valores } as unknown as z.RefinementCtx;
  regras(valores, ctx);
  const saida: Record<string, string> = {};
  for (const i of issues) {
    const campo = i.path.join(".") || "_form";
    if (!saida[campo]) saida[campo] = i.message;
  }
  return saida;
}

export type EnvioInput = {
  [K in TipoFicha]: z.infer<(typeof ENVIO_SCHEMA)[K]>;
};

/**
 * Converte FormData em objeto simples. Ignora campos internos (prefixo `_`) e do Next ($ACTION).
 * Chaves repetidas (checkboxes de seleção múltipla) viram array.
 */
export function formDataParaObjeto(formData: FormData) {
  const obj: Record<string, unknown> = {};
  for (const [chave, valor] of formData.entries()) {
    if (chave.startsWith("$ACTION") || chave.startsWith("_")) continue;
    const v = typeof valor === "string" ? valor : undefined;
    if (chave in obj) {
      const atual = obj[chave];
      obj[chave] = Array.isArray(atual) ? [...atual, v] : [atual, v];
    } else {
      obj[chave] = v;
    }
  }
  return obj;
}

/** Erros do Zod em formato simples { campo: mensagem }. */
export function formatarErros(erro: z.ZodError) {
  const saida: Record<string, string> = {};
  for (const issue of erro.issues) {
    const campo = issue.path.join(".") || "_form";
    if (!saida[campo]) saida[campo] = issue.message;
  }
  return saida;
}

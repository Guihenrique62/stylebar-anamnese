import { z } from "zod";
import type { TipoFicha } from "@/generated/prisma/enums";
import { consentimentoSchema, dadosPessoaisSchema, honeypotSchema } from "./comum";
import { depilacaoSchema } from "./depilacao";
import { headSpaSchema } from "./head-spa";
import { massoterapiaSchema } from "./massoterapia";

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
  MASSOTERAPIA: base.extend(massoterapiaSchema.shape),
  HEAD_SPA: base.extend(headSpaSchema.shape),
  DEPILACAO: base.extend(depilacaoSchema.shape),
} as const;

export type EnvioInput = {
  [K in TipoFicha]: z.infer<(typeof ENVIO_SCHEMA)[K]>;
};

/** Converte FormData em objeto simples. Ignora campos internos (prefixo `_`) e do Next ($ACTION). */
export function formDataParaObjeto(formData: FormData) {
  const obj: Record<string, unknown> = {};
  for (const [chave, valor] of formData.entries()) {
    if (chave.startsWith("$ACTION") || chave.startsWith("_")) continue;
    obj[chave] = typeof valor === "string" ? valor : undefined;
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

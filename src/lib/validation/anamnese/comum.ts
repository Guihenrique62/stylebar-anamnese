import { z } from "zod";

/**
 * Helpers para campos vindos de FormData (tudo chega como string).
 */

/** Checkbox: presente ("on"/"true"/"1") = true; ausente = false. */
export const checkbox = z.preprocess(
  (v) => v === "on" || v === "true" || v === "1" || v === true,
  z.boolean(),
);

/** Texto opcional: string vazia vira undefined. */
export const textoOpcional = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().trim().max(2000).optional(),
);

/** Inteiro em intervalo, aceitando string numérica. */
export const inteiro = (min: number, max: number) =>
  z.coerce.number().int().min(min).max(max);

/** Data opcional (input type="date", "YYYY-MM-DD"). */
export const dataOpcional = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.coerce.date().optional(),
);

/** Dados pessoais da paciente, comuns aos três formulários. */
export const dadosPessoaisSchema = z.object({
  nome: z.string().trim().min(3, "Informe o nome completo").max(120),
  telefone: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().min(10, "Telefone inválido").max(13, "Telefone inválido")),
  email: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().email("E-mail inválido").max(160).optional(),
  ),
  dataNascimento: dataOpcional,
});

/** Pergunta Sim/Não (radio obrigatório). "sim" → true, "nao" → false. */
export const simNao = z.preprocess(
  (v) => (v === "sim" || v === true ? true : v === "nao" || v === false ? false : v),
  z.boolean({ error: "Responda sim ou não" }),
);

/** Seleção múltipla de um enum (checkboxes com o mesmo name). Aceita string, string[] ou vazio. */
export const multiEnum = <const T extends readonly [string, ...string[]]>(valores: T, minimo = 0) =>
  z.preprocess(
    (v) => (v === undefined || v === null || v === "" ? [] : Array.isArray(v) ? v : [v]),
    z.array(z.enum(valores)).min(minimo, minimo > 0 ? "Escolha ao menos uma opção" : undefined),
  );

/**
 * Exige um texto complementar ("Qual?") quando a resposta correspondente é Sim.
 * Uso: schema.superRefine(exigirQuando("alergia", "alergiaQual"))
 */
export function exigirQuando<T extends Record<string, unknown>>(
  condicao: keyof T & string,
  campo: keyof T & string,
  mensagem = "Informe qual",
  valorArray = "OUTRO",
) {
  return (dados: T, ctx: z.RefinementCtx) => {
    const c = dados[condicao];
    // Aceita valores já convertidos (boolean) e brutos do formulário ("sim"), para rodar também no cliente.
    // Para seleção múltipla, ativa quando a lista contém `valorArray` (padrão "OUTRO").
    const ativo = Array.isArray(c) ? c.includes(valorArray) : c === true || c === "sim" || c === valorArray;
    const v = dados[campo];
    if (ativo && (typeof v !== "string" || v.trim() === "")) {
      ctx.addIssue({ code: "custom", path: [campo], message: mensagem });
    }
  };
}

/**
 * Honeypot anti-bot: campo invisível para pessoas. Se vier preenchido, o envio é de um robô.
 * O nome é neutro de propósito.
 */
export const honeypotSchema = z.object({
  site: z.preprocess((v) => (typeof v === "string" ? v : ""), z.string()),
});

export function ehBot(dados: { site?: string }) {
  return Boolean(dados.site && dados.site.trim().length > 0);
}

/** Consentimento, comum aos três formulários. */
export const consentimentoSchema = z.object({
  aceitaTermos: checkbox.refine((v) => v === true, {
    message: "É necessário confirmar a declaração para enviar a ficha",
  }),
});

export type DadosPessoais = z.infer<typeof dadosPessoaisSchema>;
export type Consentimento = z.infer<typeof consentimentoSchema>;

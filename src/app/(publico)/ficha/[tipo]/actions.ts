"use server";

import { redirect } from "next/navigation";
import {
  ENVIO_SCHEMA,
  ehBot,
  formDataParaObjeto,
  formatarErros,
  tipoPorSlug,
} from "@/lib/validation/anamnese";
import { salvarFicha } from "@/server/anamnese";

export type EnvioState =
  | { ok: false; erros: Record<string, string>; valores: Record<string, unknown> }
  | undefined;

const DESTINO_SUCESSO = "/ficha/obrigado";

/**
 * Recebe o formulário público, valida com o schema do tipo e salva.
 * Página pública por design: a proteção é o honeypot (bots recebem um "sucesso" sem gravar nada).
 */
export async function enviarFicha(_prev: EnvioState, formData: FormData): Promise<EnvioState> {
  const tipo = tipoPorSlug(String(formData.get("_tipo") ?? ""));
  if (!tipo) return { ok: false, erros: { _form: "Tipo de ficha inválido" }, valores: {} };

  const valores = formDataParaObjeto(formData);

  if (ehBot({ site: typeof valores.site === "string" ? valores.site : undefined })) {
    redirect(DESTINO_SUCESSO);
  }

  const parsed = ENVIO_SCHEMA[tipo].safeParse(valores);
  if (!parsed.success) {
    return { ok: false, erros: formatarErros(parsed.error), valores };
  }

  try {
    await salvarFicha(tipo, parsed.data);
  } catch (erro) {
    console.error("[enviarFicha]", erro);
    return {
      ok: false,
      erros: { _form: "Não foi possível salvar a ficha. Tente novamente." },
      valores,
    };
  }

  redirect(DESTINO_SUCESSO);
}

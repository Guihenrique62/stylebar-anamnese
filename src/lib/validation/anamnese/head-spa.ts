import { z } from "zod";
import { exigirQuando, multiEnum, simNao, textoOpcional } from "./comum";

export const OBJETIVOS_HEAD_SPA = [
  "RELAXAMENTO",
  "REDUCAO_ESTRESSE",
  "HIGIENIZACAO_PROFUNDA",
  "CONTROLE_OLEOSIDADE",
  "ALIVIO_SENSIBILIDADE",
  "QUEDA_CAPILAR",
  "OUTRO",
] as const;

/** Perguntas oficiais da ficha de Head Spa (papel, 2026-09-21). Objeto puro, sem refinements. */
export const headSpaCampos = z.object({
  // 2. objetivo do atendimento
  objetivos: multiEnum(OBJETIVOS_HEAD_SPA, 1),
  objetivoOutro: textoOpcional,

  // 3. histórico capilar
  couroSensivel: simNao,
  coceira: simNao,
  descamacaoCaspa: simNao,
  oleosidadeExcessiva: simNao,
  feridasLesoes: simNao,
  vermelhidaoIrritacao: simNao,
  dorSensibilidadeToque: simNao,
  quedaIntensa: simNao,
  doencaCouro: simNao,
  doencaCouroQual: textoOpcional,

  // 4. informações de saúde
  alergia: simNao,
  alergiaQual: textoOpcional,
  gestante: simNao,
  problemaCardiaco: simNao,
  medicamentoContinuo: simNao,
  medicamentoQual: textoOpcional,

  // 5. características dos cabelos
  tipoCabelo: z.enum(["LISO", "ONDULADO", "CACHEADO", "CRESPO"], { error: "Escolha o tipo de cabelo" }),
  quimicaColoracao: simNao,
  quimicaQual: textoOpcional,

  // 6. preferência de massagem capilar
  intensidadeMassagem: z.enum(["SUAVE", "MODERADA", "FORTE"], { error: "Escolha a intensidade" }),

  observacoes: textoOpcional,
});

/** Regras condicionais ("Qual?" obrigatório quando a resposta é Sim/Outro). Aplicadas no schema completo. */
export function headSpaRegras(d: Record<string, unknown>, ctx: z.RefinementCtx) {
  exigirQuando("objetivos", "objetivoOutro", "Descreva o objetivo")(d, ctx);
  exigirQuando("doencaCouro", "doencaCouroQual")(d, ctx);
  exigirQuando("alergia", "alergiaQual")(d, ctx);
  exigirQuando("medicamentoContinuo", "medicamentoQual")(d, ctx);
  exigirQuando("quimicaColoracao", "quimicaQual")(d, ctx);
}

export const headSpaSchema = headSpaCampos.superRefine(headSpaRegras);
export type FichaHeadSpaInput = z.infer<typeof headSpaSchema>;

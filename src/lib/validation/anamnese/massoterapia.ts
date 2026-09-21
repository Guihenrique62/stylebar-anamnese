import { z } from "zod";
import { exigirQuando, multiEnum, simNao, textoOpcional } from "./comum";

export const OBJETIVOS_MASSAGEM = [
  "RELAXAMENTO",
  "REDUCAO_ESTRESSE",
  "ALIVIO_DORES",
  "RELAXAMENTO_MUSCULAR",
  "BEM_ESTAR",
  "OUTRO",
] as const;

/** Perguntas oficiais da ficha de Massoterapia (papel, 2026-09-21). Objeto puro, sem refinements. */
export const massoterapiaCampos = z.object({
  // 2. objetivo do atendimento
  objetivos: multiEnum(OBJETIVOS_MASSAGEM, 1),
  objetivoOutro: textoOpcional,
  regiaoAtencao: textoOpcional,

  // 3. condições de saúde
  problemaCardiaco: simNao,
  problemaCardiacoQual: textoOpcional,
  problemaRespiratorio: simNao,
  problemaRespiratorioQual: textoOpcional,
  problemaColuna: simNao,
  problemaColunaQual: textoOpcional,
  problemaMuscular: simNao,
  problemaMuscularQual: textoOpcional,
  problemaPele: simNao,
  problemaPeleQual: textoOpcional,
  pressaoArterial: z.enum(["NAO", "SIM", "NAO_SEI"], { error: "Escolha uma opção" }),
  medicamentoContinuo: simNao,
  medicamentoQuais: textoOpcional,
  alergiaProdutos: simNao,
  alergiaProdutosQual: textoOpcional,
  gestante: simNao,
  gestanteSemanas: textoOpcional,
  outraCondicao: textoOpcional,

  // 4. preferências para a massagem
  produto: z.enum(["OLEO", "CREME", "SEM_PREFERENCIA"], { error: "Escolha uma opção" }),
  pressao: z.enum(["LEVE", "MODERADA", "FORTE"], { error: "Escolha uma opção" }),
  regiaoEvitar: textoOpcional,
  jaFezMassagem: simNao,
  experienciaAnterior: textoOpcional,
  naoGostou: textoOpcional,
  preferencias: textoOpcional,
});

/** Regras condicionais. Aplicadas no schema completo e, à parte, na validação por etapa. */
export function massoterapiaRegras(d: Record<string, unknown>, ctx: z.RefinementCtx) {
  exigirQuando("objetivos", "objetivoOutro", "Descreva o objetivo")(d, ctx);
  exigirQuando("problemaCardiaco", "problemaCardiacoQual")(d, ctx);
  exigirQuando("problemaRespiratorio", "problemaRespiratorioQual")(d, ctx);
  exigirQuando("problemaColuna", "problemaColunaQual")(d, ctx);
  exigirQuando("problemaMuscular", "problemaMuscularQual")(d, ctx);
  exigirQuando("problemaPele", "problemaPeleQual")(d, ctx);
  exigirQuando("medicamentoContinuo", "medicamentoQuais", "Informe quais")(d, ctx);
  exigirQuando("alergiaProdutos", "alergiaProdutosQual")(d, ctx);
  exigirQuando("gestante", "gestanteSemanas", "Informe quantas semanas")(d, ctx);
}

export const massoterapiaSchema = massoterapiaCampos.superRefine(massoterapiaRegras);
export type FichaMassoterapiaInput = z.infer<typeof massoterapiaSchema>;

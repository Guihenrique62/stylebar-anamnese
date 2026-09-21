import { z } from "zod";
import { exigirQuando, multiEnum, simNao, textoOpcional } from "./comum";

export const AREAS_DEPILACAO = [
  "BUCO",
  "ROSTO",
  "AXILAS",
  "BRACOS",
  "PERNAS",
  "VIRILHA",
  "INTIMA_COMPLETA",
  "COSTAS",
  "ABDOMEN",
  "OUTRA",
] as const;

export const METODOS_DEPILACAO = ["CERA_QUENTE", "CERA_FRIA", "LAMINA", "CREME_DEPILATORIO", "LINHA", "LASER"] as const;

/** Perguntas oficiais da ficha de Depilação (papel, 2026-09-21). Objeto puro, sem refinements. */
export const depilacaoCampos = z.object({
  // 2. área a ser depilada
  areas: multiEnum(AREAS_DEPILACAO, 1),
  areaOutra: textoOpcional,

  // 3. histórico da pele
  peleSensivel: simNao,
  alergiaCosmetico: simNao,
  alergiaCosmeticoQual: textoOpcional,
  doencaPele: simNao,
  doencaPeleQual: textoOpcional,
  feridasCortes: simNao,
  irritacaoVermelhidao: simNao,
  foliculiteEncravados: simNao,
  manchasSensibilidade: simNao,

  // 4. informações de saúde
  gestante: simNao,
  medicamentoContinuo: simNao,
  medicamentoQual: textoOpcional,
  produtoAcne: simNao,
  produtoAcneQual: textoOpcional,
  procedimentoEstetico: simNao,
  procedimentoQualQuando: textoOpcional,
  alergiaConhecida: simNao,
  alergiaConhecidaQual: textoOpcional,

  // 5. histórico de depilação
  jaDepilou: simNao,
  metodos: multiEnum(METODOS_DEPILACAO),
  laserDetalhe: textoOpcional,
  reacaoAnterior: simNao,
  reacaoQual: textoOpcional,

  // 6. preferências e observações
  preferencias: textoOpcional,
});

/** Regras condicionais. Aplicadas no schema completo e, à parte, na validação por etapa. */
export function depilacaoRegras(d: Record<string, unknown>, ctx: z.RefinementCtx) {
  exigirQuando("areas", "areaOutra", "Informe a outra área", "OUTRA")(d, ctx);
  exigirQuando("alergiaCosmetico", "alergiaCosmeticoQual")(d, ctx);
  exigirQuando("doencaPele", "doencaPeleQual")(d, ctx);
  exigirQuando("medicamentoContinuo", "medicamentoQual")(d, ctx);
  exigirQuando("produtoAcne", "produtoAcneQual")(d, ctx);
  exigirQuando("procedimentoEstetico", "procedimentoQualQuando", "Informe qual e quando")(d, ctx);
  exigirQuando("alergiaConhecida", "alergiaConhecidaQual")(d, ctx);
  exigirQuando("reacaoAnterior", "reacaoQual")(d, ctx);
  exigirQuando("metodos", "laserDetalhe", "Informe detalhes do laser (onde e quando)", "LASER")(d, ctx);

  const jaDepilou = d.jaDepilou === true || d.jaDepilou === "sim";
  const metodos = Array.isArray(d.metodos) ? d.metodos : d.metodos ? [d.metodos] : [];
  if (jaDepilou && metodos.length === 0) {
    ctx.addIssue({ code: "custom", path: ["metodos"], message: "Marque ao menos um método" });
  }
}

export const depilacaoSchema = depilacaoCampos.superRefine(depilacaoRegras);
export type FichaDepilacaoInput = z.infer<typeof depilacaoSchema>;

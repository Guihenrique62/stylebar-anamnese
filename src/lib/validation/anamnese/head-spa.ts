import { z } from "zod";
import { checkbox, dataOpcional, textoOpcional } from "./comum";

/** Perguntas provisórias da anamnese de Head Spa. Ajustar com as terapeutas. */
export const headSpaSchema = z.object({
  // cabelo e couro cabeludo
  tipoCabelo: z.string().trim().min(2, "Informe o tipo de cabelo").max(120),
  tipoCouro: z.enum(["NORMAL", "OLEOSO", "SECO", "MISTO", "SENSIVEL"]),
  quedaCabelo: checkbox,
  caspaDescamacao: checkbox,
  coceiraIrritacao: checkbox,
  feridasLesoes: checkbox,
  dermatitePsoriase: checkbox,
  alergiaCosmeticos: textoOpcional,
  quimicaRecente: textoOpcional,
  dataQuimica: dataOpcional,

  // hábitos
  frequenciaLavagem: z.enum(["DIARIA", "ALTERNADA", "DUAS_VEZES_SEMANA", "SEMANAL"]),
  usoCalor: checkbox,

  // saúde
  gestante: checkbox,
  hipertensao: checkbox,
  enxaqueca: checkbox,
  lentesAparelhoAuditivo: checkbox,
  sensibilidadeTemperatura: checkbox,

  objetivo: z.string().trim().min(3, "Descreva o objetivo do tratamento").max(2000),
  observacoes: textoOpcional,
});

export type FichaHeadSpaInput = z.infer<typeof headSpaSchema>;

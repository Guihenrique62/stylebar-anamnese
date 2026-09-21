import { z } from "zod";
import { checkbox, dataOpcional, textoOpcional } from "./comum";

/** Perguntas provisórias da anamnese de Depilação. Ajustar com as terapeutas. */
export const depilacaoSchema = z.object({
  // depilação
  areas: z.string().trim().min(2, "Informe as áreas a depilar").max(500),
  metodoPreferido: z.enum(["CERA_QUENTE", "CERA_FRIA", "ROLL_ON", "LINHA", "LAMINA", "OUTRO"]),
  metodoAtual: textoOpcional,
  ultimaDepilacao: dataOpcional,
  primeiraVezCera: checkbox,

  // pele
  tipoPele: z.enum(["NORMAL", "SECA", "OLEOSA", "MISTA", "SENSIVEL"]),
  pelosEncravados: checkbox,
  foliculite: checkbox,
  lesoesPele: textoOpcional,
  manchasCicatrizes: textoOpcional,
  alergiaCosmeticos: textoOpcional,

  // saúde
  usoAcidosRetinoides: checkbox,
  exposicaoSolarRecente: checkbox,
  gestante: checkbox,
  diabetes: checkbox,
  varizes: checkbox,
  problemasCirculatorios: checkbox,
  anticoagulantes: checkbox,
  medicamentos: textoOpcional,
  alergias: textoOpcional,

  observacoes: textoOpcional,
});

export type FichaDepilacaoInput = z.infer<typeof depilacaoSchema>;

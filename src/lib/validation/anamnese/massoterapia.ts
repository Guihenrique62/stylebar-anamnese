import { z } from "zod";
import { checkbox, inteiro, textoOpcional } from "./comum";

/** Perguntas provisórias da anamnese de Massoterapia. Ajustar com as terapeutas. */
export const massoterapiaSchema = z.object({
  // queixa
  queixaPrincipal: z.string().trim().min(3, "Descreva a queixa principal").max(2000),
  tempoQueixa: textoOpcional,
  nivelDor: inteiro(0, 10).default(0),
  regioesDor: textoOpcional,
  tratamentosAnteriores: textoOpcional,

  // saúde
  doencasCronicas: textoOpcional,
  cirurgias: textoOpcional,
  medicamentos: textoOpcional,
  alergias: textoOpcional,
  gestante: checkbox,
  lactante: checkbox,
  marcapassoProtese: checkbox,
  varizesTrombose: checkbox,
  pressaoArterial: z.enum(["BAIXA", "NORMAL", "ALTA"]).default("NORMAL"),

  // hábitos
  qualidadeSono: z.enum(["RUIM", "REGULAR", "BOA"]).default("REGULAR"),
  nivelEstresse: inteiro(1, 5).default(3),
  atividadeFisica: textoOpcional,

  // preferências
  pressaoToque: z.enum(["LEVE", "MEDIA", "FORTE"]).default("MEDIA"),
  regioesEvitar: textoOpcional,
  observacoes: textoOpcional,
});

export type FichaMassoterapiaInput = z.infer<typeof massoterapiaSchema>;

/**
 * Modelo de domínio do sistema de anamnese.
 * Os tipos vêm do Prisma (banco) e dos schemas Zod (entrada dos formulários).
 */

export type {
  Terapeuta,
  Paciente,
  FichaMassoterapia,
  FichaHeadSpa,
  FichaDepilacao,
} from "@/generated/prisma/client";

export type { TipoFicha, FichaStatus } from "@/generated/prisma/enums";

export type {
  DadosPessoais,
  Consentimento,
  FichaMassoterapiaInput,
  FichaHeadSpaInput,
  FichaDepilacaoInput,
  EnvioInput,
  TipoSlug,
} from "@/lib/validation/anamnese";

export type { FichaResumo, FichaDetalhe } from "@/server/anamnese/fichas";

/**
 * Modelo de domínio do sistema de anamnese.
 * Serve de contrato entre formulário público, painel e camada de dados.
 */

export type Terapeuta = {
  id: string;
  nome: string;
  email: string;
  unidade?: string;
  criadoEm: Date;
};

export type Paciente = {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  dataNascimento?: Date;
  criadoEm: Date;
};

export type LinkStatus = "ativo" | "usado" | "expirado";

/** Link único enviado à cliente para preencher a ficha. */
export type LinkAnamnese = {
  id: string;
  token: string;
  terapeutaId: string;
  pacienteId?: string;
  status: LinkStatus;
  expiraEm: Date;
  criadoEm: Date;
};

export type FichaStatus = "enviada" | "revisada";

export type FichaAnamnese = {
  id: string;
  linkId: string;
  pacienteId: string;
  terapeutaId: string;
  status: FichaStatus;
  respostas: RespostasAnamnese;
  observacoesTerapeuta?: string;
  enviadaEm: Date;
};

/** Respostas do formulário. Os campos serão refinados com as terapeutas. */
export type RespostasAnamnese = {
  dadosPessoais: {
    nome: string;
    telefone: string;
    email?: string;
    dataNascimento?: string;
    profissao?: string;
  };
  saude: {
    alergias?: string;
    medicamentos?: string;
    gestante: boolean;
    condicoes: string[];
    cirurgiasRecentes?: string;
  };
  habitos: {
    exposicaoSolar: "baixa" | "media" | "alta";
    fumante: boolean;
    consumoAgua?: string;
    atividadeFisica?: string;
  };
  procedimento: {
    servicoDesejado: string;
    procedimentosAnteriores?: string;
    expectativa?: string;
  };
  consentimento: {
    aceitaTermos: boolean;
    aceitaImagem: boolean;
    assinadoEm: string;
  };
};

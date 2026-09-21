import type { TipoFicha } from "@/generated/prisma/enums";

/**
 * Descrição dos campos de cada formulário. Usada para renderizar o form público
 * e para exibir a ficha no admin com rótulos legíveis. Nomes batem com o schema Zod
 * e com as colunas do Prisma.
 */
export type Campo =
  | { nome: string; rotulo: string; tipo: "texto"; obrigatorio?: boolean; placeholder?: string }
  | { nome: string; rotulo: string; tipo: "textarea"; obrigatorio?: boolean }
  | { nome: string; rotulo: string; tipo: "numero"; min: number; max: number; padrao?: number }
  | { nome: string; rotulo: string; tipo: "data" }
  | { nome: string; rotulo: string; tipo: "checkbox" }
  | { nome: string; rotulo: string; tipo: "select"; opcoes: { valor: string; rotulo: string }[] };

export type Secao = { titulo: string; campos: Campo[] };

export const DADOS_PESSOAIS: Secao = {
  titulo: "Dados pessoais",
  campos: [
    { nome: "nome", rotulo: "Nome completo", tipo: "texto", obrigatorio: true },
    { nome: "telefone", rotulo: "Telefone (WhatsApp)", tipo: "texto", obrigatorio: true, placeholder: "(11) 99999-9999" },
    { nome: "email", rotulo: "E-mail", tipo: "texto" },
    { nome: "dataNascimento", rotulo: "Data de nascimento", tipo: "data" },
  ],
};

export const CONSENTIMENTO: Secao = {
  titulo: "Consentimento",
  campos: [
    { nome: "aceitaTermos", rotulo: "Declaro que as informações são verdadeiras e autorizo o uso para o atendimento", tipo: "checkbox" },
    { nome: "aceitaImagem", rotulo: "Autorizo o uso de imagem para acompanhamento do tratamento", tipo: "checkbox" },
  ],
};

const SIM_NAO_TEXTO = (nome: string, rotulo: string): Campo => ({ nome, rotulo, tipo: "checkbox" });

export const SECOES_POR_TIPO: Record<TipoFicha, Secao[]> = {
  MASSOTERAPIA: [
    {
      titulo: "Queixa",
      campos: [
        { nome: "queixaPrincipal", rotulo: "Queixa principal", tipo: "textarea", obrigatorio: true },
        { nome: "tempoQueixa", rotulo: "Há quanto tempo?", tipo: "texto" },
        { nome: "nivelDor", rotulo: "Nível de dor (0 a 10)", tipo: "numero", min: 0, max: 10, padrao: 0 },
        { nome: "regioesDor", rotulo: "Regiões de dor", tipo: "texto" },
        { nome: "tratamentosAnteriores", rotulo: "Tratamentos anteriores", tipo: "textarea" },
      ],
    },
    {
      titulo: "Saúde",
      campos: [
        { nome: "doencasCronicas", rotulo: "Doenças crônicas", tipo: "texto" },
        { nome: "cirurgias", rotulo: "Cirurgias", tipo: "texto" },
        { nome: "medicamentos", rotulo: "Medicamentos em uso", tipo: "texto" },
        { nome: "alergias", rotulo: "Alergias", tipo: "texto" },
        SIM_NAO_TEXTO("gestante", "Gestante"),
        SIM_NAO_TEXTO("lactante", "Lactante"),
        SIM_NAO_TEXTO("marcapassoProtese", "Marcapasso ou próteses metálicas"),
        SIM_NAO_TEXTO("varizesTrombose", "Varizes ou histórico de trombose"),
        {
          nome: "pressaoArterial",
          rotulo: "Pressão arterial",
          tipo: "select",
          opcoes: [
            { valor: "BAIXA", rotulo: "Baixa" },
            { valor: "NORMAL", rotulo: "Normal" },
            { valor: "ALTA", rotulo: "Alta" },
          ],
        },
      ],
    },
    {
      titulo: "Hábitos",
      campos: [
        {
          nome: "qualidadeSono",
          rotulo: "Qualidade do sono",
          tipo: "select",
          opcoes: [
            { valor: "RUIM", rotulo: "Ruim" },
            { valor: "REGULAR", rotulo: "Regular" },
            { valor: "BOA", rotulo: "Boa" },
          ],
        },
        { nome: "nivelEstresse", rotulo: "Nível de estresse (1 a 5)", tipo: "numero", min: 1, max: 5, padrao: 3 },
        { nome: "atividadeFisica", rotulo: "Atividade física", tipo: "texto" },
      ],
    },
    {
      titulo: "Preferências",
      campos: [
        {
          nome: "pressaoToque",
          rotulo: "Pressão de toque preferida",
          tipo: "select",
          opcoes: [
            { valor: "LEVE", rotulo: "Leve" },
            { valor: "MEDIA", rotulo: "Média" },
            { valor: "FORTE", rotulo: "Forte" },
          ],
        },
        { nome: "regioesEvitar", rotulo: "Regiões a evitar", tipo: "texto" },
        { nome: "observacoes", rotulo: "Observações", tipo: "textarea" },
      ],
    },
  ],

  HEAD_SPA: [
    {
      titulo: "Cabelo e couro cabeludo",
      campos: [
        { nome: "tipoCabelo", rotulo: "Tipo de cabelo (liso, ondulado, cacheado, crespo...)", tipo: "texto", obrigatorio: true },
        {
          nome: "tipoCouro",
          rotulo: "Tipo de couro cabeludo",
          tipo: "select",
          opcoes: [
            { valor: "NORMAL", rotulo: "Normal" },
            { valor: "OLEOSO", rotulo: "Oleoso" },
            { valor: "SECO", rotulo: "Seco" },
            { valor: "MISTO", rotulo: "Misto" },
            { valor: "SENSIVEL", rotulo: "Sensível" },
          ],
        },
        SIM_NAO_TEXTO("quedaCabelo", "Queda de cabelo"),
        SIM_NAO_TEXTO("caspaDescamacao", "Caspa ou descamação"),
        SIM_NAO_TEXTO("coceiraIrritacao", "Coceira ou irritação"),
        SIM_NAO_TEXTO("feridasLesoes", "Feridas ou lesões no couro cabeludo"),
        SIM_NAO_TEXTO("dermatitePsoriase", "Dermatite ou psoríase"),
        { nome: "alergiaCosmeticos", rotulo: "Alergia a cosméticos (quais?)", tipo: "texto" },
        { nome: "quimicaRecente", rotulo: "Química recente (tipo)", tipo: "texto" },
        { nome: "dataQuimica", rotulo: "Data da última química", tipo: "data" },
      ],
    },
    {
      titulo: "Hábitos",
      campos: [
        {
          nome: "frequenciaLavagem",
          rotulo: "Frequência de lavagem",
          tipo: "select",
          opcoes: [
            { valor: "DIARIA", rotulo: "Diária" },
            { valor: "ALTERNADA", rotulo: "Dia sim, dia não" },
            { valor: "DUAS_VEZES_SEMANA", rotulo: "Duas vezes por semana" },
            { valor: "SEMANAL", rotulo: "Semanal" },
          ],
        },
        SIM_NAO_TEXTO("usoCalor", "Uso frequente de secador, chapinha ou babyliss"),
      ],
    },
    {
      titulo: "Saúde",
      campos: [
        SIM_NAO_TEXTO("gestante", "Gestante"),
        SIM_NAO_TEXTO("hipertensao", "Hipertensão"),
        SIM_NAO_TEXTO("enxaqueca", "Enxaqueca ou dores de cabeça frequentes"),
        SIM_NAO_TEXTO("lentesAparelhoAuditivo", "Usa lentes de contato ou aparelho auditivo"),
        SIM_NAO_TEXTO("sensibilidadeTemperatura", "Sensibilidade a temperatura (quente/frio)"),
      ],
    },
    {
      titulo: "Objetivo",
      campos: [
        { nome: "objetivo", rotulo: "O que espera do tratamento?", tipo: "textarea", obrigatorio: true },
        { nome: "observacoes", rotulo: "Observações", tipo: "textarea" },
      ],
    },
  ],

  DEPILACAO: [
    {
      titulo: "Depilação",
      campos: [
        { nome: "areas", rotulo: "Áreas a depilar", tipo: "texto", obrigatorio: true, placeholder: "Ex.: pernas, axilas, virilha" },
        {
          nome: "metodoPreferido",
          rotulo: "Método preferido",
          tipo: "select",
          opcoes: [
            { valor: "CERA_QUENTE", rotulo: "Cera quente" },
            { valor: "CERA_FRIA", rotulo: "Cera fria" },
            { valor: "ROLL_ON", rotulo: "Roll-on" },
            { valor: "LINHA", rotulo: "Linha" },
            { valor: "LAMINA", rotulo: "Lâmina" },
            { valor: "OUTRO", rotulo: "Outro" },
          ],
        },
        { nome: "metodoAtual", rotulo: "Método que usa atualmente", tipo: "texto" },
        { nome: "ultimaDepilacao", rotulo: "Data da última depilação", tipo: "data" },
        SIM_NAO_TEXTO("primeiraVezCera", "Primeira vez com cera"),
      ],
    },
    {
      titulo: "Pele",
      campos: [
        {
          nome: "tipoPele",
          rotulo: "Tipo de pele",
          tipo: "select",
          opcoes: [
            { valor: "NORMAL", rotulo: "Normal" },
            { valor: "SECA", rotulo: "Seca" },
            { valor: "OLEOSA", rotulo: "Oleosa" },
            { valor: "MISTA", rotulo: "Mista" },
            { valor: "SENSIVEL", rotulo: "Sensível" },
          ],
        },
        SIM_NAO_TEXTO("pelosEncravados", "Tendência a pelos encravados"),
        SIM_NAO_TEXTO("foliculite", "Foliculite"),
        { nome: "lesoesPele", rotulo: "Lesões, feridas ou irritações na pele", tipo: "texto" },
        { nome: "manchasCicatrizes", rotulo: "Manchas ou cicatrizes na região", tipo: "texto" },
        { nome: "alergiaCosmeticos", rotulo: "Alergia a cosméticos ou cera (quais?)", tipo: "texto" },
      ],
    },
    {
      titulo: "Saúde",
      campos: [
        SIM_NAO_TEXTO("usoAcidosRetinoides", "Uso de ácidos, retinoides, isotretinoína ou peeling recente"),
        SIM_NAO_TEXTO("exposicaoSolarRecente", "Exposição solar ou bronzeamento nos últimos dias"),
        SIM_NAO_TEXTO("gestante", "Gestante"),
        SIM_NAO_TEXTO("diabetes", "Diabetes"),
        SIM_NAO_TEXTO("varizes", "Varizes"),
        SIM_NAO_TEXTO("problemasCirculatorios", "Problemas circulatórios"),
        SIM_NAO_TEXTO("anticoagulantes", "Uso de anticoagulantes"),
        { nome: "medicamentos", rotulo: "Medicamentos em uso", tipo: "texto" },
        { nome: "alergias", rotulo: "Alergias", tipo: "texto" },
      ],
    },
    {
      titulo: "Observações",
      campos: [{ nome: "observacoes", rotulo: "Observações", tipo: "textarea" }],
    },
  ],
};

/** Todas as seções do formulário público de um tipo, na ordem de exibição. */
export function secoesDoFormulario(tipo: TipoFicha): Secao[] {
  return [DADOS_PESSOAIS, ...SECOES_POR_TIPO[tipo], CONSENTIMENTO];
}

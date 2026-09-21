import type { TipoFicha } from "@/generated/prisma/enums";

/**
 * Descrição dos campos de cada formulário. Usada para renderizar o form público
 * e para exibir a ficha no admin com rótulos legíveis. Nomes batem com o schema Zod
 * e com as colunas do Prisma.
 */
export type Opcao = { valor: string; rotulo: string };

/** Mostra o campo só quando outro campo tiver o valor indicado (ex.: "Qual?" após Sim). */
export type Dependencia = { campo: string; valor: string };

export type Campo = (
  | { tipo: "texto"; obrigatorio?: boolean; placeholder?: string }
  | { tipo: "textarea"; obrigatorio?: boolean }
  | { tipo: "numero"; min: number; max: number; padrao?: number }
  | { tipo: "data" }
  | { tipo: "checkbox" }
  | { tipo: "simnao" }
  | { tipo: "select"; opcoes: Opcao[] }
  | { tipo: "radio"; opcoes: Opcao[] }
  | { tipo: "multi"; opcoes: Opcao[] }
) & { nome: string; rotulo: string; ajuda?: string; dependeDe?: Dependencia };

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

/** Texto do termo/declaração por tipo (substitui a assinatura da ficha em papel). */
export const DECLARACAO_POR_TIPO: Record<TipoFicha, string> = {
  MASSOTERAPIA:
    "Declaro que as informações fornecidas nesta ficha são verdadeiras e completas, e estou ciente de que devo informar à terapeuta qualquer alteração em meu estado de saúde ou qualquer desconforto durante o atendimento.",
  HEAD_SPA: "Declaro que as informações acima são verdadeiras e completas",
  DEPILACAO:
    "Declaro que forneci informações verdadeiras sobre minha saúde, alergias, medicamentos e condições da pele. Estou ciente de que devo informar à profissional qualquer desconforto ou reação durante o procedimento.",
};

export function consentimento(tipo: TipoFicha): Secao {
  return {
    titulo: tipo === "DEPILACAO" ? "Termo de ciência" : "Declaração",
    campos: [
      {
        nome: "aceitaTermos",
        rotulo: DECLARACAO_POR_TIPO[tipo],
        tipo: "checkbox",
        ajuda: "Sua assinatura é registrada com a data e a hora do envio.",
      },
    ],
  };
}

const SIM_NAO = (nome: string, rotulo: string): Campo => ({ nome, rotulo, tipo: "simnao" });
const QUAL = (nome: string, dependeDe: string, rotulo = "Qual?"): Campo => ({
  nome,
  rotulo,
  tipo: "texto",
  dependeDe: { campo: dependeDe, valor: "sim" },
});

export const SECOES_POR_TIPO: Record<TipoFicha, Secao[]> = {
  MASSOTERAPIA: [
    {
      titulo: "Objetivo do atendimento",
      campos: [
        {
          nome: "objetivos",
          rotulo: "Qual é o principal objetivo da sua massagem?",
          ajuda: "Pode marcar mais de uma opção.",
          tipo: "multi",
          opcoes: [
            { valor: "RELAXAMENTO", rotulo: "Relaxamento" },
            { valor: "REDUCAO_ESTRESSE", rotulo: "Redução de estresse/tensão" },
            { valor: "ALIVIO_DORES", rotulo: "Alívio de dores ou desconfortos" },
            { valor: "RELAXAMENTO_MUSCULAR", rotulo: "Relaxamento muscular" },
            { valor: "BEM_ESTAR", rotulo: "Bem-estar" },
            { valor: "OUTRO", rotulo: "Outro" },
          ],
        },
        { nome: "objetivoOutro", rotulo: "Qual outro objetivo?", tipo: "texto", dependeDe: { campo: "objetivos", valor: "OUTRO" } },
        { nome: "regiaoAtencao", rotulo: "Região do corpo que gostaria de receber maior atenção", tipo: "textarea" },
      ],
    },
    {
      titulo: "Condições de saúde",
      campos: [
        SIM_NAO("problemaCardiaco", "Problemas cardíacos?"),
        QUAL("problemaCardiacoQual", "problemaCardiaco"),
        SIM_NAO("problemaRespiratorio", "Problemas respiratórios?"),
        QUAL("problemaRespiratorioQual", "problemaRespiratorio"),
        SIM_NAO("problemaColuna", "Problemas ou alterações na coluna?"),
        QUAL("problemaColunaQual", "problemaColuna"),
        SIM_NAO("problemaMuscular", "Problemas musculares ou articulares?"),
        QUAL("problemaMuscularQual", "problemaMuscular"),
        SIM_NAO("problemaPele", "Problemas ou alterações na pele?"),
        QUAL("problemaPeleQual", "problemaPele"),
        {
          nome: "pressaoArterial",
          rotulo: "Possui pressão alta ou baixa?",
          tipo: "radio",
          opcoes: [
            { valor: "NAO", rotulo: "Não" },
            { valor: "SIM", rotulo: "Sim" },
            { valor: "NAO_SEI", rotulo: "Não sei" },
          ],
        },
        SIM_NAO("medicamentoContinuo", "Faz uso contínuo de medicamentos?"),
        QUAL("medicamentoQuais", "medicamentoContinuo", "Quais?"),
        SIM_NAO("alergiaProdutos", "Possui alguma alergia ou sensibilidade a produtos?"),
        QUAL("alergiaProdutosQual", "alergiaProdutos"),
        SIM_NAO("gestante", "Está gestante?"),
        QUAL("gestanteSemanas", "gestante", "Quantas semanas?"),
        { nome: "outraCondicao", rotulo: "Existe alguma outra condição de saúde que devemos saber?", tipo: "textarea" },
      ],
    },
    {
      titulo: "Preferências para a massagem",
      campos: [
        {
          nome: "produto",
          rotulo: "Qual produto prefere?",
          tipo: "radio",
          opcoes: [
            { valor: "OLEO", rotulo: "Óleo" },
            { valor: "CREME", rotulo: "Creme" },
            { valor: "SEM_PREFERENCIA", rotulo: "Sem preferência" },
          ],
        },
        {
          nome: "pressao",
          rotulo: "Qual intensidade de pressão você prefere?",
          tipo: "radio",
          opcoes: [
            { valor: "LEVE", rotulo: "Leve" },
            { valor: "MODERADA", rotulo: "Moderada" },
            { valor: "FORTE", rotulo: "Forte" },
          ],
        },
        { nome: "regiaoEvitar", rotulo: "Há alguma região que você prefere que não seja massageada?", tipo: "textarea" },
        SIM_NAO("jaFezMassagem", "Você já realizou algum tipo de massagem anteriormente?"),
        {
          nome: "experienciaAnterior",
          rotulo: "Conte um pouco sobre sua experiência",
          tipo: "textarea",
          dependeDe: { campo: "jaFezMassagem", valor: "sim" },
        },
        {
          nome: "naoGostou",
          rotulo: "Houve algo que você não gostou ou que gostaria que fosse diferente?",
          tipo: "textarea",
          dependeDe: { campo: "jaFezMassagem", valor: "sim" },
        },
        {
          nome: "preferencias",
          rotulo: "Existe alguma preferência, cuidado ou detalhe que gostaria que soubéssemos para personalizar sua experiência?",
          tipo: "textarea",
        },
      ],
    },
  ],

  HEAD_SPA: [
    {
      titulo: "Objetivo do atendimento",
      campos: [
        {
          nome: "objetivos",
          rotulo: "O que você busca neste atendimento?",
          ajuda: "Pode marcar mais de uma opção.",
          tipo: "multi",
          opcoes: [
            { valor: "RELAXAMENTO", rotulo: "Relaxamento" },
            { valor: "REDUCAO_ESTRESSE", rotulo: "Redução de estresse/tensão" },
            { valor: "HIGIENIZACAO_PROFUNDA", rotulo: "Higienização profunda do couro cabeludo" },
            { valor: "CONTROLE_OLEOSIDADE", rotulo: "Controle da oleosidade" },
            { valor: "ALIVIO_SENSIBILIDADE", rotulo: "Alívio de sensibilidade/coceira" },
            { valor: "QUEDA_CAPILAR", rotulo: "Queda capilar" },
            { valor: "OUTRO", rotulo: "Outro" },
          ],
        },
        { nome: "objetivoOutro", rotulo: "Qual outro objetivo?", tipo: "texto", dependeDe: { campo: "objetivos", valor: "OUTRO" } },
      ],
    },
    {
      titulo: "Histórico capilar",
      campos: [
        SIM_NAO("couroSensivel", "Possui couro cabeludo sensível?"),
        SIM_NAO("coceira", "Apresenta coceira?"),
        SIM_NAO("descamacaoCaspa", "Possui descamação ou caspa?"),
        SIM_NAO("oleosidadeExcessiva", "Apresenta oleosidade excessiva?"),
        SIM_NAO("feridasLesoes", "Possui feridas ou lesões no couro cabeludo?"),
        SIM_NAO("vermelhidaoIrritacao", "Apresenta vermelhidão ou irritação?"),
        SIM_NAO("dorSensibilidadeToque", "Sente dor ou sensibilidade ao toque?"),
        SIM_NAO("quedaIntensa", "Apresenta queda de cabelo intensa ou recente?"),
        SIM_NAO("doencaCouro", "Possui alguma doença ou alteração diagnosticada no couro cabeludo?"),
        QUAL("doencaCouroQual", "doencaCouro"),
      ],
    },
    {
      titulo: "Informações de saúde",
      campos: [
        SIM_NAO("alergia", "Possui algum tipo de alergia?"),
        QUAL("alergiaQual", "alergia"),
        SIM_NAO("gestante", "Está gestante?"),
        SIM_NAO("problemaCardiaco", "Possui algum problema cardíaco?"),
        SIM_NAO("medicamentoContinuo", "Faz uso de algum medicamento contínuo?"),
        QUAL("medicamentoQual", "medicamentoContinuo"),
      ],
    },
    {
      titulo: "Características dos cabelos",
      campos: [
        {
          nome: "tipoCabelo",
          rotulo: "Tipo de cabelo",
          tipo: "radio",
          opcoes: [
            { valor: "LISO", rotulo: "Liso" },
            { valor: "ONDULADO", rotulo: "Ondulado" },
            { valor: "CACHEADO", rotulo: "Cacheado" },
            { valor: "CRESPO", rotulo: "Crespo" },
          ],
        },
        SIM_NAO("quimicaColoracao", "Possui química ou coloração nos cabelos?"),
        QUAL("quimicaQual", "quimicaColoracao"),
      ],
    },
    {
      titulo: "Preferência de massagem capilar",
      campos: [
        {
          nome: "intensidadeMassagem",
          rotulo: "Qual intensidade de massagem você prefere?",
          tipo: "radio",
          opcoes: [
            { valor: "SUAVE", rotulo: "Suave" },
            { valor: "MODERADA", rotulo: "Moderada" },
            { valor: "FORTE", rotulo: "Forte" },
          ],
        },
      ],
    },
    {
      titulo: "Observações",
      campos: [{ nome: "observacoes", rotulo: "Algo mais que queira nos contar?", tipo: "textarea" }],
    },
  ],

  DEPILACAO: [
    {
      titulo: "Área a ser depilada",
      campos: [
        {
          nome: "areas",
          rotulo: "Quais áreas serão depiladas?",
          ajuda: "Pode marcar mais de uma opção.",
          tipo: "multi",
          opcoes: [
            { valor: "BUCO", rotulo: "Buço" },
            { valor: "ROSTO", rotulo: "Rosto" },
            { valor: "AXILAS", rotulo: "Axilas" },
            { valor: "BRACOS", rotulo: "Braços" },
            { valor: "PERNAS", rotulo: "Pernas" },
            { valor: "VIRILHA", rotulo: "Virilha" },
            { valor: "INTIMA_COMPLETA", rotulo: "Íntima completa" },
            { valor: "COSTAS", rotulo: "Costas" },
            { valor: "ABDOMEN", rotulo: "Abdômen" },
            { valor: "OUTRA", rotulo: "Outra" },
          ],
        },
        { nome: "areaOutra", rotulo: "Qual outra área?", tipo: "texto", dependeDe: { campo: "areas", valor: "OUTRA" } },
      ],
    },
    {
      titulo: "Histórico da pele",
      campos: [
        SIM_NAO("peleSensivel", "Possui pele sensível?"),
        SIM_NAO("alergiaCosmetico", "Apresenta alergia a algum produto ou cosmético?"),
        QUAL("alergiaCosmeticoQual", "alergiaCosmetico"),
        SIM_NAO("doencaPele", "Possui alguma doença ou alteração de pele?"),
        QUAL("doencaPeleQual", "doencaPele"),
        SIM_NAO("feridasCortes", "Possui feridas, cortes ou lesões na área a ser depilada?"),
        SIM_NAO("irritacaoVermelhidao", "Apresenta irritação, vermelhidão ou inflamação na região?"),
        SIM_NAO("foliculiteEncravados", "Possui foliculite ou tendência a pelos encravados?"),
        SIM_NAO("manchasSensibilidade", "Possui manchas ou alteração de sensibilidade na região?"),
      ],
    },
    {
      titulo: "Informações de saúde",
      campos: [
        SIM_NAO("gestante", "Está gestante?"),
        SIM_NAO("medicamentoContinuo", "Faz uso de medicamentos contínuos?"),
        QUAL("medicamentoQual", "medicamentoContinuo"),
        SIM_NAO("produtoAcne", "Utiliza algum medicamento ou produto para acne ou tratamento da pele?"),
        QUAL("produtoAcneQual", "produtoAcne"),
        SIM_NAO("procedimentoEstetico", "Realizou algum procedimento estético recentemente na região?"),
        QUAL("procedimentoQualQuando", "procedimentoEstetico", "Qual e quando?"),
        SIM_NAO("alergiaConhecida", "Possui alguma alergia conhecida?"),
        QUAL("alergiaConhecidaQual", "alergiaConhecida"),
      ],
    },
    {
      titulo: "Histórico de depilação",
      campos: [
        SIM_NAO("jaDepilou", "Já realizou depilação anteriormente?"),
        {
          nome: "metodos",
          rotulo: "Qual método costuma utilizar?",
          ajuda: "Pode marcar mais de uma opção.",
          tipo: "multi",
          opcoes: [
            { valor: "CERA_QUENTE", rotulo: "Cera quente" },
            { valor: "CERA_FRIA", rotulo: "Cera fria" },
            { valor: "LAMINA", rotulo: "Lâmina" },
            { valor: "CREME_DEPILATORIO", rotulo: "Creme depilatório" },
            { valor: "LINHA", rotulo: "Linha" },
            { valor: "LASER", rotulo: "Laser" },
          ],
        },
        { nome: "laserDetalhe", rotulo: "Laser: onde e quando?", tipo: "texto", dependeDe: { campo: "metodos", valor: "LASER" } },
        SIM_NAO("reacaoAnterior", "Já apresentou alguma reação após depilação?"),
        QUAL("reacaoQual", "reacaoAnterior"),
      ],
    },
    {
      titulo: "Preferências e observações",
      campos: [
        {
          nome: "preferencias",
          rotulo: "Possui alguma preferência ou necessidade especial durante o procedimento?",
          tipo: "textarea",
        },
      ],
    },
  ],
};

/** Todas as seções do formulário público de um tipo, na ordem de exibição. */
export function secoesDoFormulario(tipo: TipoFicha): Secao[] {
  return [DADOS_PESSOAIS, ...SECOES_POR_TIPO[tipo], consentimento(tipo)];
}

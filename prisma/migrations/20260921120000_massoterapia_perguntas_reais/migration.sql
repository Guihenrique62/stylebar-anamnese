-- Perguntas oficiais da ficha de Massoterapia. Escrita à mão na ordem segura:
-- remove colunas antigas, troca os enums, adiciona as novas colunas.

ALTER TABLE "fichas_massoterapia"
  DROP COLUMN "queixa_principal",
  DROP COLUMN "tempo_queixa",
  DROP COLUMN "nivel_dor",
  DROP COLUMN "regioes_dor",
  DROP COLUMN "tratamentos_anteriores",
  DROP COLUMN "doencas_cronicas",
  DROP COLUMN "cirurgias",
  DROP COLUMN "medicamentos",
  DROP COLUMN "alergias",
  DROP COLUMN "lactante",
  DROP COLUMN "marcapasso_protese",
  DROP COLUMN "varizes_trombose",
  DROP COLUMN "pressao_arterial",
  DROP COLUMN "qualidade_sono",
  DROP COLUMN "nivel_estresse",
  DROP COLUMN "atividade_fisica",
  DROP COLUMN "pressao_toque",
  DROP COLUMN "regioes_evitar",
  DROP COLUMN "observacoes";

DROP TYPE IF EXISTS "NivelPressao";
DROP TYPE IF EXISTS "PressaoToque";
DROP TYPE IF EXISTS "QualidadeSono";

DROP TYPE IF EXISTS "ObjetivoMassagem";
CREATE TYPE "ObjetivoMassagem" AS ENUM ('RELAXAMENTO', 'REDUCAO_ESTRESSE', 'ALIVIO_DORES', 'RELAXAMENTO_MUSCULAR', 'BEM_ESTAR', 'OUTRO');
DROP TYPE IF EXISTS "PressaoArterial";
CREATE TYPE "PressaoArterial" AS ENUM ('NAO', 'SIM', 'NAO_SEI');
DROP TYPE IF EXISTS "ProdutoMassagem";
CREATE TYPE "ProdutoMassagem" AS ENUM ('OLEO', 'CREME', 'SEM_PREFERENCIA');
DROP TYPE IF EXISTS "PressaoMassagem";
CREATE TYPE "PressaoMassagem" AS ENUM ('LEVE', 'MODERADA', 'FORTE');

ALTER TABLE "fichas_massoterapia"
  ADD COLUMN "objetivos" "ObjetivoMassagem"[],
  ADD COLUMN "objetivo_outro" TEXT,
  ADD COLUMN "regiao_atencao" TEXT,
  ADD COLUMN "problema_cardiaco" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "problema_cardiaco_qual" TEXT,
  ADD COLUMN "problema_respiratorio" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "problema_respiratorio_qual" TEXT,
  ADD COLUMN "problema_coluna" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "problema_coluna_qual" TEXT,
  ADD COLUMN "problema_muscular" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "problema_muscular_qual" TEXT,
  ADD COLUMN "problema_pele" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "problema_pele_qual" TEXT,
  ADD COLUMN "pressao_arterial" "PressaoArterial" NOT NULL,
  ADD COLUMN "medicamento_continuo" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "medicamento_quais" TEXT,
  ADD COLUMN "alergia_produtos" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "alergia_produtos_qual" TEXT,
  ADD COLUMN "gestante_semanas" TEXT,
  ADD COLUMN "outra_condicao" TEXT,
  ADD COLUMN "produto" "ProdutoMassagem" NOT NULL,
  ADD COLUMN "pressao" "PressaoMassagem" NOT NULL,
  ADD COLUMN "regiao_evitar" TEXT,
  ADD COLUMN "ja_fez_massagem" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "experiencia_anterior" TEXT,
  ADD COLUMN "nao_gostou" TEXT,
  ADD COLUMN "preferencias" TEXT;

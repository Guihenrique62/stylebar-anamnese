-- Perguntas oficiais da ficha de Depilação. Escrita à mão: o diff automático tentava
-- alterar a coluna "metodos" antes de criá-la. Ordem segura: remove colunas antigas,
-- troca os enums, adiciona as novas colunas.

ALTER TABLE "fichas_depilacao"
  DROP COLUMN "areas",
  DROP COLUMN "metodo_preferido",
  DROP COLUMN "metodo_atual",
  DROP COLUMN "ultima_depilacao",
  DROP COLUMN "primeira_vez_cera",
  DROP COLUMN "tipo_pele",
  DROP COLUMN "pelos_encravados",
  DROP COLUMN "foliculite",
  DROP COLUMN "lesoes_pele",
  DROP COLUMN "manchas_cicatrizes",
  DROP COLUMN "alergia_cosmeticos",
  DROP COLUMN "uso_acidos_retinoides",
  DROP COLUMN "exposicao_solar_recente",
  DROP COLUMN "diabetes",
  DROP COLUMN "varizes",
  DROP COLUMN "problemas_circulatorios",
  DROP COLUMN "anticoagulantes",
  DROP COLUMN "medicamentos",
  DROP COLUMN "alergias",
  DROP COLUMN "observacoes";

DROP TYPE "MetodoDepilacao";
DROP TYPE "TipoPele";

DROP TYPE IF EXISTS "AreaDepilacao";
CREATE TYPE "AreaDepilacao" AS ENUM ('BUCO', 'ROSTO', 'AXILAS', 'BRACOS', 'PERNAS', 'VIRILHA', 'INTIMA_COMPLETA', 'COSTAS', 'ABDOMEN', 'OUTRA');
CREATE TYPE "MetodoDepilacao" AS ENUM ('CERA_QUENTE', 'CERA_FRIA', 'LAMINA', 'CREME_DEPILATORIO', 'LINHA', 'LASER');

ALTER TABLE "fichas_depilacao"
  ADD COLUMN "areas" "AreaDepilacao"[],
  ADD COLUMN "area_outra" TEXT,
  ADD COLUMN "pele_sensivel" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "alergia_cosmetico" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "alergia_cosmetico_qual" TEXT,
  ADD COLUMN "doenca_pele" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "doenca_pele_qual" TEXT,
  ADD COLUMN "feridas_cortes" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "irritacao_vermelhidao" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "foliculite_encravados" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "manchas_sensibilidade" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "medicamento_continuo" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "medicamento_qual" TEXT,
  ADD COLUMN "produto_acne" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "produto_acne_qual" TEXT,
  ADD COLUMN "procedimento_estetico" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "procedimento_qual_quando" TEXT,
  ADD COLUMN "alergia_conhecida" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "alergia_conhecida_qual" TEXT,
  ADD COLUMN "ja_depilou" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "metodos" "MetodoDepilacao"[],
  ADD COLUMN "laser_detalhe" TEXT,
  ADD COLUMN "reacao_anterior" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "reacao_qual" TEXT,
  ADD COLUMN "preferencias" TEXT;

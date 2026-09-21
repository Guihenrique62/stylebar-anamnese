-- CreateEnum
CREATE TYPE "MetodoDepilacao" AS ENUM ('CERA_QUENTE', 'CERA_FRIA', 'ROLL_ON', 'LINHA', 'LAMINA', 'OUTRO');

-- CreateEnum
CREATE TYPE "TipoPele" AS ENUM ('NORMAL', 'SECA', 'OLEOSA', 'MISTA', 'SENSIVEL');

-- AlterEnum
BEGIN;
CREATE TYPE "TipoFicha_new" AS ENUM ('MASSOTERAPIA', 'HEAD_SPA', 'DEPILACAO');
ALTER TYPE "TipoFicha" RENAME TO "TipoFicha_old";
ALTER TYPE "TipoFicha_new" RENAME TO "TipoFicha";
DROP TYPE "public"."TipoFicha_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "fichas_funcionais" DROP CONSTRAINT "fichas_funcionais_link_id_fkey";

-- DropForeignKey
ALTER TABLE "fichas_funcionais" DROP CONSTRAINT "fichas_funcionais_paciente_id_fkey";

-- DropForeignKey
ALTER TABLE "fichas_funcionais" DROP CONSTRAINT "fichas_funcionais_revisada_por_id_fkey";

-- DropForeignKey
ALTER TABLE "fichas_funcionais" DROP CONSTRAINT "fichas_funcionais_terapeuta_id_fkey";

-- DropForeignKey
ALTER TABLE "fichas_terapeuticas" DROP CONSTRAINT "fichas_terapeuticas_link_id_fkey";

-- DropForeignKey
ALTER TABLE "fichas_terapeuticas" DROP CONSTRAINT "fichas_terapeuticas_paciente_id_fkey";

-- DropForeignKey
ALTER TABLE "fichas_terapeuticas" DROP CONSTRAINT "fichas_terapeuticas_revisada_por_id_fkey";

-- DropForeignKey
ALTER TABLE "fichas_terapeuticas" DROP CONSTRAINT "fichas_terapeuticas_terapeuta_id_fkey";

-- DropTable
DROP TABLE "fichas_funcionais";

-- DropTable
DROP TABLE "fichas_terapeuticas";

-- DropEnum
DROP TYPE "ObjetivoFuncional";

-- CreateTable
CREATE TABLE "fichas_massoterapia" (
    "id" UUID NOT NULL,
    "status" "FichaStatus" NOT NULL DEFAULT 'ENVIADA',
    "enviada_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizada_em" TIMESTAMP(3) NOT NULL,
    "link_id" UUID NOT NULL,
    "paciente_id" UUID NOT NULL,
    "terapeuta_id" UUID NOT NULL,
    "revisada_por_id" UUID,
    "aceita_termos" BOOLEAN NOT NULL,
    "aceita_imagem" BOOLEAN NOT NULL DEFAULT false,
    "queixa_principal" TEXT NOT NULL,
    "tempo_queixa" TEXT,
    "nivel_dor" INTEGER NOT NULL DEFAULT 0,
    "regioes_dor" TEXT,
    "tratamentos_anteriores" TEXT,
    "doencas_cronicas" TEXT,
    "cirurgias" TEXT,
    "medicamentos" TEXT,
    "alergias" TEXT,
    "gestante" BOOLEAN NOT NULL DEFAULT false,
    "lactante" BOOLEAN NOT NULL DEFAULT false,
    "marcapasso_protese" BOOLEAN NOT NULL DEFAULT false,
    "varizes_trombose" BOOLEAN NOT NULL DEFAULT false,
    "pressao_arterial" "NivelPressao" NOT NULL DEFAULT 'NORMAL',
    "qualidade_sono" "QualidadeSono" NOT NULL DEFAULT 'REGULAR',
    "nivel_estresse" INTEGER NOT NULL DEFAULT 3,
    "atividade_fisica" TEXT,
    "pressao_toque" "PressaoToque" NOT NULL DEFAULT 'MEDIA',
    "regioes_evitar" TEXT,
    "observacoes" TEXT,
    "observacoes_terapeuta" TEXT,

    CONSTRAINT "fichas_massoterapia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fichas_depilacao" (
    "id" UUID NOT NULL,
    "status" "FichaStatus" NOT NULL DEFAULT 'ENVIADA',
    "enviada_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizada_em" TIMESTAMP(3) NOT NULL,
    "link_id" UUID NOT NULL,
    "paciente_id" UUID NOT NULL,
    "terapeuta_id" UUID NOT NULL,
    "revisada_por_id" UUID,
    "aceita_termos" BOOLEAN NOT NULL,
    "aceita_imagem" BOOLEAN NOT NULL DEFAULT false,
    "areas" TEXT NOT NULL,
    "metodo_preferido" "MetodoDepilacao" NOT NULL,
    "metodo_atual" TEXT,
    "ultima_depilacao" DATE,
    "primeira_vez_cera" BOOLEAN NOT NULL DEFAULT false,
    "tipo_pele" "TipoPele" NOT NULL,
    "pelos_encravados" BOOLEAN NOT NULL DEFAULT false,
    "foliculite" BOOLEAN NOT NULL DEFAULT false,
    "lesoes_pele" TEXT,
    "manchas_cicatrizes" TEXT,
    "alergia_cosmeticos" TEXT,
    "uso_acidos_retinoides" BOOLEAN NOT NULL DEFAULT false,
    "exposicao_solar_recente" BOOLEAN NOT NULL DEFAULT false,
    "gestante" BOOLEAN NOT NULL DEFAULT false,
    "diabetes" BOOLEAN NOT NULL DEFAULT false,
    "varizes" BOOLEAN NOT NULL DEFAULT false,
    "problemas_circulatorios" BOOLEAN NOT NULL DEFAULT false,
    "anticoagulantes" BOOLEAN NOT NULL DEFAULT false,
    "medicamentos" TEXT,
    "alergias" TEXT,
    "observacoes" TEXT,
    "observacoes_terapeuta" TEXT,

    CONSTRAINT "fichas_depilacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fichas_massoterapia_link_id_key" ON "fichas_massoterapia"("link_id");

-- CreateIndex
CREATE INDEX "fichas_massoterapia_status_enviada_em_idx" ON "fichas_massoterapia"("status", "enviada_em");

-- CreateIndex
CREATE INDEX "fichas_massoterapia_paciente_id_idx" ON "fichas_massoterapia"("paciente_id");

-- CreateIndex
CREATE UNIQUE INDEX "fichas_depilacao_link_id_key" ON "fichas_depilacao"("link_id");

-- CreateIndex
CREATE INDEX "fichas_depilacao_status_enviada_em_idx" ON "fichas_depilacao"("status", "enviada_em");

-- CreateIndex
CREATE INDEX "fichas_depilacao_paciente_id_idx" ON "fichas_depilacao"("paciente_id");

-- AddForeignKey
ALTER TABLE "fichas_massoterapia" ADD CONSTRAINT "fichas_massoterapia_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links_anamnese"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_massoterapia" ADD CONSTRAINT "fichas_massoterapia_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_massoterapia" ADD CONSTRAINT "fichas_massoterapia_terapeuta_id_fkey" FOREIGN KEY ("terapeuta_id") REFERENCES "terapeutas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_massoterapia" ADD CONSTRAINT "fichas_massoterapia_revisada_por_id_fkey" FOREIGN KEY ("revisada_por_id") REFERENCES "terapeutas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_depilacao" ADD CONSTRAINT "fichas_depilacao_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links_anamnese"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_depilacao" ADD CONSTRAINT "fichas_depilacao_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_depilacao" ADD CONSTRAINT "fichas_depilacao_terapeuta_id_fkey" FOREIGN KEY ("terapeuta_id") REFERENCES "terapeutas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_depilacao" ADD CONSTRAINT "fichas_depilacao_revisada_por_id_fkey" FOREIGN KEY ("revisada_por_id") REFERENCES "terapeutas"("id") ON DELETE SET NULL ON UPDATE CASCADE;


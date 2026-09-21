-- CreateEnum
CREATE TYPE "TipoFicha" AS ENUM ('TERAPEUTICA', 'HEAD_SPA', 'FUNCIONAL');

-- CreateEnum
CREATE TYPE "NivelPressao" AS ENUM ('BAIXA', 'NORMAL', 'ALTA');

-- CreateEnum
CREATE TYPE "PressaoToque" AS ENUM ('LEVE', 'MEDIA', 'FORTE');

-- CreateEnum
CREATE TYPE "QualidadeSono" AS ENUM ('RUIM', 'REGULAR', 'BOA');

-- CreateEnum
CREATE TYPE "TipoCouro" AS ENUM ('NORMAL', 'OLEOSO', 'SECO', 'MISTO', 'SENSIVEL');

-- CreateEnum
CREATE TYPE "FrequenciaLavagem" AS ENUM ('DIARIA', 'ALTERNADA', 'DUAS_VEZES_SEMANA', 'SEMANAL');

-- CreateEnum
CREATE TYPE "ObjetivoFuncional" AS ENUM ('RELAXAMENTO', 'DOR', 'POSTURA', 'PERFORMANCE', 'OUTRO');

-- DropForeignKey
ALTER TABLE "fichas_anamnese" DROP CONSTRAINT "fichas_anamnese_link_id_fkey";

-- DropForeignKey
ALTER TABLE "fichas_anamnese" DROP CONSTRAINT "fichas_anamnese_paciente_id_fkey";

-- DropForeignKey
ALTER TABLE "fichas_anamnese" DROP CONSTRAINT "fichas_anamnese_terapeuta_id_fkey";

-- DropIndex
DROP INDEX "pacientes_telefone_idx";

-- AlterTable
ALTER TABLE "links_anamnese" DROP COLUMN "status",
ADD COLUMN     "revogado_em" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "pacientes" ADD COLUMN     "atualizado_em" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "terapeutas" ALTER COLUMN "auth_user_id" SET NOT NULL;

-- DropTable
DROP TABLE "fichas_anamnese";

-- DropEnum
DROP TYPE "LinkStatus";

-- CreateTable
CREATE TABLE "fichas_terapeuticas" (
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

    CONSTRAINT "fichas_terapeuticas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fichas_head_spa" (
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
    "tipo_cabelo" TEXT NOT NULL,
    "tipo_couro" "TipoCouro" NOT NULL,
    "queda_cabelo" BOOLEAN NOT NULL DEFAULT false,
    "caspa_descamacao" BOOLEAN NOT NULL DEFAULT false,
    "coceira_irritacao" BOOLEAN NOT NULL DEFAULT false,
    "feridas_lesoes" BOOLEAN NOT NULL DEFAULT false,
    "dermatite_psoriase" BOOLEAN NOT NULL DEFAULT false,
    "alergia_cosmeticos" TEXT,
    "quimica_recente" TEXT,
    "data_quimica" DATE,
    "frequencia_lavagem" "FrequenciaLavagem" NOT NULL,
    "uso_calor" BOOLEAN NOT NULL DEFAULT false,
    "gestante" BOOLEAN NOT NULL DEFAULT false,
    "hipertensao" BOOLEAN NOT NULL DEFAULT false,
    "enxaqueca" BOOLEAN NOT NULL DEFAULT false,
    "lentes_aparelho_auditivo" BOOLEAN NOT NULL DEFAULT false,
    "sensibilidade_temperatura" BOOLEAN NOT NULL DEFAULT false,
    "objetivo" TEXT NOT NULL,
    "observacoes" TEXT,
    "observacoes_terapeuta" TEXT,

    CONSTRAINT "fichas_head_spa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fichas_funcionais" (
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
    "objetivo" "ObjetivoFuncional" NOT NULL,
    "objetivo_outro" TEXT,
    "queixa_principal" TEXT,
    "nivel_dor" INTEGER NOT NULL DEFAULT 0,
    "regioes_dor" TEXT,
    "lesoes_fraturas" TEXT,
    "cirurgias_ortopedicas" TEXT,
    "condicoes_articulares" TEXT,
    "problemas_coluna" TEXT,
    "doencas_cardiovasculares" BOOLEAN NOT NULL DEFAULT false,
    "diabetes" BOOLEAN NOT NULL DEFAULT false,
    "hipertensao" BOOLEAN NOT NULL DEFAULT false,
    "gestante" BOOLEAN NOT NULL DEFAULT false,
    "medicamentos" TEXT,
    "alergias" TEXT,
    "atividade_fisica" TEXT,
    "frequencia_atividade" TEXT,
    "profissao_postura" TEXT,
    "limitacoes_movimento" TEXT,
    "liberacao_exercicios" BOOLEAN NOT NULL DEFAULT true,
    "observacoes" TEXT,
    "observacoes_terapeuta" TEXT,

    CONSTRAINT "fichas_funcionais_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fichas_terapeuticas_link_id_key" ON "fichas_terapeuticas"("link_id");

-- CreateIndex
CREATE INDEX "fichas_terapeuticas_status_enviada_em_idx" ON "fichas_terapeuticas"("status", "enviada_em");

-- CreateIndex
CREATE INDEX "fichas_terapeuticas_paciente_id_idx" ON "fichas_terapeuticas"("paciente_id");

-- CreateIndex
CREATE UNIQUE INDEX "fichas_head_spa_link_id_key" ON "fichas_head_spa"("link_id");

-- CreateIndex
CREATE INDEX "fichas_head_spa_status_enviada_em_idx" ON "fichas_head_spa"("status", "enviada_em");

-- CreateIndex
CREATE INDEX "fichas_head_spa_paciente_id_idx" ON "fichas_head_spa"("paciente_id");

-- CreateIndex
CREATE UNIQUE INDEX "fichas_funcionais_link_id_key" ON "fichas_funcionais"("link_id");

-- CreateIndex
CREATE INDEX "fichas_funcionais_status_enviada_em_idx" ON "fichas_funcionais"("status", "enviada_em");

-- CreateIndex
CREATE INDEX "fichas_funcionais_paciente_id_idx" ON "fichas_funcionais"("paciente_id");

-- CreateIndex
CREATE INDEX "links_anamnese_expira_em_idx" ON "links_anamnese"("expira_em");

-- CreateIndex
CREATE UNIQUE INDEX "pacientes_telefone_key" ON "pacientes"("telefone");

-- AddForeignKey
ALTER TABLE "fichas_terapeuticas" ADD CONSTRAINT "fichas_terapeuticas_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links_anamnese"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_terapeuticas" ADD CONSTRAINT "fichas_terapeuticas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_terapeuticas" ADD CONSTRAINT "fichas_terapeuticas_terapeuta_id_fkey" FOREIGN KEY ("terapeuta_id") REFERENCES "terapeutas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_terapeuticas" ADD CONSTRAINT "fichas_terapeuticas_revisada_por_id_fkey" FOREIGN KEY ("revisada_por_id") REFERENCES "terapeutas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_head_spa" ADD CONSTRAINT "fichas_head_spa_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links_anamnese"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_head_spa" ADD CONSTRAINT "fichas_head_spa_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_head_spa" ADD CONSTRAINT "fichas_head_spa_terapeuta_id_fkey" FOREIGN KEY ("terapeuta_id") REFERENCES "terapeutas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_head_spa" ADD CONSTRAINT "fichas_head_spa_revisada_por_id_fkey" FOREIGN KEY ("revisada_por_id") REFERENCES "terapeutas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_funcionais" ADD CONSTRAINT "fichas_funcionais_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links_anamnese"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_funcionais" ADD CONSTRAINT "fichas_funcionais_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_funcionais" ADD CONSTRAINT "fichas_funcionais_terapeuta_id_fkey" FOREIGN KEY ("terapeuta_id") REFERENCES "terapeutas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_funcionais" ADD CONSTRAINT "fichas_funcionais_revisada_por_id_fkey" FOREIGN KEY ("revisada_por_id") REFERENCES "terapeutas"("id") ON DELETE SET NULL ON UPDATE CASCADE;


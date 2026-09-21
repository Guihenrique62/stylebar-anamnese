-- DropForeignKey
ALTER TABLE "fichas_depilacao" DROP CONSTRAINT "fichas_depilacao_link_id_fkey";

-- DropForeignKey
ALTER TABLE "fichas_depilacao" DROP CONSTRAINT "fichas_depilacao_terapeuta_id_fkey";

-- DropForeignKey
ALTER TABLE "fichas_head_spa" DROP CONSTRAINT "fichas_head_spa_link_id_fkey";

-- DropForeignKey
ALTER TABLE "fichas_head_spa" DROP CONSTRAINT "fichas_head_spa_terapeuta_id_fkey";

-- DropForeignKey
ALTER TABLE "fichas_massoterapia" DROP CONSTRAINT "fichas_massoterapia_link_id_fkey";

-- DropForeignKey
ALTER TABLE "fichas_massoterapia" DROP CONSTRAINT "fichas_massoterapia_terapeuta_id_fkey";

-- DropForeignKey
ALTER TABLE "links_anamnese" DROP CONSTRAINT "links_anamnese_paciente_id_fkey";

-- DropForeignKey
ALTER TABLE "links_anamnese" DROP CONSTRAINT "links_anamnese_terapeuta_id_fkey";

-- DropIndex
DROP INDEX "fichas_depilacao_link_id_key";

-- DropIndex
DROP INDEX "fichas_head_spa_link_id_key";

-- DropIndex
DROP INDEX "fichas_massoterapia_link_id_key";

-- AlterTable
ALTER TABLE "fichas_depilacao" DROP COLUMN "link_id",
DROP COLUMN "terapeuta_id";

-- AlterTable
ALTER TABLE "fichas_head_spa" DROP COLUMN "link_id",
DROP COLUMN "terapeuta_id";

-- AlterTable
ALTER TABLE "fichas_massoterapia" DROP COLUMN "link_id",
DROP COLUMN "terapeuta_id";

-- DropTable
DROP TABLE "links_anamnese";


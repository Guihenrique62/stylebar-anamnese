-- Perguntas oficiais da ficha de Head Spa. Os enums abaixo foram criados na primeira
-- tentativa de aplicação (interrompida por dados de teste); ficam aqui para replays em banco novo.
CREATE TYPE "ObjetivoHeadSpa" AS ENUM ('RELAXAMENTO', 'REDUCAO_ESTRESSE', 'HIGIENIZACAO_PROFUNDA', 'CONTROLE_OLEOSIDADE', 'ALIVIO_SENSIBILIDADE', 'QUEDA_CAPILAR', 'OUTRO');
CREATE TYPE "TipoCabelo" AS ENUM ('LISO', 'ONDULADO', 'CACHEADO', 'CRESPO');
CREATE TYPE "IntensidadeMassagem" AS ENUM ('SUAVE', 'MODERADA', 'FORTE');

-- AlterTable
ALTER TABLE "fichas_head_spa" DROP COLUMN "alergia_cosmeticos",
DROP COLUMN "caspa_descamacao",
DROP COLUMN "coceira_irritacao",
DROP COLUMN "data_quimica",
DROP COLUMN "dermatite_psoriase",
DROP COLUMN "enxaqueca",
DROP COLUMN "frequencia_lavagem",
DROP COLUMN "hipertensao",
DROP COLUMN "lentes_aparelho_auditivo",
DROP COLUMN "objetivo",
DROP COLUMN "queda_cabelo",
DROP COLUMN "quimica_recente",
DROP COLUMN "sensibilidade_temperatura",
DROP COLUMN "tipo_couro",
DROP COLUMN "uso_calor",
ADD COLUMN     "alergia" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "alergia_qual" TEXT,
ADD COLUMN     "coceira" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "couro_sensivel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "descamacao_caspa" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "doenca_couro" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "doenca_couro_qual" TEXT,
ADD COLUMN     "dor_sensibilidade_toque" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "intensidade_massagem" "IntensidadeMassagem" NOT NULL,
ADD COLUMN     "medicamento_continuo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "medicamento_qual" TEXT,
ADD COLUMN     "objetivo_outro" TEXT,
ADD COLUMN     "objetivos" "ObjetivoHeadSpa"[],
ADD COLUMN     "oleosidade_excessiva" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "problema_cardiaco" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "queda_intensa" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "quimica_coloracao" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "quimica_qual" TEXT,
ADD COLUMN     "vermelhidao_irritacao" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "tipo_cabelo",
ADD COLUMN     "tipo_cabelo" "TipoCabelo" NOT NULL;

-- DropEnum
DROP TYPE "FrequenciaLavagem";

-- DropEnum
DROP TYPE "TipoCouro";


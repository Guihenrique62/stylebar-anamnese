-- CreateEnum
CREATE TYPE "LinkStatus" AS ENUM ('ATIVO', 'USADO', 'EXPIRADO');

-- CreateEnum
CREATE TYPE "FichaStatus" AS ENUM ('ENVIADA', 'REVISADA');

-- CreateTable
CREATE TABLE "terapeutas" (
    "id" UUID NOT NULL,
    "auth_user_id" UUID,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "unidade" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "terapeutas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacientes" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT,
    "data_nascimento" DATE,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links_anamnese" (
    "id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "status" "LinkStatus" NOT NULL DEFAULT 'ATIVO',
    "expira_em" TIMESTAMP(3) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "terapeuta_id" UUID NOT NULL,
    "paciente_id" UUID,

    CONSTRAINT "links_anamnese_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fichas_anamnese" (
    "id" UUID NOT NULL,
    "status" "FichaStatus" NOT NULL DEFAULT 'ENVIADA',
    "respostas" JSONB NOT NULL,
    "observacoes_terapeuta" TEXT,
    "enviada_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizada_em" TIMESTAMP(3) NOT NULL,
    "link_id" UUID NOT NULL,
    "paciente_id" UUID NOT NULL,
    "terapeuta_id" UUID NOT NULL,

    CONSTRAINT "fichas_anamnese_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "terapeutas_auth_user_id_key" ON "terapeutas"("auth_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "terapeutas_email_key" ON "terapeutas"("email");

-- CreateIndex
CREATE INDEX "pacientes_telefone_idx" ON "pacientes"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "links_anamnese_token_key" ON "links_anamnese"("token");

-- CreateIndex
CREATE INDEX "links_anamnese_terapeuta_id_idx" ON "links_anamnese"("terapeuta_id");

-- CreateIndex
CREATE UNIQUE INDEX "fichas_anamnese_link_id_key" ON "fichas_anamnese"("link_id");

-- CreateIndex
CREATE INDEX "fichas_anamnese_terapeuta_id_enviada_em_idx" ON "fichas_anamnese"("terapeuta_id", "enviada_em");

-- CreateIndex
CREATE INDEX "fichas_anamnese_paciente_id_idx" ON "fichas_anamnese"("paciente_id");

-- AddForeignKey
ALTER TABLE "links_anamnese" ADD CONSTRAINT "links_anamnese_terapeuta_id_fkey" FOREIGN KEY ("terapeuta_id") REFERENCES "terapeutas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "links_anamnese" ADD CONSTRAINT "links_anamnese_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_anamnese" ADD CONSTRAINT "fichas_anamnese_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links_anamnese"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_anamnese" ADD CONSTRAINT "fichas_anamnese_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_anamnese" ADD CONSTRAINT "fichas_anamnese_terapeuta_id_fkey" FOREIGN KEY ("terapeuta_id") REFERENCES "terapeutas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

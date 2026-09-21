-- RLS nas tabelas recriadas (grants já revogados pela migração rls_enable).
ALTER TABLE "fichas_massoterapia" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "fichas_depilacao"    ENABLE ROW LEVEL SECURITY;

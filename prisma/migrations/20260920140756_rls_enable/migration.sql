-- Bloqueia o acesso às tabelas da aplicação pela Data API do Supabase (PostgREST).
-- O Prisma conecta como `postgres`, que ignora RLS; anon/authenticated não têm políticas
-- nem privilégios, então nada é lido ou escrito por fora da aplicação.

ALTER TABLE "terapeutas"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "pacientes"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "links_anamnese"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "fichas_terapeuticas" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "fichas_head_spa"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "fichas_funcionais"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations"  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON ALL TABLES    IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon, authenticated;

-- Tabelas futuras criadas pelo Prisma (como postgres) nascem sem grants para esses roles.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES    FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon, authenticated;

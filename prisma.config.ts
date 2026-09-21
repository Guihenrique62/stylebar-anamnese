import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Conexão com o Postgres do Supabase.
 *
 * No Prisma 7 não existe mais `directUrl`: a CLI (migrate, db push, studio) usa
 * apenas `datasource.url`, e a aplicação escolhe a própria conexão no adapter.
 * - Aqui: DIRECT_URL, pooler em modo sessão (porta 5432), exigido pelas migrações.
 * - Aplicação (src/server/db): DATABASE_URL, pooler em modo transação (6543, pgbouncer=true).
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});

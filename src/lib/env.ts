import { z } from "zod";
import { normalizarUrl } from "./url";

/**
 * Variáveis de ambiente validadas na inicialização. Ver .env.example.
 *
 * URLs aceitam host sem esquema (a Vercel costuma ser preenchida assim) e ganham https://.
 * NEXT_PUBLIC_APP_URL é opcional na Vercel: cai para a URL de produção/preview do projeto.
 */
const url = (mensagem: string) => z.preprocess(normalizarUrl, z.string().url(mensagem));

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "obrigatória (pooler em modo transação, porta 6543)"),
  DIRECT_URL: z.string().min(1, "obrigatória (pooler em modo sessão, porta 5432)"),
  NEXT_PUBLIC_APP_URL: url("URL inválida"),
  NEXT_PUBLIC_SUPABASE_URL: url("URL inválida"),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1, "obrigatória (chave publishable do Supabase)"),
});

function appUrlPadrao() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000"
  );
}

const resultado = schema.safeParse({ ...process.env, NEXT_PUBLIC_APP_URL: appUrlPadrao() });

if (!resultado.success) {
  const linhas = resultado.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
  throw new Error(
    `Variáveis de ambiente inválidas:\n${linhas}\n` +
      "Confira o .env local ou as Environment Variables na Vercel " +
      "(NEXT_PUBLIC_* em Plaintext; DATABASE_URL e DIRECT_URL como Sensitive).",
  );
}

export const env = resultado.data;

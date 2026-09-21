/**
 * Normaliza URLs vindas de variáveis de ambiente. Sem dependência de Node, para
 * poder rodar no proxy (edge) e no navegador.
 * - remove espaços e barra final
 * - prefixa https:// quando o esquema foi omitido (comum ao colar hosts na Vercel)
 */
export function normalizarUrl(valor: string | undefined | null): string | undefined {
  if (typeof valor !== "string") return undefined;
  const v = valor.trim().replace(/\/+$/, "");
  if (v === "") return undefined;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

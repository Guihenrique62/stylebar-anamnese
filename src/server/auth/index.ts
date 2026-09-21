import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/server/db";
import type { Terapeuta } from "@/generated/prisma/client";

const LOGIN_PATH = "/login";

type Claims = {
  sub: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

/**
 * Lê as claims verificadas do JWT da sessão atual (assinatura validada pelo Supabase).
 * Retorna null se não houver sessão válida. Memoizado por requisição.
 */
export const getClaims = cache(async (): Promise<Claims | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;
  return data.claims as Claims;
});

/**
 * Garante que há uma terapeuta autenticada e ativa. Cria o registro em `terapeutas`
 * no primeiro login (upsert por authUserId). Redireciona para /login se não houver sessão.
 * Deve ser chamada em toda página, Server Action e Route Handler de /admin.
 */
export const requireTerapeuta = cache(async (): Promise<Terapeuta> => {
  const claims = await getClaims();
  if (!claims) redirect(LOGIN_PATH);

  const email = claims.email?.toLowerCase();
  if (!email) redirect(`${LOGIN_PATH}?erro=sem-email`);

  const nomeMeta = claims.user_metadata?.nome ?? claims.user_metadata?.full_name;
  const nome =
    typeof nomeMeta === "string" && nomeMeta.trim() ? nomeMeta.trim() : email.split("@")[0];

  const terapeuta = await db.terapeuta.upsert({
    where: { authUserId: claims.sub },
    update: { email },
    create: { authUserId: claims.sub, email, nome },
  });

  if (!terapeuta.ativo) {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect(`${LOGIN_PATH}?erro=inativa`);
  }

  return terapeuta;
});

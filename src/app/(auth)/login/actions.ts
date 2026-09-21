"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  senha: z.string().min(6, "Senha inválida"),
  next: z.string().optional(),
});

export type LoginState = { erro?: string } | undefined;

/** Login por e-mail e senha no Supabase Auth. Sessão gravada em cookie httpOnly pelo @supabase/ssr. */
export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    senha: formData.get("senha"),
    next: formData.get("next") ?? undefined,
  });
  if (!parsed.success) return { erro: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.senha,
  });
  if (error) return { erro: "E-mail ou senha incorretos" };

  redirect(destinoSeguro(parsed.data.next));
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/** Só aceita caminhos internos começando com /admin, para evitar open redirect. */
function destinoSeguro(next?: string) {
  if (next && /^\/admin(\/[A-Za-z0-9\-_/]*)?$/.test(next)) return next;
  return "/admin";
}

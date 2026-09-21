import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_PREFIX = "/admin";
const LOGIN_PATH = "/login";

/**
 * Renova a sessão do Supabase a cada requisição e aplica o guard das rotas privadas.
 * Segue o padrão oficial de @supabase/ssr: os cookies renovados são propagados tanto
 * para a requisição (Server Components) quanto para a resposta (navegador).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getClaims() verifica a assinatura do JWT. Nunca usar getSession() aqui.
  const { data } = await supabase.auth.getClaims();
  const autenticada = Boolean(data?.claims);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(ADMIN_PREFIX) && !autenticada) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = "";
    url.searchParams.set("next", pathname);
    return copiarCookies(NextResponse.redirect(url), supabaseResponse);
  }

  if (pathname === LOGIN_PATH && autenticada) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_PREFIX;
    url.search = "";
    return copiarCookies(NextResponse.redirect(url), supabaseResponse);
  }

  return supabaseResponse;
}

/** Ao trocar a resposta, os cookies renovados precisam ir junto. */
function copiarCookies(destino: NextResponse, origem: NextResponse) {
  for (const cookie of origem.cookies.getAll()) destino.cookies.set(cookie);
  return destino;
}

import { NextResponse, type NextRequest } from "next/server";

export const SESSION_COOKIE = "stylebar_session";

/**
 * Protege o painel das terapeutas.
 * A validação real da sessão fica em src/server/auth; aqui só checamos a
 * presença do cookie para redirecionar cedo quem não está autenticado.
 */
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/painel") && !hasSession) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/painel", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/painel/:path*", "/login"],
};

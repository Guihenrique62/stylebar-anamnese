import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/** Renovação de sessão do Supabase e proteção de /admin. Lógica em src/lib/supabase/proxy.ts. */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};

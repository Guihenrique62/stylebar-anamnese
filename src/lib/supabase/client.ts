"use client";

import { createBrowserClient } from "@supabase/ssr";
import { normalizarUrl } from "@/lib/url";

/** Cliente Supabase para Client Components (uso futuro no front). */
export function createClient() {
  return createBrowserClient(
    normalizarUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

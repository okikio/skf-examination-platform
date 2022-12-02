import { supabase } from "./client";
import { supabaseSSR } from "./ssr";
import type { APIContext, AstroGlobal } from "astro";

export async function getSupabase(context?: APIContext | AstroGlobal) {
  if (!context) return await supabase();
  return supabaseSSR(context);
}

"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

export function supabaseClient(): SupabaseClient {
  return createClientComponentClient<"public">();
}

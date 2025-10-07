// lib/server/admin.ts
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Require admin role (throws if not logged in or not admin).
 */
export async function requireAdmin() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");
  if (user.app_metadata?.role !== "admin") throw new Error("Forbidden");

  return user;
}

/**
 * Require admin role but redirect to /admin/login if not authorized.
 */
export async function requireAdminOrRedirect() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    redirect("/admin/login");
  }
  return user;
}

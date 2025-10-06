import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_EMAILS = ["admin@gmail.com", "yagna3903@gmail.com"]; // ⬅ change to your real admin(s)

export async function requireAdmin() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");
  if (!ADMIN_EMAILS.includes(user.email ?? "")) throw new Error("Forbidden");

  return user;
}

export async function requireAdminOrRedirect() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    redirect("/admin/login");
  }
  return user;
}

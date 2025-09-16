// lib/server/admin.ts
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

/** Get the current session (helper you can reuse anywhere) */
export async function currentSession() {
  return await getServerSession(authOptions);
}

/** Use inside server actions / API routes to enforce admin */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Not authenticated");
  if ((session.user as any).role !== "admin") throw new Error("Forbidden");
  return session; // return if you need user info
}

/** Use in server components/pages to redirect unauthenticated users */
export async function requireAdminOrRedirect() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/admin/login");
  }
  return session;
}

// app/admin/layout.tsx
import type { ReactNode } from "react";
import AdminHeader from "@/app/admin/_components/AdminHeader";
import { requireAdmin } from "@/lib/server/admin";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdmin().catch(() => null);

  return (
    <div className="min-h-screen bg-cream">
      {session && <AdminHeader />}
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

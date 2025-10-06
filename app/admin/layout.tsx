// app/admin/layout.tsx
import type { ReactNode } from "react";
import AdminHeader from "@/app/admin/_components/AdminHeader";

// Admin layout: no site header/footer, only AdminHeader
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

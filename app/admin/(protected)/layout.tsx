// app/admin/(protected)/layout.tsx

export const dynamic = "force-dynamic";

import type { ReactNode } from "react";
import AdminHeader from "@/app/admin/_components/AdminHeader";

import AutoLogout from "@/app/admin/_components/AutoLogout";

export default function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream/30 via-white to-brand-pink/20">
      <AutoLogout />
      <AdminHeader />
      <main className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}

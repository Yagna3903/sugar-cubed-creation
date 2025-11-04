// app/admin/(protected)/layout.tsx

export const dynamic = "force-dynamic";

import type { ReactNode } from "react";
import AdminHeader from "@/app/admin/_components/AdminHeader";

export default function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}

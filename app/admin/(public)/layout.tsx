// app/admin/(public)/layout.tsx
import type { ReactNode } from "react";
export const dynamic = "force-dynamic";

export default function PublicAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}

// app/admin/(public)/layout.tsx
import type { ReactNode } from "react";

export default function PublicAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <main className="w-full max-w-md px-6 py-8">
        {children}
      </main>
    </div>
  );
}

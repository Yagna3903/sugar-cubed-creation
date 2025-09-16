// app/admin/layout.tsx
import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="font-semibold">Admin</div>

          {/* Only show Sign out when authenticated */}
          {session && (
            <form action="/api/auth/signout" method="post">
              <button className="rounded-xl bg-brand-brown px-3 py-1.5 text-white">
                Sign out
              </button>
            </form>
          )}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

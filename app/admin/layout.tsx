// app/admin/layout.tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  const authed = !!session?.user; // you can also check role if you wish

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          {/* Left: Admin title + inline nav (only when authed) */}
          <div className="flex items-center gap-6">
            <span className="font-semibold">Admin</span>
            {authed && (
              <nav className="flex items-center gap-5 text-sm text-zinc-700">
                <Link href="/admin/products" className="hover:text-black">Products</Link>
                <Link href="/admin/orders" className="hover:text-black">Orders</Link>
                <Link href="/admin/faq" className="hover:text-black">FAQ</Link>
              </nav>
            )}
          </div>

          {/* Right: Sign out button (only when authed) */}
          {authed && (
            <form action="/api/auth/signout" method="post">
              <button className="rounded-xl bg-brand-brown px-3 py-1.5 text-white">
                Sign out
              </button>
            </form>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

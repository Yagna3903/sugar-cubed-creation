// app/admin/(protected)/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";

export default function AdminProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-semibold">Admin</span>

          <div className="space-x-4 text-sm">
            <Link href="/admin/products">Products</Link>
            <Link href="/admin/orders">Orders</Link>
            <Link href="/admin/faq">FAQ</Link> {/* renamed from Inventory */}
          </div>

          <form action="/api/auth/signout" method="post">
            <button className="rounded-xl bg-brand-brown px-3 py-1.5 text-white">
              Sign out
            </button>
          </form>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

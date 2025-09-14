// app/admin/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions); // Session | null

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="font-semibold">Admin</Link>
          <div className="space-x-4 text-sm">
            <Link href="/admin/products">Products</Link>
            <Link href="/admin/orders">Orders</Link>
            <Link href="/admin/inventory">Inventory</Link>
          </div>
          <form action="/api/auth/signout?callbackUrl=/admin/login" method="post">
            <button className="rounded-xl bg-brand-brown px-3 py-1.5 text-white">Sign out</button>
          </form>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

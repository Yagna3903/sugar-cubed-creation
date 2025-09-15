import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminNavClient from "../_components/AdminNavClient";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login?callbackUrl=/admin");

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/admin"
            className="font-semibold hover:opacity-80"
            aria-label="Go to Admin dashboard"
          >
            Admin
          </Link>

          {/* Keep links here */}
          <div className="space-x-4 text-sm">
            <Link href="/admin/products">Products</Link>
            <Link href="/admin/orders">Orders</Link>
            <Link href="/admin/faq">FAQ</Link>
          </div>

          {/* Client bit now only shows Sign out */}
          <AdminNavClient />
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

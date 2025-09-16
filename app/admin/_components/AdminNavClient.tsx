"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function AdminNavClient() {
  const { data: session, status } = useSession();
  if (status === "loading") return null;
  if (!session?.user) return null;

  return (
    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
      <nav className="space-x-6 text-sm">
        <Link href="/admin/(protected)/products">Products</Link>
        <Link href="/admin/(protected)/orders">Orders</Link>
        <Link href="/admin/(protected)/faq">FAQ</Link>
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="rounded-xl bg-brand-brown px-3 py-1.5 text-white"
      >
        Sign out
      </button>
    </div>
  );
}

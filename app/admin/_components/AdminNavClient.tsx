"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function AdminNavClient() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-sm text-zinc-500">Loading…</div>;
  }
  if (!session) {
    return <div className="text-sm text-zinc-500">Please sign in</div>;
  }

  return (
    <>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="rounded-xl bg-brand-brown px-3 py-1.5 text-white"
      >
        Sign out
      </button>
    </>
  );
}

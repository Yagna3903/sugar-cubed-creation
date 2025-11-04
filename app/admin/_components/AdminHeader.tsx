"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

export default function AdminHeader() {
  const router = useRouter();
  const supabase = supabaseClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login"); // take them to login
    router.refresh();            // clear cached session
  }

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="font-semibold">Admin</div>
        <button
          onClick={handleSignOut}
          className="rounded-xl bg-brand-brown px-3 py-1.5 text-white"
        >
          Sign out
        </button>
      </nav>
    </header>
  );
}

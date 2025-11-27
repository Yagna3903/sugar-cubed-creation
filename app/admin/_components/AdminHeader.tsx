"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export default function AdminHeader() {
  const router = useRouter();
  const supabase = supabaseClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const userName = (user?.user_metadata?.name as string | undefined) ?? "Admin";
  const userEmail = user?.email ?? "";

  // Get initials for avatar
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="relative bg-gradient-to-r from-brand-cream via-white to-brand-pink/30 border-b border-zinc-200/50 backdrop-blur-sm sticky top-0 z-50">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-brown/5 via-transparent to-brand-pink/5 pointer-events-none" />

      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-brown to-brand-brown/80 text-white text-xl shadow-md">
            🍪
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-zinc-900">
              Admin Panel
            </h1>
            <p className="text-xs text-zinc-500">Sugar Cubed Creation</p>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          {/* User Info */}
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-zinc-900">{userName}</p>
            <p className="text-xs text-zinc-500">{userEmail}</p>
          </div>

          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-brown to-brand-brown/70 text-white text-sm font-semibold shadow-md ring-2 ring-white">
            {initials}
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="rounded-xl bg-gradient-to-r from-brand-brown to-brand-brown/90 px-4 py-2 text-sm font-medium text-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 active:scale-95"
          >
            Sign Out
          </button>
        </div>
      </nav>
    </header>
  );
}

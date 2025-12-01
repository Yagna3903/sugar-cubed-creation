"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import {
  IconSettings,
  IconHelp,
  IconPhoto,
} from "@tabler/icons-react";
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
    <header className="bg-gradient-to-r from-brand-cream via-white to-brand-pink/30 border-b border-zinc-200/50 backdrop-blur-sm sticky top-0 z-50">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-brown/5 via-transparent to-brand-pink/5 pointer-events-none" />

      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo/Brand */}
        <div className="flex items-center gap-8">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-brown to-brand-brown/80 text-white text-xl shadow-md">
              🍪
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-zinc-900">
                Admin Panel
              </h1>
              <p className="text-xs text-zinc-500">Sugar Cubed Creations</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/admin" icon={<IconSettings className="w-4 h-4" />}>
              Dashboard
            </NavLink>
            <NavLink href="/admin/orders" icon={<IconPhoto className="w-4 h-4" />}>
              Orders
            </NavLink>
            <NavLink href="/admin/products" icon={<IconPhoto className="w-4 h-4" />}>
              Products
            </NavLink>
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
            className="hidden sm:block rounded-xl bg-gradient-to-r from-brand-brown to-brand-brown/90 px-4 py-2 text-sm font-medium text-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 active:scale-95"
          >
            Sign Out
          </button>

          {/* Mobile Menu Button */}
          <MobileMenu handleSignOut={handleSignOut} />
        </div>
      </nav>
    </header>
  );
}

function MobileMenu({ handleSignOut }: { handleSignOut: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-zinc-600 hover:bg-brand-brown/5 rounded-lg transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-zinc-200 shadow-lg p-4 animate-slide-up flex flex-col gap-2">
          <NavLink href="/admin" icon={<IconSettings className="w-4 h-4" />}>
            Dashboard
          </NavLink>
          <NavLink href="/admin/orders" icon={<IconPhoto className="w-4 h-4" />}>
            Orders
          </NavLink>
          <NavLink href="/admin/products" icon={<IconPhoto className="w-4 h-4" />}>
            Products
          </NavLink>
          <hr className="my-2 border-zinc-100" />
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
        ? "bg-brand-brown/10 text-brand-brown"
        : "text-zinc-600 hover:text-brand-brown hover:bg-brand-brown/5"
        }`}
    >
      {icon}
      {children}
    </Link>
  );
}

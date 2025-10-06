import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

export default function AdminHeader() {
  async function signOutAction() {
    "use server";
    const supabase = createServerActionClient({ cookies });
    await supabase.auth.signOut();
  }

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="font-semibold">Admin</div>
        <form action={signOutAction}>
          <button className="rounded-xl bg-brand-brown px-3 py-1.5 text-white">Sign out</button>
        </form>
      </nav>
    </header>
  );
}

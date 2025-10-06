"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const err = sp.get("error");
  const callbackUrl = sp.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(err ? "Sign-in failed." : null);

  async function onPasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    const supabase = supabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setMsg(error.message || "Invalid email or password.");
    } else {
      router.replace(callbackUrl);
    }
  }

  async function onMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    const supabase = supabaseClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setBusy(false);
    if (error) setMsg(error.message || "Could not send magic link.");
    else setMsg("Check your email for the login link.");
  }

  return (
    <div className="mx-auto max-w-md py-14">
      <h1 className="text-2xl font-semibold">Admin login</h1>
      <p className="mb-6 text-sm text-zinc-600">Authorized staff only.</p>

      {msg && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{msg}</p>
      )}

      <form onSubmit={onPasswordLogin} className="rounded-2xl border bg-white p-5 shadow-soft space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="owner@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="•••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-brand-brown px-4 py-2 text-white disabled:opacity-70"
        >
          {busy ? "Signing in…" : "Sign in with password"}
        </button>

        <button onClick={onMagicLink} disabled={busy} className="w-full rounded-xl border px-4 py-2">
          Or send magic link
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        <Link className="underline" href="/">← Back to site</Link>
      </p>
    </div>
  );
}

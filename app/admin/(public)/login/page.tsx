// app/admin/(public)/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const sp = useSearchParams();
  const err = sp.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onPasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/admin",
      redirect: true, // let NextAuth redirect on success/failure
    });
    setBusy(false);
    if (!res?.ok) setMsg("Invalid email or password.");
  }

  async function onMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    const res = await signIn("email", { email, callbackUrl: "/admin", redirect: true });
    setBusy(false);
    if (!res?.ok) setMsg("Could not send magic link.");
  }

  return (
    <div className="mx-auto max-w-md py-14">
      <h1 className="text-2xl font-semibold">Admin login</h1>
      <p className="mb-6 text-sm text-zinc-600">Authorized staff only.</p>

      {(err || msg) && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {msg ?? "Sign-in failed. Check your credentials."}
        </p>
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
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

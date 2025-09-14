"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    await signIn("credentials", { email, password, callbackUrl });
    setSubmitting(false);
  }

  async function onMagic(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    const res = await signIn("email", { email, callbackUrl, redirect: false });
    setSending(false);
    if (res?.error) setError(res.error);
    else alert("Check your email for the sign-in link.");
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-semibold">Admin login</h1>
      <p className="mt-1 text-sm text-zinc-600">Authorized staff only.</p>

      <form className="mt-8 space-y-4 rounded-2xl border bg-white/70 p-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full rounded-xl border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="owner@example.com"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full rounded-xl border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={onPassword}
          disabled={submitting}
          className="w-full rounded-xl bg-brand-brown px-4 py-2 text-white disabled:opacity-70"
        >
          {submitting ? "Signing in…" : "Sign in with password"}
        </button>

        <button
          onClick={onMagic}
          disabled={sending}
          className="w-full rounded-xl border px-4 py-2"
        >
          {sending ? "Sending link…" : "Or send magic link"}
        </button>
      </form>
    </div>
  );
}

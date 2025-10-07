"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const sp = useSearchParams();
  const router = useRouter();
  const err = sp.get("error");
  const callbackUrl = sp.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(err ? "Sign-in failed." : null);
  const [msgType, setMsgType] = useState<"error" | "success">("error");

  // Normal password login
  async function onPasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);

    const supabase = supabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setBusy(false);
    if (error) {
      setMsg(error.message || "Invalid email or password.");
      setMsgType("error");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  // Forgot password → Supabase reset flow
  async function onForgotPassword() {
    if (!email) {
      setMsg("Please enter your email first.");
      setMsgType("error");
      return;
    }

    setMsg(null);
    setBusy(true);

    const supabase = supabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // IMPORTANT: this must match your real public reset page
      redirectTo: `${window.location.origin}/admin/update-password`,
    });

    setBusy(false);
    if (error) {
      setMsg(error.message || "Could not send reset email.");
      setMsgType("error");
    } else {
      setMsg("✅ Check your email for the password reset link.");
      setMsgType("success");
    }
  }

  return (
    <div className="mx-auto max-w-md py-14">
      <h1 className="text-2xl font-semibold">Admin login</h1>
      <p className="mb-6 text-sm text-zinc-600">Authorized staff only.</p>

      {msg && (
        <p
          className={`mb-4 rounded-lg px-3 py-2 text-sm ${
            msgType === "error"
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {msg}
        </p>
      )}

      <form
        onSubmit={onPasswordLogin}
        className="rounded-2xl border bg-white p-5 shadow-soft space-y-4"
      >
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

        <button
          type="button"
          onClick={onForgotPassword}
          disabled={busy || !email}
          className="w-full rounded-xl border px-4 py-2 disabled:opacity-60"
        >
          Forgot password?
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        <Link className="underline" href="/">
          ← Back to site
        </Link>
      </p>
    </div>
  );
}

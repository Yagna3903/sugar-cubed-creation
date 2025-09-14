// app/admin/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const { status, data } = useSession();
  const router = useRouter();
  const sp = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // If already signed in, bounce to the admin home (or callbackUrl)
  useEffect(() => {
    if (status === "authenticated") {
      const cb = sp.get("callbackUrl") || "/admin";
      router.replace(cb);
    }
  }, [status, sp, router]);

  // Show NextAuth error query (e.g., ?error=CredentialsSignin)
  useEffect(() => {
    const err = sp.get("error");
    if (!err) return;
    const map: Record<string, string> = {
      CredentialsSignin: "Invalid email or password.",
      AccessDenied: "Access denied.",
      Default: "Could not sign in. Please try again.",
    };
    setMsg(map[err] || map.Default);
  }, [sp]);

  async function onPasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setSubmitting(true);

    const res = await signIn("credentials", {
      redirect: false,            // we will navigate manually
      email,
      password,
      callbackUrl: "/admin",
    });

    setSubmitting(false);

    if (!res) {
      setMsg("Could not reach the server.");
      return;
    }
    if (res.error) {
      setMsg("Invalid email or password.");
      return;
    }

    // res.ok + res.url present → navigate
    router.replace(res.url || "/admin");
  }

  async function onMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await signIn("email", {
      email,
      callbackUrl: "/admin",
      redirect: false,
    });
    if (res?.error) setMsg("Could not send link. Check the email.");
    else setMsg("Check your email for a sign-in link.");
  }

  // While already signed in, render a tiny placeholder to avoid flicker
  if (status === "authenticated") {
    return <p className="px-6 py-10 text-center text-sm text-zinc-600">Redirecting…</p>;
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <h1 className="text-2xl font-semibold">Admin login</h1>
      <p className="mt-1 text-sm text-zinc-600">Authorized staff only.</p>

      <form onSubmit={onPasswordLogin} className="mt-6 rounded-2xl border bg-white p-6 shadow-soft space-y-4">
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
            placeholder="••••••••"
            required
          />
        </div>

        {msg && <p className="text-sm text-red-600">{msg}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-brand-brown px-4 py-3 font-medium text-white disabled:opacity-70"
        >
          {submitting ? "Signing in…" : "Sign in with password"}
        </button>

        <button
          onClick={onMagicLink}
          className="w-full rounded-xl border px-4 py-3 text-sm"
        >
          Or send magic link
        </button>
      </form>
    </div>
  );
}

"use client";
export const dynamic = "force-dynamic";

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
      router.refresh();
      router.push(callbackUrl);
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
    <div className="min-h-screen bg-gradient-to-br from-brand-cream/50 via-white to-brand-pink/30 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Logo/Brand section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-brown to-brand-brown/80 text-white text-2xl sm:text-3xl shadow-lg mb-3 sm:mb-4 transform hover:scale-105 transition-transform duration-200">
            🍪
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-brown mb-1 sm:mb-2">
            Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">Sugar Cubed Creation · Authorized Access Only</p>
        </div>

        {/* Alert message */}
        {msg && (
          <div
            className={`mb-4 sm:mb-6 rounded-xl px-3 sm:px-4 py-3 sm:py-3.5 text-sm font-medium shadow-sm ${msgType === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
              }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-base sm:text-lg flex-shrink-0">{msgType === "error" ? "⚠️" : "✅"}</span>
              <span className="text-xs sm:text-sm">{msg}</span>
            </div>
          </div>
        )}

        {/* Login form card */}
        <div className="bg-white rounded-2xl shadow-xl border border-zinc-200/50 overflow-hidden">
          <form onSubmit={onPasswordLogin} className="p-6 sm:p-8 space-y-5 sm:space-y-6">
            {/* Email input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-zinc-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none text-zinc-400">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl border border-zinc-300 bg-white focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/20 transition-all duration-200 outline-none text-sm sm:text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sugarcubed.com"
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-zinc-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none text-zinc-400">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl border border-zinc-300 bg-white focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/20 transition-all duration-200 outline-none text-sm sm:text-base"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-gradient-to-r from-brand-brown to-brand-brown/90 px-6 py-3 sm:py-3.5 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
            >
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Forgot password button */}
            <button
              type="button"
              onClick={onForgotPassword}
              disabled={busy || !email}
              className="w-full text-sm sm:text-base text-brand-brown hover:text-brand-brown/80 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed py-2"
            >
              Forgot Password?
            </button>
          </form>
        </div>

        {/* Back to site link */}
        <div className="mt-6 sm:mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-zinc-600 hover:text-brand-brown transition-colors duration-200"
          >
            <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}

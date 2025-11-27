"use client";
export const dynamic = "force-dynamic";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";
import Link from "next/link";

function UpdatePasswordInner() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<"error" | "success">("error");
  const [sessionReady, setSessionReady] = useState(false);
  const [verifying, setVerifying] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the token_hash from URL (Supabase sends this as 'token_hash' in the URL)
  const tokenHash = searchParams.get("token_hash") || searchParams.get("code");

  const strength = (() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const labels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-green-600",
  ];

  // Verify recovery code and establish session
  useEffect(() => {
    async function verifyRecovery() {
      if (!tokenHash) {
        setMsg("❌ Reset link is invalid or missing recovery code.");
        setMsgType("error");
        setVerifying(false);
        return;
      }

      const supabase = supabaseClient();

      // Use verifyOtp with token_hash for recovery
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "recovery",
      });

      setVerifying(false);

      if (error) {
        setMsg("⚠️ This reset link is invalid or has expired. Please request a new one.");
        setMsgType("error");
      } else if (data.session) {
        setSessionReady(true);
        setMsg("✅ Verified! You can now set a new password.");
        setMsgType("success");
      } else {
        setMsg("⚠️ Could not establish session. Please request a new reset link.");
        setMsgType("error");
      }
    }
    verifyRecovery();
  }, [tokenHash]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMsg("❌ Passwords do not match.");
      setMsgType("error");
      return;
    }

    if (strength < 2) {
      setMsg("❌ Password is too weak. Please choose a stronger password.");
      setMsgType("error");
      return;
    }

    setBusy(true);
    setMsg(null);

    const supabase = supabaseClient();
    const { error } = await supabase.auth.updateUser({ password });

    setBusy(false);
    if (error) {
      setMsg(`❌ ${error.message}`);
      setMsgType("error");
    } else {
      setMsg("✅ Password updated successfully! Redirecting to login...");
      setMsgType("success");
      setTimeout(() => router.push("/admin/login"), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream/50 via-white to-brand-pink/30 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Logo/Brand section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-brown to-brand-brown/80 text-white text-2xl sm:text-3xl shadow-lg mb-3 sm:mb-4 transform hover:scale-105 transition-transform duration-200">
            🔑
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-brown mb-1 sm:mb-2">
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">Choose a strong password for your account</p>
        </div>

        {/* Verifying state */}
        {verifying && (
          <div className="bg-white rounded-2xl shadow-xl border border-zinc-200/50 p-6 sm:p-8 text-center">
            <div className="flex items-center justify-center gap-3 text-brand-brown">
              <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="font-medium text-sm sm:text-base">Verifying reset link...</span>
            </div>
          </div>
        )}

        {/* Alert message */}
        {!verifying && msg && (
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

        {/* Reset form card */}
        {!verifying && sessionReady && (
          <div className="bg-white rounded-2xl shadow-xl border border-zinc-200/50 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 sm:space-y-6">
              {/* New password input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-zinc-700">
                  New Password
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
                    minLength={8}
                  />
                </div>
              </div>

              {/* Confirm password input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-zinc-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none text-zinc-400">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl border border-zinc-300 bg-white focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/20 transition-all duration-200 outline-none text-sm sm:text-base"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="space-y-2 p-3 sm:p-4 bg-zinc-50 rounded-xl">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-medium text-zinc-600">Password Strength</span>
                    <span className={`font-semibold text-xs sm:text-sm ${strength >= 3 ? 'text-green-600' : strength >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {labels[strength] || "Too short"}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-200 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${colors[strength] || "bg-red-500"}`}
                      style={{ width: `${(strength / 4) * 100}%` }}
                    />
                  </div>
                  <ul className="text-xs text-zinc-600 mt-2 sm:mt-3 space-y-1">
                    <li className={password.length >= 8 ? "text-green-600" : ""}>
                      ✓ At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>
                      ✓ One uppercase letter
                    </li>
                    <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>
                      ✓ One number
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-600" : ""}>
                      ✓ One special character
                    </li>
                  </ul>
                </div>
              )}

              {/* Update button */}
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
                    Updating...
                  </span>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Failed verification - show link back */}
        {!verifying && !sessionReady && (
          <div className="bg-white rounded-2xl shadow-xl border border-zinc-200/50 p-6 sm:p-8 text-center space-y-4">
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-brand-brown to-brand-brown/90 px-6 py-3 sm:py-3.5 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm sm:text-base"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>
          </div>
        )}

        {/* Back to login link */}
        <div className="mt-6 sm:mt-8 text-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-zinc-600 hover:text-brand-brown transition-colors duration-200"
          >
            <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-brown/10 text-brand-brown mb-4">
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-zinc-600">Loading...</p>
        </div>
      </div>
    }>
      <UpdatePasswordInner />
    </Suspense>
  );
}


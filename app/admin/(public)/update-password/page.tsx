"use client";
export const dynamic = "force-dynamic";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  IconKey,
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconLoader2,
  IconLock,
  IconEye,
  IconEyeOff,
  IconArrowLeft
} from "@tabler/icons-react";

function UpdatePasswordInner() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<"error" | "success">("error");
  const [sessionReady, setSessionReady] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

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
  const verificationAttempted = useRef(false);

  useEffect(() => {
    async function verifyRecovery() {
      const code = searchParams.get("code");
      const token_hash = searchParams.get("token_hash");

      if (!code && !token_hash) {
        setMsg("Reset link is invalid or missing recovery code.");
        setMsgType("error");
        setVerifying(false);
        return;
      }

      // Prevent double invocation in Strict Mode
      if (verificationAttempted.current) return;
      verificationAttempted.current = true;

      const supabase = supabaseClient();

      let error;
      let data;

      try {
        if (code) {
          // Exchange auth code for session (PKCE flow)
          const result = await supabase.auth.exchangeCodeForSession(code);
          data = result.data;
          error = result.error;
        } else if (token_hash) {
          // Verify token hash (Implicit/Magic Link flow)
          const result = await supabase.auth.verifyOtp({
            token_hash,
            type: "recovery",
          });
          data = result.data;
          error = result.error;
        }

        setVerifying(false);

        if (error) {
          console.error("Recovery error:", error);
          // If we already have a session, ignore the error (it might be a double-check)
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData.session) {
            setSessionReady(true);
            setMsg("Verified! You can now set a new password.");
            setMsgType("success");
          } else {
            setMsg("This reset link is invalid or has expired. Please request a new one.");
            setMsgType("error");
          }
        } else if (data?.session) {
          setSessionReady(true);
          setMsg("Verified! You can now set a new password.");
          setMsgType("success");
        } else {
          setMsg("Could not establish session. Please request a new reset link.");
          setMsgType("error");
        }
      } catch (err) {
        console.error("Unexpected error during recovery:", err);
        setVerifying(false);
        setMsg("An unexpected error occurred. Please try again.");
        setMsgType("error");
      }
    }
    verifyRecovery();
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMsg("Passwords do not match.");
      setMsgType("error");
      return;
    }

    if (strength < 2) {
      setMsg("Password is too weak. Please choose a stronger password.");
      setMsgType("error");
      return;
    }

    setBusy(true);
    setMsg(null);

    const supabase = supabaseClient();
    const { error } = await supabase.auth.updateUser({ password });

    setBusy(false);
    if (error) {
      setMsg(error.message);
      setMsgType("error");
    } else {
      setMsg("Password updated successfully! Redirecting to login...");
      setMsgType("success");
      setTimeout(() => router.push("/admin/login"), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream/50 via-white to-brand-pink/30 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Logo/Brand section */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-brown to-brand-brown/80 text-white shadow-lg mb-4 transform hover:scale-105 transition-transform duration-200">
            <IconKey size={32} stroke={1.5} />
          </div>
          <h1 className="font-display text-3xl font-bold text-brand-brown mb-2">
            Reset Password
          </h1>
          <p className="text-zinc-600">Choose a strong password for your account</p>
        </div>

        {/* Verifying state */}
        {verifying && (
          <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 p-8 text-center">
            <div className="flex flex-col items-center gap-4 text-brand-brown">
              <div className="animate-spin text-brand-brown/50">
                <IconLoader2 size={32} />
              </div>
              <span className="font-medium">Verifying reset link...</span>
            </div>
          </div>
        )}

        {/* Alert message */}
        {!verifying && msg && (
          <div
            className={`mb-6 rounded-2xl px-4 py-4 text-sm font-medium shadow-sm flex items-start gap-3 ${msgType === "error"
                ? "bg-red-50 text-red-700 border border-red-100"
                : "bg-green-50 text-green-700 border border-green-100"
              }`}
          >
            <div className="mt-0.5 shrink-0">
              {msgType === "error" ? <IconAlertTriangle size={18} /> : <IconCheck size={18} />}
            </div>
            <span>{msg}</span>
          </div>
        )}

        {/* Reset form card */}
        {!verifying && sessionReady && (
          <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* New password input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-zinc-700">
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-brand-brown transition-colors">
                    <IconLock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/10 transition-all duration-200 outline-none text-zinc-900 placeholder:text-zinc-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-brand-brown transition-colors"
                  >
                    {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm password input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-zinc-700">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-brand-brown transition-colors">
                    <IconLock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/10 transition-all duration-200 outline-none text-zinc-900 placeholder:text-zinc-400"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-brand-brown transition-colors"
                  >
                    {showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="space-y-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-medium text-zinc-600">Password Strength</span>
                    <span className={`font-bold text-xs ${strength >= 3 ? 'text-green-600' : strength >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {labels[strength] || "Too short"}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-200 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ease-out ${colors[strength] || "bg-red-500"}`}
                      style={{ width: `${(strength / 4) * 100}%` }}
                    />
                  </div>
                  <ul className="text-xs text-zinc-500 space-y-1.5 pt-1">
                    <li className={`flex items-center gap-2 ${password.length >= 8 ? "text-green-600 font-medium" : ""}`}>
                      {password.length >= 8 ? <IconCheck size={12} /> : <div className="w-3 h-3 rounded-full border border-zinc-300" />}
                      At least 8 characters
                    </li>
                    <li className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? "text-green-600 font-medium" : ""}`}>
                      {/[A-Z]/.test(password) ? <IconCheck size={12} /> : <div className="w-3 h-3 rounded-full border border-zinc-300" />}
                      One uppercase letter
                    </li>
                    <li className={`flex items-center gap-2 ${/[0-9]/.test(password) ? "text-green-600 font-medium" : ""}`}>
                      {/[0-9]/.test(password) ? <IconCheck size={12} /> : <div className="w-3 h-3 rounded-full border border-zinc-300" />}
                      One number
                    </li>
                    <li className={`flex items-center gap-2 ${/[^A-Za-z0-9]/.test(password) ? "text-green-600 font-medium" : ""}`}>
                      {/[^A-Za-z0-9]/.test(password) ? <IconCheck size={12} /> : <div className="w-3 h-3 rounded-full border border-zinc-300" />}
                      One special character
                    </li>
                  </ul>
                </div>
              )}

              {/* Update button */}
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-gradient-to-r from-brand-brown to-brand-brown/90 px-6 py-4 text-white font-bold shadow-lg shadow-brand-brown/20 hover:shadow-xl hover:shadow-brand-brown/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {busy ? (
                  <>
                    <IconLoader2 className="animate-spin" size={20} />
                    <span>Updating...</span>
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Failed verification - show link back */}
        {!verifying && !sessionReady && (
          <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <IconX size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Link Expired</h3>
              <p className="text-zinc-600 text-sm">
                The password reset link is invalid or has expired. Please request a new one.
              </p>
            </div>
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-zinc-100 text-zinc-900 font-bold px-6 py-3.5 hover:bg-zinc-200 transition-all"
            >
              <IconArrowLeft size={18} />
              Back to Login
            </Link>
          </div>
        )}

        {/* Back to login link */}
        {sessionReady && (
          <div className="mt-8 text-center">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-brand-brown transition-colors duration-200 group"
            >
              <IconArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-brown/10 text-brand-brown mb-4">
            <IconLoader2 className="animate-spin" size={24} />
          </div>
          <p className="text-zinc-600 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <UpdatePasswordInner />
    </Suspense>
  );
}

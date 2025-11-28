"use client";
export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";
import { IconCookie, IconShield, IconLock, IconChart } from "@/components/ui/bakery-icons";

export default function LoginForm() {
  const sp = useSearchParams();
  const err = sp.get("error");
  const callbackUrl = sp.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(err ? "Sign-in failed." : null);
  const [msgType, setMsgType] = useState<"error" | "success">("error");
  const [showPassword, setShowPassword] = useState(false);

  async function onPasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);

    const supabase = supabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setBusy(false);
      setMsg(error.message || "Invalid email or password.");
      setMsgType("error");
    } else {
      window.location.href = callbackUrl;
    }
  }

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
      setMsg("Check your email for the password reset link.");
      setMsgType("success");
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = document.getElementById("login-container");
      if (container) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        container.style.setProperty("--mouse-x", `${x}%`);
        container.style.setProperty("--mouse-y", `${y}%`);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      id="login-container"
      className="min-h-screen bg-gradient-to-b from-brand-cream/30 via-white to-brand-pink/10 relative overflow-hidden"
      style={{ "--mouse-x": "50%", "--mouse-y": "50%" } as React.CSSProperties}
    >
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20 animate-fade-in">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-brand-brown transition-colors group font-medium bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-brand-brown/10 hover:bg-white hover:shadow-sm"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Store
        </Link>
      </div>

      {/* Background Pattern - Dot Grid with Spotlight */}
      <div
        className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none transition-opacity duration-500"
        style={{
          backgroundImage: 'radial-gradient(#6b4226 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(circle 600px at var(--mouse-x) var(--mouse-y), black, transparent)',
          WebkitMaskImage: 'radial-gradient(circle 600px at var(--mouse-x) var(--mouse-y), black, transparent)'
        }}
      />

      {/* Floating Background Decorations with Parallax */}
      <div
        className="absolute top-20 right-10 text-brand-brown/[0.08] animate-float-slow pointer-events-none transition-transform duration-100 ease-out will-change-transform"
        style={{ transform: 'translate(calc(var(--mouse-x) * -0.05), calc(var(--mouse-y) * -0.05))' }}
      >
        <div className="animate-spin-very-slow">
          <IconShield className="w-40 h-40" />
        </div>
      </div>
      <div
        className="absolute bottom-40 left-10 text-brand-brown/[0.09] animate-float-reverse pointer-events-none transition-transform duration-100 ease-out will-change-transform"
        style={{ transform: 'translate(calc(var(--mouse-x) * 0.08), calc(var(--mouse-y) * 0.08))' }}
      >
        <div className="animate-wiggle">
          <IconLock className="w-32 h-32" />
        </div>
      </div>
      <div
        className="absolute top-1/3 left-1/4 text-brand-pink-dark/[0.15] animate-float-slower pointer-events-none transition-transform duration-100 ease-out will-change-transform"
        style={{ transform: 'translate(calc(var(--mouse-x) * 0.04), calc(var(--mouse-y) * 0.04))' }}
      >
        <div className="animate-pulse-slow">
          <IconChart className="w-24 h-24" />
        </div>
      </div>

      {/* Main Content */}
      {/* Main Content */}
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl">
          {/* Header Section */}
          <div className="mb-8 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-brown to-brand-brown-hover shadow-soft mb-6 relative group hover:scale-105 transition-transform duration-300">
              <IconCookie className="w-10 h-10 text-brand-cream" />
              <div className="absolute inset-0 rounded-2xl bg-brand-brown/20 blur-xl group-hover:blur-2xl transition-all" />
            </div>
            <h1 className="font-display text-3xl font-bold text-brand-brown mb-2">
              Admin Portal
            </h1>
            <p className="text-zinc-600 text-sm font-medium">Sugar Cubed Creation</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-strong border border-brand-brown/10 overflow-hidden animate-slide-up flex flex-col md:flex-row">
            {/* Left Side - Visual */}
            <div className="md:w-5/12 bg-brand-brown/5 p-8 flex flex-col justify-center items-center text-center border-r border-brand-brown/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-brown/5 to-transparent" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 mx-auto text-brand-brown">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="font-display text-xl font-bold text-brand-brown mb-3">Secure Access</h2>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Please sign in to manage orders, products, and view analytics.
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:w-7/12 p-8 md:p-10 bg-white">
              <h3 className="font-display text-2xl font-bold text-brand-brown mb-6">Sign In</h3>

              {/* Alert */}
              {msg && (
                <div
                  className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium animate-fade-in ${msgType === "error"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{msgType === "error" ? "⚠️" : ""}</span>
                    <span>{msg}</span>
                  </div>
                </div>
              )}

              <form onSubmit={onPasswordLogin} className="space-y-5">
                {/* Email Input */}
                <div className="group">
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown/40 group-focus-within:text-brand-brown transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@sugarcubed.com"
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-brand-cream/50 border border-brand-brown/20 rounded-xl text-zinc-800 placeholder-zinc-400 outline-none focus:bg-white focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/10 transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="group">
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown/40 group-focus-within:text-brand-brown transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-12 pr-12 py-3.5 bg-brand-cream/50 border border-brand-brown/20 rounded-xl text-zinc-800 placeholder-zinc-400 outline-none focus:bg-white focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-brown/40 hover:text-brand-brown transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-brand-brown/30 bg-brand-cream/50 text-brand-brown focus:ring-2 focus:ring-brand-brown/20"
                    />
                    <span className="text-zinc-600 group-hover:text-brand-brown transition-colors font-medium">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    disabled={busy || !email}
                    className="text-brand-brown hover:text-brand-brown-hover transition-colors disabled:opacity-50 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={busy}
                  className="relative w-full py-4 rounded-xl font-bold text-white overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed shadow-medium hover:shadow-strong transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-brown via-brand-brown-light to-brand-brown bg-[length:200%_100%] bg-[position:0%_0%] group-hover:bg-[position:100%_0%] transition-all duration-500" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {busy && (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    {busy ? "Signing in..." : "Sign In"}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Back Link */}
        </div>
      </div>
    </div>
  );
}

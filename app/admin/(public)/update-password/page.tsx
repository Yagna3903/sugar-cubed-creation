"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const type = searchParams.get("type");

  // Step 1: Verify the recovery code and establish session
  useEffect(() => {
    async function verifyRecovery() {
      if (!code || type !== "recovery") {
        setMsg("❌ Invalid or missing recovery token.");
        return;
      }

      const supabase = supabaseClient();
      const { error } = await supabase.auth.verifyOtp({
        token_hash: code,
        type: "recovery",
      });

      if (error) {
        console.error("verifyOtp error:", error);
        setMsg("⚠️ Session could not be established. Please request a new reset link.");
      } else {
        setSessionReady(true);
      }
    }
    verifyRecovery();
  }, [code, type]);

  // Step 2: Update password once session is active
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);

    const supabase = supabaseClient();
    const { error } = await supabase.auth.updateUser({ password });

    setBusy(false);
    if (error) {
      setMsg(error.message);
    } else {
      setMsg("✅ Password updated successfully. Redirecting to login…");
      setTimeout(() => router.push("/admin/login"), 2000);
    }
  }

  return (
    <div className="mx-auto max-w-md py-14">
      <h1 className="text-2xl font-semibold">Set a new password</h1>
      <p className="mb-6 text-sm text-zinc-600">Choose a strong password for your admin account.</p>

      {msg && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{msg}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border bg-white p-5 shadow-soft space-y-4"
      >
        <div>
          <label className="block text-sm font-medium">New password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={!sessionReady}
          />
        </div>

        <button
          type="submit"
          disabled={busy || !sessionReady}
          className="w-full rounded-xl bg-brand-brown px-4 py-2 text-white disabled:opacity-70"
        >
          {busy ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}

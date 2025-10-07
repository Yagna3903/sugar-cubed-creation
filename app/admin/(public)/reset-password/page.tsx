"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

// 🔹 Inner component so we can wrap it with <Suspense>
function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [strength, setStrength] = useState(0);

  function checkStrength(pw: string) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    setStrength(score);
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const supabase = supabaseClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMsg(error.message);
    } else {
      setMsg("✅ Password updated successfully. Redirecting…");
      setTimeout(() => router.push("/admin/login"), 1500);
    }
  }

  return (
    <div className="mx-auto max-w-md py-14">
      <h1 className="text-2xl font-semibold">Reset Password</h1>
      <p className="mb-6 text-sm text-zinc-600">Choose a strong new password.</p>

      {msg && <p className="mb-4 text-sm text-red-600">{msg}</p>}

      <form
        onSubmit={handleReset}
        className="rounded-2xl border bg-white p-5 shadow-soft space-y-4"
      >
        <div>
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              checkStrength(e.target.value);
            }}
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="h-2 w-full bg-gray-200 rounded">
          <div
            className={`h-2 rounded ${
              strength <= 1
                ? "bg-red-500 w-1/4"
                : strength === 2
                ? "bg-yellow-500 w-2/4"
                : strength === 3
                ? "bg-blue-500 w-3/4"
                : "bg-green-600 w-full"
            }`}
          />
        </div>
        <p className="text-xs text-gray-500">
          {strength <= 1 && "Weak"}
          {strength === 2 && "Fair"}
          {strength === 3 && "Good"}
          {strength === 4 && "Strong"}
        </p>

        <button
          type="submit"
          className="w-full rounded-xl bg-brand-brown px-4 py-2 text-white"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <ResetPasswordInner />
    </Suspense>
  );
}

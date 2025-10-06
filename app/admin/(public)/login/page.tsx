// app/admin/(public)/login/page.tsx
"use client";

import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const runtime = "nodejs"; // ⬅ important so Supabase SDK runs in Node.js runtime

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading login…</div>}>
      <LoginForm />
    </Suspense>
  );
}

// app/checkout/success/success-client.tsx
"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function SuccessClient() {
  const sp = useSearchParams();

  const orderId = sp.get("orderId") ?? "";
  const name = sp.get("name") ?? "";
  const email = sp.get("email") ?? "";
  const totalStr = sp.get("total") ?? "";

  const total = useMemo(() => {
    const n = Number(totalStr);
    if (Number.isNaN(n)) return null;
    try {
      return new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
      }).format(n);
    } catch {
      return `$${n.toFixed(2)} CAD`;
    }
  }, [totalStr]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      {/* checkmark */}
      <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-green-100">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M20 7L9 18l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="text-3xl font-semibold">Order confirmed</h1>
      <p className="mt-2 text-zinc-700">
        Thanks{ name ? `, ${name}` : "" }! We’ve emailed your receipt to <strong>{email}</strong>.
      </p>

      <div className="mx-auto mt-8 w-full max-w-lg rounded-2xl border bg-white/70 p-5 text-left shadow-soft">
        <div className="text-sm text-zinc-500">Order ID</div>
        <div className="mt-1 font-mono break-all">{orderId}</div>
        {total && (
          <div className="mt-4 text-lg font-medium">
            Total: <span className="font-semibold">{total}</span>
          </div>
        )}
      </div>

      <Link
        href="/shop"
        className="mt-8 inline-block rounded-xl bg-brand-brown px-6 py-3 text-white shadow-soft"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

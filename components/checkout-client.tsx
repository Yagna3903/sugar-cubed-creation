"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";

type OrderResponse = { orderId: string; checkoutUrl: string };

export default function CheckoutClient() {
  const router = useRouter();
  const { items, clear } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!items.length) return setError("Your cart is empty.");
    if (!name.trim() || !email.trim()) return setError("Please enter your name and email.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, email },
          items: items.map((i) => ({ id: i.id, qty: i.qty })),
        }),
      });

      const json = (await res.json().catch(() => ({}))) as Partial<OrderResponse>;
      if (!res.ok || !json?.checkoutUrl) throw new Error("Checkout failed");

      const url = String(json.checkoutUrl);

      // Clear cart, then navigate. SPA replace + hard fallback.
      clear();
      setTimeout(() => {
        router.replace(url);
        setTimeout(() => {
          if (window.location.href !== url) window.location.href = url;
        }, 150);
      }, 0);

      return;
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl mx-auto px-4 py-10 space-y-6">
      {/* Hidden Link to encourage Next to prefetch success route safely */}
      <div style={{ position: "absolute", left: -9999, top: -9999 }}>
        <Link href="/checkout/success" prefetch>
          prefetch
        </Link>
      </div>

      <h1 className="text-2xl font-semibold">Checkout</h1>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Full name</label>
        <input
          className="w-full rounded-xl border border-zinc-300 px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          className="w-full rounded-xl border border-zinc-300 px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
        />
      </div>

      <div className="rounded-2xl border p-4 bg-white/70">
        <p className="text-sm text-zinc-600">Items: {items.length}</p>
        <p className="text-lg font-medium mt-1">Subtotal: ${subtotal.toFixed(2)}</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-brand-brown text-white rounded-xl px-6 py-3 shadow-soft disabled:opacity-70"
      >
        {submitting ? "Processing…" : "Proceed to Checkout"}
      </button>
    </form>
  );
}

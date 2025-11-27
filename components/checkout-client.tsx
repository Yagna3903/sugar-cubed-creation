// components/checkout-client.tsx
"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { z } from "zod";

export default function CheckoutClient() {
  const router = useRouter();
  const { items } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    // Validate inputs
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    const emailSchema = z.string().email("Please enter a valid email address.");
    const emailResult = emailSchema.safeParse(email.trim());

    if (!emailResult.success) {
      setError(emailResult.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    try {
      const params = new URLSearchParams({
        name: name.trim(),
        email: email.trim(),
      });
      router.push(`/checkout/payment?${params.toString()}`);
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl mx-auto px-4 py-10 space-y-6">
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
        <p className="text-lg font-medium mt-1">
          Subtotal: ${subtotal.toFixed(2)}
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-brand-brown text-white rounded-xl px-6 py-3 shadow-soft disabled:opacity-70"
      >
        {submitting ? "Continuing…" : "Continue to payment"}
      </button>

      <p className="mt-4 text-sm text-zinc-500">
        On the next step, you will enter your card details securely using
        Square.
      </p>
    </form>
  );
}

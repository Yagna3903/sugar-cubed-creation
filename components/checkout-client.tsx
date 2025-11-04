"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import {
  TokenResult,
  VerifyBuyerResponseDetails,
} from "@square/web-payments-sdk-types";

type OrderResponse = { orderId: string; checkoutUrl: string };

export default function CheckoutClient() {
  const router = useRouter();
  const { items, clear } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  // Read Square configuration from environment. Expose only the application ID
  // and location ID to the client (use NEXT_PUBLIC_ prefix). The secret access
  // token should remain server-only.
  const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID ?? "";
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? "";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!items.length) return setError("Your cart is empty.");
    if (!name.trim() || !email.trim())
      return setError("Please enter your name and email.");

    setSubmitting(true);
    try {
      // Navigate to local payment page where we will collect payment details
      // and finalize the order. Pass name/email as query params so the
      // payment page can prefill the form.
      const params = new URLSearchParams({
        name: name.trim(),
        email: email.trim(),
      });
      router.push(`/checkout/payment?${params.toString()}`);
      return;
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }
  // Always render the checkout summary with name/email and a button that
  // navigates to the dedicated payment page. The payment UI (Square SDK)
  // lives on /checkout/payment so tokenization happens on that route.
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
        {submitting ? "Processing…" : "Proceed to Payment"}
      </button>

      <p className="mt-4 text-sm text-zinc-500">
        After you click Proceed you'll be taken to the payment page where card
        details are collected securely.
      </p>
    </form>
  );
}

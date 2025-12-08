// components/checkout-client.tsx
"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { z } from "zod";
import { BackButton } from "@/components/ui/back-button";
import Image from "next/image";

export default function CheckoutClient() {
  const router = useRouter();
  const { items, discountAmount, promoCode } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = Math.max(0, subtotal - discountAmount);

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
    <div className="min-h-screen bg-gradient-to-b from-brand-cream/20 to-white py-12">
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-6">
          <BackButton href="/cart">Back to Cart</BackButton>
        </div>
        <div className="mb-8 text-center animate-slide-up">
          <h1 className="font-display text-4xl font-bold mb-2">Checkout</h1>
          <p className="text-zinc-600">
            Almost there! Just a few details to complete your order.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-soft p-8 animate-fade-in">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">
                  Full Name
                </label>
                <input
                  className="w-full rounded-xl border-2 border-zinc-100 px-4 py-3 focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/10 transition-all outline-none bg-zinc-50/50"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border-2 border-zinc-100 px-4 py-3 focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/10 transition-all outline-none bg-zinc-50/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="bg-brand-cream/30 rounded-2xl p-6 space-y-3 border border-brand-brown/5">
              <h3 className="font-display font-semibold text-lg mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-brand-brown/20">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-start">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-brand-brown/10">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-zinc-500">Qty: {item.qty}</p>
                    </div>
                    <div className="text-sm font-medium text-zinc-900">
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-brown/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-zinc-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Discount {promoCode ? `(${promoCode})` : ""}</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-brand-brown/10">
                  <span className="text-brand-brown">Total</span>
                  <span className="text-brand-brown">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-4 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                "Continue to Payment"
              )}
            </button>

            <p className="text-center text-xs text-zinc-400 mt-4">
              Secure checkout powered by Square
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

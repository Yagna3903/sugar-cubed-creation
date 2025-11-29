"use client";
export const dynamic = "force-dynamic";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { PaymentForm, CreditCard } from "react-square-web-payments-sdk";
import type { TokenResult } from "@square/web-payments-sdk-types";
import { useCart } from "@/lib/cart-store";
import { BackButton } from "@/components/ui/back-button";
import Image from "next/image";

type PaymentResponse = { orderId: string; paymentId: string; checkoutUrl: string };

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { items, clear } = useCart();

  const name = searchParams.get("name") ?? "";
  const email = searchParams.get("email") ?? "";

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.13;
  const total = subtotal + tax;

  const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID ?? "";
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? "";

  const isSquareConfigured = Boolean(applicationId && locationId);

  if (!items.length) {
    return (
      <section className="max-w-xl mx-auto px-4 py-10 space-y-4">
        <h1 className="text-2xl font-semibold">Payment</h1>
        <p className="text-sm text-zinc-600">
          Your cart is empty. Please add items before proceeding to payment.
        </p>
      </section>
    );
  }

  async function handleCardToken(tokenResult: TokenResult) {
    if (tokenResult.status !== "OK" || !tokenResult.token) {
      throw new Error("Card could not be tokenized.");
    }

    const cardDetails = tokenResult.details?.card;

    const payload = {
      customer: {
        name: name || "Guest",
        email: email || "",
      },
      items: items.map((i) => ({
        id: i.id,
        qty: i.qty,
      })),
      token: tokenResult.token,
      cardBrand: cardDetails?.brand,
      cardLast4: cardDetails?.last4,
    };

    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as
        | { error?: any }
        | null;
      const message =
        typeof data?.error === "string"
          ? data.error
          : data?.error?.message ||
          data?.error ||
          "Payment could not be created.";
      throw new Error(message);
    }

    const data = (await res.json()) as PaymentResponse;

    clear();
    router.push(data.checkoutUrl);
  }



  // ... existing imports ...

  // ... existing code ...

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-cream/20 to-white py-12">
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-6">
          <BackButton>Back</BackButton>
        </div>
        <div className="mb-8 text-center animate-slide-up">
          <h1 className="font-display text-4xl font-bold mb-2">Payment</h1>
          <p className="text-zinc-600">
            Securely complete your purchase
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-soft p-8 animate-fade-in">
          <div className="space-y-6">
            {/* Customer Info Summary */}
            <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Customer</span>
                </div>
                <div className="font-medium text-zinc-900">{name || "Guest"}</div>
                <div className="text-sm text-zinc-500">{email || "Not provided"}</div>
              </div>
              <button
                onClick={() => router.back()}
                className="text-sm font-medium text-brand-brown hover:underline self-start sm:self-center"
              >
                Edit
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-brand-cream/30 rounded-2xl p-6 space-y-3 border border-brand-brown/5">
              <h3 className="font-display font-semibold text-lg mb-4">Order Summary</h3>

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
                      <p className="text-sm font-medium text-zinc-900 truncate">{item.name}</p>
                      <p className="text-xs text-zinc-500">Qty: {item.qty}</p>
                    </div>
                    <div className="text-sm font-medium text-zinc-900">
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-brown/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Subtotal</span>
                  <span className="font-medium text-zinc-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">HST (13%)</span>
                  <span className="font-medium text-zinc-900">${tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold pt-4 border-t border-brand-brown/10 mt-2">
                <span className="text-brand-brown">Total</span>
                <span className="text-brand-brown">${total.toFixed(2)}</span>
              </div>
            </div>

            {!isSquareConfigured && (
              <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                Square is not configured. Please set NEXT_PUBLIC_SQUARE_APPLICATION_ID and NEXT_PUBLIC_SQUARE_LOCATION_ID in your environment.
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            {isSquareConfigured && (
              <div className="mt-8">
                <div className="bg-white rounded-2xl border border-zinc-100 shadow-lg overflow-hidden">
                  {/* Payment Header */}
                  <div className="bg-zinc-50/50 px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                    <h3 className="font-display font-semibold text-lg text-zinc-900">Payment Method</h3>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-10 bg-white border border-zinc-200 rounded flex items-center justify-center" title="Visa">
                        <span className="text-[10px] font-bold text-blue-800 italic">VISA</span>
                      </div>
                      <div className="h-6 w-10 bg-white border border-zinc-200 rounded flex items-center justify-center" title="Mastercard">
                        <div className="flex -space-x-1">
                          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        </div>
                      </div>
                      <div className="h-6 w-10 bg-white border border-zinc-200 rounded flex items-center justify-center" title="Amex">
                        <span className="text-[8px] font-bold text-blue-600">AMEX</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Body */}
                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">Card Information</label>
                      <div className="p-1 rounded-xl border border-zinc-200 shadow-sm focus-within:border-brand-brown focus-within:ring-4 focus-within:ring-brand-brown/10 transition-all bg-white">
                        <PaymentForm
                          applicationId={applicationId}
                          locationId={locationId}
                          cardTokenizeResponseReceived={async (tokenResult, _buyer) => {
                            if (submitting) return;

                            setError(null);
                            setSubmitting(true);
                            try {
                              await handleCardToken(tokenResult);
                            } catch (err: any) {
                              setError(
                                err?.message ||
                                "Something went wrong while processing your payment."
                              );
                            } finally {
                              setSubmitting(false);
                            }
                          }}
                        >
                          <CreditCard

                            buttonProps={{
                              css: {
                                backgroundColor: "#6b4226",
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#fff",
                                "&:hover": {
                                  backgroundColor: "#5a3720",
                                },
                                transition: "all 0.2s ease",
                                borderRadius: "0.75rem",
                                height: "3.5rem",
                                marginTop: "1.5rem",
                                boxShadow: "0 4px 6px -1px rgba(107, 66, 38, 0.2), 0 2px 4px -1px rgba(107, 66, 38, 0.1)",
                              },
                            }}
                          />
                        </PaymentForm>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 pt-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-green-500">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Payments are securely encrypted with 256-bit SSL</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading payment...</div>}>
      <PaymentContent />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import {
  PaymentForm,
  CreditCard as CreditCardInput,
  ApplePay,
} from "react-square-web-payments-sdk";
import {
  TokenResult,
  VerifyBuyerResponseDetails,
} from "@square/web-payments-sdk-types";

type OrderResponse = { orderId: string; checkoutUrl: string };

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const search = useSearchParams();
  const { items, clear } = useCart();

  const [name, setName] = useState(() => search.get("name") ?? "");
  const [email, setEmail] = useState(() => search.get("email") ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID ?? "";
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? "";

  async function onPay(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!items.length) return setError("Your cart is empty.");
    if (!name.trim() || !email.trim())
      return setError("Please enter your name and email.");

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

      const body: any = await res.json().catch(() => ({}));
      if (!res.ok || !body?.checkoutUrl)
        throw new Error(body?.error || "Checkout failed");

      const url = String(body.checkoutUrl);

      // Clear cart then redirect to checkout/success (or external checkout url)
      clear();
      // Prefer SPA replace then hard fallback
      router.replace(url);
      setTimeout(() => {
        if (typeof window !== "undefined" && window.location.href !== url) {
          window.location.href = url;
        }
      }, 200);
      return;
    } catch (err: any) {
      setError(err?.message || "Payment failed");
    } finally {
      setSubmitting(false);
    }
  }

  // If Square is configured show the CreditCard component from the SDK.
  // Otherwise fall back to the simple placeholder form.
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">Payment</h1>

      {applicationId && locationId ? (
        <div className="mt-6 space-y-6">
          <PaymentForm
            applicationId={applicationId}
            locationId={locationId}
            cardTokenizeResponseReceived={async (
              token: TokenResult | VerifyBuyerResponseDetails
            ) => {
              setError(null);
              setSubmitting(true);
              try {
                // Create pending order first (reuses your existing /api/orders)
                const orderRes = await fetch("/api/orders", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    customer: { name, email },
                    items: items.map((i) => ({ id: i.id, qty: i.qty })),
                  }),
                });

                const orderJson: any = await orderRes.json().catch(() => ({}));
                if (!orderRes.ok || !orderJson?.orderId) {
                  throw new Error(orderJson?.error || "Failed to create order");
                }

                const orderId = String(orderJson.orderId);

                // Extract token value from various possible shapes
                const anyToken = token as any;
                const sourceId =
                  anyToken?.token ||
                  anyToken?.id ||
                  anyToken?.nonce ||
                  anyToken?.paymentId;
                if (!sourceId)
                  throw new Error("No payment token received from Square");

                // Call server-side payment endpoint to charge the token
                const payRes = await fetch("/api/square/pay", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ sourceId, orderId }),
                });

                const payJson: any = await payRes.json().catch(() => ({}));
                if (!payRes.ok || !payJson?.success) {
                  throw new Error(payJson?.error || "Payment failed");
                }

                // Success: clear cart and redirect to success page without exposing PII in URL
                clear();
                const url = `/checkout/success?o=${encodeURIComponent(
                  orderId
                )}`;
                router.replace(url);
                setTimeout(() => {
                  if (
                    typeof window !== "undefined" &&
                    window.location.href !== url
                  )
                    window.location.href = url;
                }, 200);
              } catch (err: any) {
                setError(err?.message || "Payment failed");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <CreditCardInput />
          </PaymentForm>

          <div>
            <button
              onClick={(e) => onPay(e as unknown as React.FormEvent)}
              disabled={submitting}
              className="bg-brand-brown text-white rounded-xl px-6 py-3 shadow-soft disabled:opacity-70"
            >
              {submitting ? "Processing…" : "Pay / Finalize Order"}
            </button>
          </div>
          {/* <p className="text-sm text-zinc-500">
            The card component above collects card details securely via Square.
            Tokenization handler currently logs the token — next step is to
            exchange it server-side using your Square access token.
          </p> */}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-zinc-600">
            Square is not configured for this environment. To use the secure
            card input, set the following environment variables in your
            development environment or deployment:
          </p>
          <ul className="list-disc pl-6 text-sm text-zinc-700">
            <li>NEXT_PUBLIC_SQUARE_APPLICATION_ID</li>
            <li>NEXT_PUBLIC_SQUARE_LOCATION_ID</li>
          </ul>

          <p className="text-sm text-zinc-500">
            While those are not present you'll see this message. Once configured
            the secure <code>CreditCard</code> input will appear here.
          </p>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <button
              disabled
              className="bg-brand-brown text-white rounded-xl px-6 py-3 shadow-soft opacity-60"
            >
              Pay / Finalize Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

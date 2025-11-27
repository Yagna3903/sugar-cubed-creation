"use client";
export const dynamic = "force-dynamic";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { PaymentForm, CreditCard } from "react-square-web-payments-sdk";
import type { TokenResult } from "@square/web-payments-sdk-types";
import { useCart } from "@/lib/cart-store";

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

  return (
    <section className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Payment</h1>

      <div className="space-y-1 text-sm">
        <div>
          <span className="font-medium">Name:</span> {name || "Guest"}
        </div>
        <div>
          <span className="font-medium">Email:</span> {email || "Not provided"}
        </div>
        <div className="mt-2 text-lg font-medium">
          Subtotal: ${subtotal.toFixed(2)}
        </div>
      </div>

      {!isSquareConfigured && (
        <p className="text-sm text-red-600">
          Square is not configured. Please set{" "}
          <code>NEXT_PUBLIC_SQUARE_APPLICATION_ID</code> and{" "}
          <code>NEXT_PUBLIC_SQUARE_LOCATION_ID</code> in your environment.
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {isSquareConfigured && (
        <div className="rounded-2xl border bg-white p-4">
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
            <CreditCard />
          </PaymentForm>
        </div>
      )}

      <p className="text-xs text-zinc-500">
        Card details are securely handled by Square&apos;s Web Payments SDK.
      </p>
    </section>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading payment...</div>}>
      <PaymentContent />
    </Suspense>
  );
}

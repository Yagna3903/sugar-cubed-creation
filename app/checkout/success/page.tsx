// app/checkout/success/page.tsx
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Confetti } from "@/components/confetti";
import SendReceiptClient from "./send-receipt-client";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { o?: string };
}) {
  const orderId = searchParams?.o ?? "";

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-cream/20 to-white py-20 px-4">
        <div className="mx-auto max-w-md text-center">
          <div className="bg-white rounded-3xl shadow-soft p-8 animate-fade-in">
            <h1 className="font-display text-2xl font-bold text-zinc-900">
              No order reference
            </h1>
            <p className="mt-2 text-zinc-600">
              We couldn’t find your order reference.
            </p>
            <Link
              href="/shop"
              className="mt-6 w-full inline-block rounded-xl bg-brand-brown px-6 py-3 text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              Return to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-cream/20 to-white py-20 px-4">
        <div className="mx-auto max-w-md text-center">
          <div className="bg-white rounded-3xl shadow-soft p-8 animate-fade-in">
            <h1 className="font-display text-2xl font-bold text-zinc-900">
              Order not found
            </h1>
            <p className="mt-2 text-zinc-600">
              Your order may have expired or the link is invalid.
            </p>
            <Link
              href="/shop"
              className="mt-6 w-full inline-block rounded-xl bg-brand-brown px-6 py-3 text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              Return to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const total = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(order.totalCents / 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-cream/20 to-white py-20 px-4">
      {/* Trigger email send (mark paid) on client-side */}
      <SendReceiptClient orderId={order.id} />
      <Confetti />

      <div className="mx-auto max-w-2xl text-center animate-slide-up">
        <div className="mx-auto mb-8 grid h-20 w-20 place-items-center rounded-full bg-green-100 shadow-sm animate-bounce-subtle">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 7L9 18l-5-5"
              stroke="#16a34a"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="font-display text-4xl font-bold text-zinc-900 mb-4">
          Order Confirmed!
        </h1>
        <p className="text-lg text-zinc-600 mb-8">
          Thanks{order.customerName ? `, ${order.customerName}` : ""}! We’ve
          emailed your receipt to{" "}
          <span className="font-medium text-zinc-900">
            {order.email ?? "your email"}
          </span>
          .
        </p>

        <div className="bg-white rounded-3xl shadow-soft p-8 text-left border border-zinc-100 relative overflow-hidden mb-8">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-brown/20 via-brand-brown to-brand-brown/20"></div>

          <div className="space-y-1 mb-6">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Order Reference
            </div>
            <div className="font-mono text-lg text-zinc-900 break-all">
              {order.id}
            </div>
          </div>

          {/* Purchased Items Grid */}
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Purchased Items
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100"
                >
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white border border-zinc-200">
                    {item.product.imageUrl ? (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-zinc-100" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-zinc-500">Qty: {item.qty}</p>
                  </div>
                  <div className="text-sm font-medium text-zinc-900">
                    ${((item.unitPriceCents * item.qty) / 100).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-100 flex justify-between items-end">
            <div className="text-sm text-zinc-500">Total Amount</div>
            <div className="text-2xl font-bold text-brand-brown">{total}</div>
          </div>
        </div>

        <Link
          href="/shop"
          className="w-full sm:w-auto inline-block rounded-xl bg-brand-brown px-8 py-4 text-lg text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

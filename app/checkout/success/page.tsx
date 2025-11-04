// app/checkout/success/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { o?: string };
}) {
  const orderId = searchParams?.o ?? "";
  if (!orderId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">No order reference</h1>
        <p className="mt-2 text-zinc-700">
          We couldn’t find your order reference.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-xl bg-brand-brown px-6 py-3 text-white shadow-soft"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Order not found</h1>
        <p className="mt-2 text-zinc-700">
          Your order may have expired or the link is invalid.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-xl bg-brand-brown px-6 py-3 text-white shadow-soft"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  const total = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(order.totalCents / 100);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-green-100">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 7L9 18l-5-5"
            stroke="#16a34a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-semibold">Order confirmed</h1>
      <p className="mt-2 text-zinc-700">
        Thanks{order.customerName ? `, ${order.customerName}` : ""}! We’ve
        emailed your receipt to <strong>{order.email ?? "your email"}</strong>.
      </p>

      <div className="mx-auto mt-8 w-full max-w-lg rounded-2xl border bg-white/70 p-5 text-left shadow-soft">
        <div className="text-sm text-zinc-500">Order ID</div>
        <div className="mt-1 font-mono break-all">{order.id}</div>
        <div className="mt-4 text-lg font-medium">
          Total: <span className="font-semibold">{total}</span>
        </div>
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

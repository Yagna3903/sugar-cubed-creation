export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BackLink from "@/app/admin/_components/BackLink";
import { prisma } from "@/lib/db";
import { setOrderStatus, archiveOrder, deleteOrder, resendOrderEmail } from "../actions";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const o = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: { product: { select: { name: true, priceCents: true, imageUrl: true } } },
      },
    },
  });
  if (!o) return notFound();

  type ItemRow = (typeof o)["items"][number];

  // Helper for status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-50 text-green-700 border-green-100";
      case "fulfilled": return "bg-blue-50 text-blue-700 border-blue-100";
      case "cancelled": return "bg-red-50 text-red-700 border-red-100";
      default: return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6">
      <BackLink href="/admin/orders">Back to Orders</BackLink>

      {/* Header */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-brown">Order #{o.id.slice(0, 8)}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(o.status)}`}>
              {o.status}
            </span>
          </div>
          <p className="text-zinc-500 text-sm">
            Placed on {new Date(o.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(o.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          {/* Archive/Delete if cancelled */}
          {o.status === "cancelled" && (
            <>
              <form
                action={async () => {
                  "use server";
                  await archiveOrder(o.id);
                  redirect("/admin/orders");
                }}
              >
                <button className="px-4 py-2 rounded-xl border border-zinc-200 text-zinc-600 font-medium hover:bg-zinc-50 transition-colors text-sm">
                  Archive
                </button>
              </form>
              <form
                action={async () => {
                  "use server";
                  await deleteOrder(o.id);
                  redirect("/admin/orders");
                }}
              >
                <button className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors text-sm">
                  Delete
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items List */}
          <div className="bg-white rounded-3xl border border-brand-brown/5 shadow-soft overflow-hidden">
            <div className="px-4 md:px-6 py-4 border-b border-brand-brown/5 bg-brand-cream/30 flex justify-between items-center">
              <h2 className="font-display font-bold text-lg text-brand-brown">Order Items</h2>
              <span className="text-sm text-zinc-500">{o.items.length} items</span>
            </div>
            <div className="divide-y divide-brand-brown/5">
              {o.items.map((it: ItemRow) => (
                <div key={it.id} className="p-4 md:p-6 flex items-start md:items-center gap-4 hover:bg-brand-cream/10 transition-colors">
                  <div className="h-16 w-16 shrink-0 rounded-xl border border-brand-brown/10 overflow-hidden bg-zinc-50">
                    <Image
                      src={it.product?.imageUrl || "/images/Main-Cookie.png"}
                      alt={it.product?.name || "Product"}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-brand-brown truncate text-sm md:text-base">{it.product?.name ?? "Product"}</h3>
                    <p className="text-sm text-zinc-500">
                      ${(it.unitPriceCents / 100).toFixed(2)} × {it.qty}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-brand-brown text-sm md:text-base">
                      ${((it.unitPriceCents * it.qty) / 100).toFixed(2)}
                    </div>
                    <Link
                      href={`/admin/products/${it.productId}`}
                      className="text-xs text-brand-brown/60 hover:text-brand-brown hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-brand-cream/10 px-4 md:px-6 py-4 border-t border-brand-brown/5">
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 font-medium">Total Amount</span>
                <span className="text-xl md:text-2xl font-display font-bold text-brand-brown">${(o.totalCents / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white rounded-3xl border border-brand-brown/5 shadow-soft p-4 md:p-6">
            <h2 className="font-display font-bold text-lg text-brand-brown mb-4">Customer Details</h2>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-brand-brown/5 flex items-center justify-center text-brand-brown shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="space-y-1 overflow-hidden">
                <div className="font-medium text-zinc-900 truncate">{o.customerName || "Guest Customer"}</div>
                <div className="text-zinc-500 flex items-center gap-2 text-sm truncate">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{o.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="bg-white rounded-3xl border border-brand-brown/5 shadow-soft p-4 md:p-6">
            <h2 className="font-display font-bold text-lg text-brand-brown mb-4">Order Status</h2>
            <form action={setOrderStatus.bind(null, o.id)}>
              <div className="space-y-4">
                <div className="relative">
                  <select
                    name="status"
                    defaultValue={o.status}
                    className="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/5 outline-none transition-all"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <button className="w-full rounded-xl bg-brand-brown px-4 py-3 text-sm font-bold text-white shadow-lg shadow-brand-brown/20 hover:bg-brand-brown-dark hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                  Update Status
                </button>
              </div>
            </form>
          </div>

          {/* Email Actions */}
          <div className="bg-white rounded-3xl border border-brand-brown/5 shadow-soft p-4 md:p-6">
            <h2 className="font-display font-bold text-lg text-brand-brown mb-4">Communication</h2>
            <form
              action={async () => {
                "use server";
                await resendOrderEmail(o.id);
              }}
            >
              <button className="w-full group relative overflow-hidden rounded-xl border border-brand-brown/10 bg-brand-cream/30 px-4 py-3 text-sm font-bold text-brand-brown hover:bg-brand-cream/50 transition-all">
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Resend Confirmation
                </div>
              </button>
              <p className="mt-3 text-xs text-center text-zinc-500">
                Send a copy of the order confirmation email to the customer.
              </p>
            </form>
          </div>

          {/* Timeline/Meta */}
          <div className="bg-zinc-50 rounded-3xl border border-zinc-100 p-4 md:p-6">
            <h3 className="font-bold text-zinc-900 text-sm mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-brand-brown"></div>
                  <div className="w-0.5 h-full bg-brand-brown/10 my-1"></div>
                </div>
                <div className="pb-4">
                  <div className="text-xs font-medium text-zinc-900">Order Placed</div>
                  <div className="text-xs text-zinc-500">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
                </div>
                <div>
                  <div className="text-xs font-medium text-zinc-900">Last Updated</div>
                  <div className="text-xs text-zinc-500">{new Date(o.updatedAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

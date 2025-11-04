export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BackLink from "@/app/admin/_components/BackLink";
import { prisma } from "@/lib/db";
import { setOrderStatus, archiveOrder, deleteOrder } from "../actions";

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

  return (
    <div className="mx-auto max-w-4xl">
      <BackLink href="/admin/orders">Back to Orders</BackLink>
      <h1 className="mt-3 text-2xl font-semibold">Order #{o.id.slice(0, 8)}</h1>

      {/* Top meta */}
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4">
          <div className="text-xs text-zinc-500">Customer</div>
          <div className="mt-1 font-medium">{o.customerName || "—"}</div>
          <div className="text-sm text-zinc-600">{o.email}</div>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <div className="text-xs text-zinc-500">Placed</div>
          <div className="mt-1 font-medium">{new Date(o.createdAt).toLocaleString()}</div>
          <div className="text-sm text-zinc-600">Updated {new Date(o.updatedAt).toLocaleString()}</div>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <div className="text-xs text-zinc-500">Total</div>
          <div className="mt-1 text-lg font-semibold">${(o.totalCents / 100).toFixed(2)}</div>

          {/* Status selector */}
          <form action={setOrderStatus.bind(null, o.id)} className="mt-3">
            <label className="text-xs text-zinc-500">Status</label>
            <select
              name="status"
              defaultValue={o.status}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="mt-2 rounded-xl bg-brand-brown px-3 py-1.5 text-sm text-white">
              Update status
            </button>
          </form>

          {/* Archive/Delete if cancelled */}
          {o.status === "cancelled" && (
            <div className="mt-3 flex gap-2">
              <form
                action={async () => {
                  "use server";
                  await archiveOrder(o.id);
                  redirect("/admin/orders"); // ✅ bounce back after archive
                }}
              >
                <button className="rounded-xl border px-3 py-1.5 text-sm">
                  Archive
                </button>
              </form>
              <form
                action={async () => {
                  "use server";
                  await deleteOrder(o.id);
                  redirect("/admin/orders"); // ✅ bounce back after delete
                }}
              >
                <button className="rounded-xl border px-3 py-1.5 text-sm text-red-600">
                  Delete permanently
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <div className="border-b p-4 font-medium">Items</div>
        <div className="divide-y">
          {o.items.map((it: ItemRow) => (
            <div key={it.id} className="grid grid-cols-12 items-center gap-4 p-4">
              <div className="col-span-6 flex items-center gap-3">
                <Image
                  src={it.product?.imageUrl || "/images/Main-Cookie.png"}
                  alt={it.product?.name || "Product"}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded object-cover border"
                />
                <div>
                  <div className="font-medium">{it.product?.name ?? "Product"}</div>
                  <div className="text-xs text-zinc-500">
                    Unit ${(it.unitPriceCents / 100).toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="col-span-2 text-sm">Qty {it.qty}</div>
              <div className="col-span-2 text-sm">
                ${((it.unitPriceCents * it.qty) / 100).toFixed(2)}
              </div>
              <div className="col-span-2 text-right">
                <Link
                  href={`/admin/products/${it.productId}`}
                  className="text-xs text-zinc-600 hover:underline"
                >
                  View product
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

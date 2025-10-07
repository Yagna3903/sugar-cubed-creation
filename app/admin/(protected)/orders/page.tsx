export const dynamic = "force-dynamic";
import Link from "next/link";
import BackLink from "@/app/admin/_components/BackLink";
import { prisma } from "@/lib/db";
import { cancelOrder, markFulfilled, markPaid } from "./actions";

type PageProps = { searchParams?: { status?: string } };
type AdminStatus = "all" | "pending" | "paid" | "fulfilled" | "cancelled" | "archived";

const STATUS_LABEL: Record<Exclude<AdminStatus, "all">, string> = {
  pending: "Pending",
  paid: "Paid",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
  archived: "Archived",
};

function statusBadgeClass(s: Exclude<AdminStatus, "all">) {
  switch (s) {
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "paid":
      return "bg-blue-100 text-blue-800";
    case "fulfilled":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "archived":
      return "bg-zinc-200 text-zinc-700";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const raw = (searchParams?.status || "pending").toLowerCase();
  const status: AdminStatus =
    raw === "all" || raw === "paid" || raw === "fulfilled" || raw === "cancelled" || raw === "archived"
      ? (raw as AdminStatus)
      : "pending";

  // 👇 Build query depending on status
  const where =
    status === "all"
      ? {}
      : status === "archived"
      ? { archived: true }
      : { status, archived: false };

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: { select: { name: true } } },
      },
    },
  });

  type OrderRow = (typeof orders)[number];
  type ItemRow = OrderRow["items"][number];

  const FilterPill = ({ label, href, active }: { label: string; href: string; active: boolean }) => (
    <Link
      href={href}
      className={[
        "rounded-full border px-3 py-1.5 text-sm transition",
        active ? "bg-zinc-900 text-white border-zinc-900" : "bg-white hover:bg-zinc-50",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );

  return (
    <div>
      <BackLink href="/admin">Back to Admin</BackLink>

      <div className="mb-4 mt-3 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Orders</h1>

        <nav className="flex items-center gap-2" aria-label="Filter orders">
          <FilterPill href="/admin/orders?status=all" label="All" active={status === "all"} />
          <FilterPill href="/admin/orders?status=pending" label="Pending" active={status === "pending"} />
          <FilterPill href="/admin/orders?status=paid" label="Paid" active={status === "paid"} />
          <FilterPill href="/admin/orders?status=fulfilled" label="Fulfilled" active={status === "fulfilled"} />
          <FilterPill href="/admin/orders?status=cancelled" label="Cancelled" active={status === "cancelled"} />
          <FilterPill href="/admin/orders?status=archived" label="Archived" active={status === "archived"} />
        </nav>
      </div>

      {orders.length === 0 ? (
        <p className="text-zinc-600">No orders.</p>
      ) : (
        <div className="divide-y rounded-2xl border bg-white">
          {orders.map((o: OrderRow) => (
            <div key={o.id} className="grid grid-cols-12 items-center gap-4 p-4">
              <div className="col-span-6">
                <div className="flex items-center gap-2">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium hover:underline">
                    {o.customerName || o.email}
                  </Link>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(o.status as any)}`}>
                    {o.archived ? "Archived" : STATUS_LABEL[o.status as Exclude<AdminStatus, "all">]}
                  </span>
                </div>
                <div className="text-xs text-zinc-500">
                  #{o.id.slice(0, 8)} • {new Date(o.createdAt).toLocaleString()} •{" "}
                  {o.items.length} item{o.items.length === 1 ? "" : "s"}
                </div>
                {o.items.length > 0 && (
                  <div className="mt-1 line-clamp-1 text-xs text-zinc-600">
                    {o.items.map((it: ItemRow) => `${it.qty}× ${it.product?.name ?? "Item"}`).join(" · ")}
                  </div>
                )}
              </div>

              <div className="col-span-2 text-sm">${(o.totalCents / 100).toFixed(2)}</div>

              <div className="col-span-4 flex justify-end gap-2">
                <Link href={`/admin/orders/${o.id}`} className="rounded-xl border px-3 py-1.5 text-sm">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

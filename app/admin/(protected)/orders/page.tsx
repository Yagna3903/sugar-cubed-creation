export const dynamic = "force-dynamic";

import Link from "next/link";
import BackLink from "@/app/admin/_components/BackLink";
import StatusBadge from "@/app/admin/_components/StatusBadge";
import EmptyState from "@/app/admin/_components/EmptyState";
import { prisma } from "@/lib/db";

type PageProps = { searchParams?: { status?: string } };
type AdminStatus =
  | "all"
  | "pending"
  | "paid"
  | "fulfilled"
  | "cancelled"
  | "archived"
  | "refunded";

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const raw = (searchParams?.status || "pending").toLowerCase();
  const status: AdminStatus =
    raw === "all" ||
      raw === "paid" ||
      raw === "fulfilled" ||
      raw === "cancelled" ||
      raw === "refunded" ||
      raw === "archived"
      ? (raw as AdminStatus)
      : "pending";

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

  const FilterPill = ({
    label,
    href,
    active,
    count,
  }: {
    label: string;
    href: string;
    active: boolean;
    count?: number;
  }) => (
    <Link
      href={href}
      className={[
        "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2",
        active
          ? "bg-brand-brown text-white border-brand-brown shadow-sm"
          : "bg-white hover:bg-zinc-50 border-zinc-200 hover:border-zinc-300",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${active ? "bg-white/20" : "bg-zinc-100 text-zinc-700"
            }`}
        >
          {count}
        </span>
      )}
    </Link>
  );

  // Get counts for each status
  const pendingCount = await prisma.order.count({
    where: { status: "pending", archived: false },
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <BackLink href="/admin">Back to Admin</BackLink>

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-zinc-900">Orders</h1>
        <p className="text-zinc-600 mt-1">
          Manage customer orders and fulfillment
        </p>
      </div>

      {/* Filters */}
      <nav className="flex flex-wrap items-center gap-3" aria-label="Filter orders">
        <FilterPill
          href="/admin/orders?status=all"
          label="All"
          active={status === "all"}
        />
        <FilterPill
          href="/admin/orders?status=pending"
          label="Pending"
          active={status === "pending"}
          count={status === "pending" ? undefined : pendingCount}
        />
        <FilterPill
          href="/admin/orders?status=paid"
          label="Paid"
          active={status === "paid"}
        />
        <FilterPill
          href="/admin/orders?status=fulfilled"
          label="Fulfilled"
          active={status === "fulfilled"}
        />
        <FilterPill
          href="/admin/orders?status=cancelled"
          label="Cancelled"
          active={status === "cancelled"}
        />
        <FilterPill
          href="/admin/orders?status=archived"
          label="Archived"
          active={status === "archived"}
        />
        <FilterPill
          href="/admin/orders?status=refunded"
          label="Refunded"
          active={status === "refunded"}
        />
      </nav>

      {/* Orders List */}
      {orders.length === 0 ? (
        <EmptyState
          icon="🧾"
          title={`No ${status === "all" ? "" : status} orders`}
          description={
            status === "pending"
              ? "All caught up! No pending orders right now."
              : `You don't have any ${status === "all" ? "" : status} orders.`
          }
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-soft border border-zinc-100 overflow-hidden">
          {orders.map((o: OrderRow, index) => {
            // Get initials for avatar
            const customerName = o.customerName || o.email || "?";
            const initials = customerName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={o.id}
                className={`p-4 hover:bg-zinc-50 transition-colors duration-150 ${index !== orders.length - 1 ? "border-b border-zinc-100" : ""
                  }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Customer Avatar & Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-cream to-brand-pink text-brand-brown text-sm font-semibold shadow-sm flex-shrink-0">
                      {initials}
                    </div>

                    {/* Customer & Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="font-semibold text-zinc-900 hover:text-brand-brown transition-colors truncate"
                        >
                          {o.customerName || o.email}
                        </Link>
                        <StatusBadge
                          status={
                            o.archived
                              ? "archived"
                              : (o.status as "pending" | "paid" | "fulfilled" | "cancelled" | "refunded")
                          }
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                        <span>#{o.id.slice(0, 8)}</span>
                        <span>•</span>
                        <span>{new Date(o.createdAt).toLocaleString()}</span>
                        <span>•</span>
                        <span>
                          {o.items.length} item{o.items.length === 1 ? "" : "s"}
                        </span>
                      </div>

                      {/* Order Items Preview */}
                      {o.items.length > 0 && (
                        <div className="mt-2 text-xs text-zinc-600 truncate">
                          {o.items
                            .slice(0, 3)
                            .map(
                              (it: ItemRow) =>
                                `${it.qty}× ${it.product?.name ?? "Item"}`
                            )
                            .join(" • ")}
                          {o.items.length > 3 && ` • +${o.items.length - 3} more`}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Value */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-zinc-900">
                      ${(o.totalCents / 100).toFixed(2)}
                    </p>
                  </div>

                  {/* View Button */}
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 hover:border-zinc-400 transition-all duration-150 flex-shrink-0"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
        "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 border",
        active
          ? "bg-brand-brown text-white border-brand-brown shadow-md scale-105"
          : "bg-white text-zinc-600 border-zinc-200 hover:border-brand-brown/30 hover:bg-brand-brown/5 hover:text-brand-brown",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${active ? "bg-white/20 text-white" : "bg-brand-brown/10 text-brand-brown"
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
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8 animate-fadeIn">
      <BackLink href="/admin" />

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-zinc-900">Orders</h1>
        <p className="text-zinc-600 mt-1">
          Manage customer orders and fulfillment
        </p>
      </div>

      {/* Filters */}
      <nav className="flex flex-wrap items-center gap-2" aria-label="Filter orders">
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
          href="/admin/orders?status=cancelled"
          label="Cancelled"
          active={status === "cancelled"}
        />
        <FilterPill
          href="/admin/orders?status=refunded"
          label="Refunded"
          active={status === "refunded"}
        />
      </nav>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl shadow-soft border border-zinc-100">
          <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🧾</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-1">
            {status === "all" ? "No orders yet" : `No ${status} orders`}
          </h3>
          <p className="text-zinc-500 text-center max-w-sm">
            {status === "pending"
              ? "All caught up! No pending orders right now."
              : `You don't have any ${status === "all" ? "" : status} orders at the moment.`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-soft border border-zinc-100 overflow-hidden">
          <div className="divide-y divide-zinc-50">
            {orders.map((o: OrderRow) => {
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
                  className="p-6 hover:bg-zinc-50/50 transition-colors duration-200 group"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {/* Customer Avatar */}
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-cream to-brand-pink text-brand-brown font-bold shadow-sm border border-white ring-1 ring-brand-brown/5">
                        {initials}
                      </div>
                    </div>

                    {/* Order Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="font-bold text-lg text-zinc-900 hover:text-brand-brown transition-colors truncate"
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

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
                        <span className="font-mono text-xs bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600">
                          #{o.id.slice(0, 8)}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          {o.items.length} item{o.items.length === 1 ? "" : "s"}
                        </span>
                      </div>

                      {/* Order Items Preview */}
                      {o.items.length > 0 && (
                        <div className="pt-2 text-sm text-zinc-600 truncate opacity-80 group-hover:opacity-100 transition-opacity">
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

                    {/* Order Value & Action */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-2 w-full sm:w-auto justify-between sm:justify-start mt-2 sm:mt-0 pl-16 sm:pl-0">
                      <div className="text-right">
                        <p className="text-xl font-bold text-zinc-900">
                          ${(o.totalCents / 100).toFixed(2)}
                        </p>
                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wide">Total</p>
                      </div>

                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:border-brand-brown/30 hover:text-brand-brown transition-all shadow-sm active:scale-95"
                      >
                        View Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

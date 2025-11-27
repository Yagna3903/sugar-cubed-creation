// app/admin/(protected)/page.tsx

export const dynamic = "force-dynamic";
import Link from "next/link";
import BackLink from "../_components/BackLink";
import StatsCard from "../_components/StatsCard";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/server/admin";

export default async function AdminHome() {
  // Enforce Supabase authentication (throws/redirects if not allowed)
  const user = await requireAdmin();
  const name = (user.user_metadata?.name as string | undefined) ?? "Admin";
  const email = user.email ?? "";

  // Stats for dashboard cards
  const [activeCount, archivedCount, pendingOrders, totalOrders, recentOrders] =
    await Promise.all([
      prisma.product.count({ where: { active: true } }),
      prisma.product.count({ where: { active: false } }),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: { select: { name: true } },
            },
          },
        },
      }),
    ]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <BackLink href="/">Back to site</BackLink>

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-brown via-brand-brown/90 to-brand-brown/80 p-8 text-white shadow-strong">
        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

        <div className="relative">
          <h1 className="font-display text-3xl font-bold mb-2">
            Welcome back, {name}! 👋
          </h1>
          <p className="text-brand-cream/90 mb-6">
            {email && <>Signed in as {email}. </>}
            Here&apos;s your store overview for today.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/products/new"
              className="rounded-xl bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium hover:bg-white/30 transition-all duration-200 border border-white/20"
            >
              + New Product
            </Link>
            <Link
              href="/admin/orders"
              className="rounded-xl bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium hover:bg-white/30 transition-all duration-200 border border-white/20"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="font-display text-xl font-semibold mb-4 text-zinc-900">
          Overview
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/products" className="block">
            <StatsCard
              title="Products"
              value={activeCount}
              icon="🍪"
              subtitle={`${archivedCount} archived`}
            />
          </Link>
          <Link href="/admin/orders?status=pending" className="block">
            <StatsCard
              title="Pending Orders"
              value={pendingOrders}
              icon="⏳"
              subtitle={pendingOrders > 0 ? "Needs attention" : "All caught up!"}
            />
          </Link>
          <Link href="/admin/orders" className="block">
            <StatsCard
              title="Total Orders"
              value={totalOrders}
              icon="🧾"
              subtitle="All time"
            />
          </Link>
          <Link href="/admin/payments" className="block">
            <StatsCard
              title="Payments"
              value="View"
              icon="💰"
              subtitle="Payment records"
            />
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-zinc-900">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm text-brand-brown hover:underline font-medium"
            >
              View all →
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-zinc-100 divide-y">
            {recentOrders.map((order) => {
              const statusColors: Record<string, string> = {
                pending: "bg-amber-100 text-amber-800",
                paid: "bg-blue-100 text-blue-800",
                fulfilled: "bg-green-100 text-green-800",
                cancelled: "bg-red-100 text-red-700",
              };

              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors duration-150"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-zinc-900 truncate">
                        {order.customerName || order.email}
                      </p>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] || "bg-zinc-100 text-zinc-700"
                          }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString()} •{" "}
                      {order.items.length} item{order.items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-zinc-900">
                      ${(order.totalCents / 100).toFixed(2)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Links Grid */}
      <div>
        <h2 className="font-display text-xl font-semibold mb-4 text-zinc-900">
          Manage
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/inquiries"
            className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 text-2xl">
                💼
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold mb-1">Inquiries</h3>
                <p className="text-zinc-600">Here&apos;s what&apos;s happening with your store today.</p>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            href="/admin/faq"
            className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 text-2xl">
                ❓
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold mb-1">FAQ</h3>
                <p className="text-sm text-zinc-600">
                  Manage frequently asked questions
                </p>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            href="/admin/test-email"
            className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 text-2xl">
                ✉️
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold mb-1">Test Email</h3>
                <p className="text-sm text-zinc-600">
                  Send test emails for debugging
                </p>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// app/admin/(protected)/page.tsx

export const dynamic = "force-dynamic";
import Link from "next/link";
import BackLink from "../_components/BackLink";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/server/admin";

export default async function AdminHome() {
  // Enforce Supabase authentication (throws/redirects if not allowed)
  const user = await requireAdmin();
  const name = (user.user_metadata?.name as string | undefined) ?? "Admin";
  const email = user.email ?? "";

  // Stats for dashboard cards
  const [activeCount, archivedCount, pendingOrders, totalOrders] =
    await Promise.all([
      prisma.product.count({ where: { active: true } }),
      prisma.product.count({ where: { active: false } }),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.count(),
    ]);

  const cards = [
    {
      href: "/admin/products",
      title: "Products",
      desc: "Create, edit, toggle visibility, and manage stock.",
      stat: `${activeCount} active • ${archivedCount} archived`,
      emoji: "🍪",
    },
    {
      href: "/admin/orders",
      title: "Orders",
      desc: "Review, update status, and see recent activity.",
      stat:
        pendingOrders > 0 ? `${pendingOrders} pending` : `${totalOrders} total`,
      emoji: "🧾",
    },
    {
      href: "/admin/faq",
      title: "FAQ",
      desc: "Keep store FAQs up to date for customers.",
      stat: "Manage entries",
      emoji: "❓",
    },
    {
      href: "/admin/payments",
      title: "Payments",
      desc: "View recent payments and their statuses.",
      stat: "View records",
      emoji: "💰",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <BackLink href="/">Back to site</BackLink>

      <div>
        <h1 className="text-2xl font-semibold">Welcome, {name}</h1>
        <p className="mt-2 text-zinc-600">
          {email && <>Signed in as {email}. </>}
          Use the options below to manage products, orders, and FAQs.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-brown/40"
          >
            <div className="flex items-start gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-2xl"
                aria-hidden
              >
                {c.emoji}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-lg font-semibold">{c.title}</h2>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">
                    {c.stat}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                  {c.desc}
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  );
}

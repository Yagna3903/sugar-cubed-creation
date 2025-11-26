// app/admin/(protected)/payments/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import BackLink from "@/app/admin/_components/BackLink";
import { prisma } from "@/lib/db";
import {
  capturePayment,
  cancelPayment,
  refundPayment,
} from "./actions";

function statusBadgeClass(status: string) {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "refunded":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
}

export default async function AdminPaymentsPage() {
  // Auto-cancel any payment that has been pending for more than 7 days
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  await prisma.payment.updateMany({
    where: {
      status: "pending",
      createdAt: { lt: sevenDaysAgo },
    },
    data: { status: "cancelled" },
  });

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      order: {
        select: {
          id: true,
          email: true,
          customerName: true,
        },
      },
    },
  });

  return (
    <div>
      <BackLink href="/admin">Back to Admin</BackLink>
      <h1 className="mt-3 mb-4 text-2xl font-semibold">Payments</h1>

      {payments.length === 0 ? (
        <p className="text-zinc-600">No payments yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-zinc-50 text-xs uppercase text-zinc-500">
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Provider ID</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-left">Currency</th>
                <th className="px-4 py-3 text-left">Card</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const createdAt = new Date(p.createdAt);
                const expiresAt = new Date(
                  createdAt.getTime() + 7 * 24 * 60 * 60 * 1000
                );
                const isPending = p.status === "pending";
                const isCompleted = p.status === "completed";
                const isRefunded = p.status === "refunded";

                const expiresLabel = expiresAt.toLocaleString();

                // Nicely truncated provider ID for the table
                let providerDisplay: string | null = null;
                if (p.providerPaymentId) {
                  if (p.providerPaymentId.length <= 16) {
                    providerDisplay = p.providerPaymentId;
                  } else {
                    providerDisplay =
                      p.providerPaymentId.slice(0, 8) +
                      "…" +
                      p.providerPaymentId.slice(-4);
                  }
                }

                return (
                  <tr key={p.id} className="border-b last:border-b-0">
                    {/* Order */}
                    <td className="px-4 py-3 align-top">
                      <div className="text-sm">
                        {p.order?.customerName || p.order?.email || "—"}
                      </div>
                      {p.order && (
                        <div className="text-xs text-zinc-500">
                          <Link
                            href={`/admin/orders/${p.order.id}`}
                            className="underline"
                          >
                            {p.order.id}
                          </Link>
                        </div>
                      )}
                    </td>

                    {/* Provider ID (truncated, full in title) */}
                    <td className="px-4 py-3 align-top font-mono text-xs">
                      {providerDisplay ? (
                        <span title={p.providerPaymentId ?? undefined}>
                          {providerDisplay}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* Status + 7-day note */}
                    <td className="px-4 py-3 align-top">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(
                          p.status
                        )}`}
                      >
                        {p.status}
                      </span>
                      {isPending && (
                        <div className="mt-1 text-[11px] text-zinc-500">
                          If not accepted by{" "}
                          <span className="font-medium">{expiresLabel}</span>,{" "}
                          this payment will be cancelled automatically.
                        </div>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3 align-top text-right">
                      ${(p.amountCents / 100).toFixed(2)}
                    </td>

                    {/* Currency */}
                    <td className="px-4 py-3 align-top">{p.currency}</td>

                    {/* Card */}
                    <td className="px-4 py-3 align-top">
                      {p.cardBrand && p.cardLast4
                        ? `${p.cardBrand.toUpperCase()} •${p.cardLast4}`
                        : "—"}
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3 align-top text-xs text-zinc-500">
                      {createdAt.toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col gap-2">
                        {isPending && (
                          <>
                            {/* Softer green Accept button */}
                            <form action={capturePayment.bind(null, p.id)}>
                              <button className="w-full rounded-xl bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700">
                                Accept
                              </button>
                            </form>
                            <form action={cancelPayment.bind(null, p.id)}>
                              <button className="w-full rounded-xl bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700">
                                Cancel
                              </button>
                            </form>
                          </>
                        )}

                        {isCompleted && !isRefunded && (
                          <form action={refundPayment.bind(null, p.id)}>
                            <button className="w-full rounded-xl bg-pink-500 px-3 py-1.5 text-xs font-medium text-white">
                              Refund
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

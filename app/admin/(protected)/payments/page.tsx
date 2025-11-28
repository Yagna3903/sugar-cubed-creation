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
    <div className="space-y-6 animate-fadeIn">
      <BackLink href="/admin" />

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-zinc-900">Payments</h1>
        <p className="text-zinc-600 mt-1">
          Track and manage payment transactions
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-3xl shadow-soft border border-zinc-100">
          <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">💳</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-1">No payments yet</h3>
          <p className="text-zinc-500 text-center max-w-sm">
            Payments will appear here once customers start placing orders.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-soft border border-zinc-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-xs uppercase tracking-wider text-zinc-500 font-medium">
                  <th className="px-6 py-4 text-left">Order</th>
                  <th className="px-6 py-4 text-left">Provider ID</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-left">Card</th>
                  <th className="px-6 py-4 text-left">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
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
                    <tr key={p.id} className="group hover:bg-zinc-50/50 transition-colors">
                      {/* Order */}
                      <td className="px-6 py-4 align-top">
                        <div className="font-medium text-zinc-900">
                          {p.order?.customerName || p.order?.email || "—"}
                        </div>
                        {p.order && (
                          <div className="text-xs text-zinc-500 mt-0.5">
                            <Link
                              href={`/admin/orders/${p.order.id}`}
                              className="hover:text-brand-brown hover:underline transition-colors"
                            >
                              #{p.order.id.slice(0, 8)}
                            </Link>
                          </div>
                        )}
                      </td>

                      {/* Provider ID */}
                      <td className="px-6 py-4 align-top font-mono text-xs text-zinc-500">
                        {providerDisplay ? (
                          <span title={p.providerPaymentId ?? undefined} className="bg-zinc-100 px-2 py-1 rounded-md">
                            {providerDisplay}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 align-top">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${p.status === "completed"
                              ? "bg-green-50 text-green-700 border-green-100"
                              : p.status === "pending"
                                ? "bg-amber-50 text-amber-700 border-amber-100"
                                : p.status === "refunded"
                                  ? "bg-purple-50 text-purple-700 border-purple-100"
                                  : "bg-red-50 text-red-700 border-red-100"
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${p.status === "completed"
                              ? "bg-green-500"
                              : p.status === "pending"
                                ? "bg-amber-500"
                                : p.status === "refunded"
                                  ? "bg-purple-500"
                                  : "bg-red-500"
                            }`} />
                          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </span>
                        {isPending && (
                          <div className="mt-2 text-[10px] leading-tight text-zinc-500 max-w-[140px]">
                            Expires: <span className="font-medium">{expiresLabel}</span>
                          </div>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 align-top text-right">
                        <div className="font-bold text-zinc-900">
                          ${(p.amountCents / 100).toFixed(2)}
                        </div>
                        <div className="text-xs text-zinc-500 uppercase">{p.currency}</div>
                      </td>

                      {/* Card */}
                      <td className="px-6 py-4 align-top">
                        {p.cardBrand && p.cardLast4 ? (
                          <div className="flex items-center gap-2 text-sm text-zinc-600">
                            <span className="uppercase font-medium text-xs tracking-wider">{p.cardBrand}</span>
                            <span>•••• {p.cardLast4}</span>
                          </div>
                        ) : (
                          <span className="text-zinc-400">—</span>
                        )}
                      </td>

                      {/* Created */}
                      <td className="px-6 py-4 align-top text-xs text-zinc-500">
                        {createdAt.toLocaleDateString()}
                        <div className="text-[10px] text-zinc-400 mt-0.5">
                          {createdAt.toLocaleTimeString()}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 align-top text-right">
                        <div className="flex flex-col gap-2 items-end">
                          {isPending && (
                            <>
                              <form action={capturePayment.bind(null, p.id)}>
                                <button className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors border border-green-200">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Accept
                                </button>
                              </form>
                              <form action={cancelPayment.bind(null, p.id)}>
                                <button className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors border border-red-200">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Cancel
                                </button>
                              </form>
                            </>
                          )}

                          {isCompleted && !isRefunded && (
                            <form action={refundPayment.bind(null, p.id)}>
                              <button className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-red-600 transition-colors border border-zinc-200 hover:border-red-200 shadow-sm">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
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
        </div>
      )}
    </div>
  );
}

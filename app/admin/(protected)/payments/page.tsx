import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import BackLink from "../../_components/BackLink";
import PaymentActions from "../../_components/PaymentActions";

export const metadata = { title: "Admin — Payments" };

export default async function PaymentsPage() {
  // Cast prisma to any to avoid type issues if client generation is stale.
  const payments = await (prisma as any).payment.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      order: {
        select: { id: true, customerName: true, email: true },
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <BackLink href="/admin">Back to Admin</BackLink>
      <h1 className="text-2xl font-semibold mb-4">Payments</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Order</th>
              <th className="p-3">Provider ID</th>
              <th className="p-3">Status</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Currency</th>
              <th className="p-3">Card</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p: any) => (
              <tr key={p.id} className="border-t">
                <td className="p-3 align-top">
                  <code className="text-xs text-zinc-600">{p.id}</code>
                </td>

                {/* Name column */}
                <td className="p-3 align-top">
                  <div className="font-medium">
                    {p.order?.customerName ?? "—"}
                  </div>
                  <div className="text-xs text-zinc-600">
                    {p.order?.email ?? "—"}
                  </div>
                </td>

                {/* Order column */}
                <td className="p-3 align-top">
                  {p.order ? (
                    <Link
                      href={`/admin/(protected)/orders/${p.order.id}`}
                      className="text-brand-brown underline"
                    >
                      {p.order.id}
                    </Link>
                  ) : (
                    <span className="text-sm text-zinc-600">—</span>
                  )}
                </td>

                <td className="p-3 align-top">
                  <span className="text-xs">{p.providerPaymentId ?? "—"}</span>
                </td>

                <td className="p-3 align-top">
                  <span className="px-2 py-1 rounded-full text-xs bg-zinc-100">
                    {p.status}
                  </span>
                </td>

                <td className="p-3 align-top">
                  ${(p.amountCents / 100).toFixed(2)}
                </td>

                <td className="p-3 align-top">{p.currency}</td>

                <td className="p-3 align-top">
                  {p.cardBrand ?? "—"} {p.cardLast4 ? `•${p.cardLast4}` : ""}
                </td>

                <td className="p-3 align-top">
                  {new Date(p.createdAt).toLocaleString()}
                </td>

                <td className="p-3 align-top">
                  <PaymentActions
                    providerPaymentId={p.providerPaymentId ?? ""}
                    status={p.status}
                    amountCents={p.amountCents}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

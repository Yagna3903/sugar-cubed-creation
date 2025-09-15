"use client";

import { useMemo, useState } from "react";

type Row = {
  id: string;
  number: string;
  customer: string;
  total: number;
  status: "Paid" | "Pending" | "Shipped" | "Cancelled";
  placedAt: string;
};

const seed: Row[] = [
  {
    id: "o1",
    number: "SCC-1001",
    customer: "A. Patel",
    total: 42.5,
    status: "Paid",
    placedAt: "2025-09-12",
  },
  {
    id: "o2",
    number: "SCC-1002",
    customer: "J. Singh",
    total: 19.5,
    status: "Pending",
    placedAt: "2025-09-13",
  },
];

export default function OrdersTable() {
  const [status, setStatus] = useState<string>("All");
  const rows = useMemo(
    () =>
      seed.filter((r) =>
        status === "All" ? true : r.status === (status as Row["status"])
      ),
    [status]
  );

  return (
    <>
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2"></div>
        <div className="text-sm text-zinc-500">{rows.length} order(s)</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-t">
          <thead className="bg-zinc-50 text-left text-sm">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Placed</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r) => (
              <tr key={r.id} className="text-sm">
                <td className="px-4 py-3">{r.number}</td>
                <td className="px-4 py-3">{r.customer}</td>
                <td className="px-4 py-3">${r.total.toFixed(2)}</td>
                <td className="px-4 py-3">{r.status}</td>
                <td className="px-4 py-3">{r.placedAt}</td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={`/admin/orders/${r.id}`}
                    className="rounded-xl border px-3 py-1.5"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-zinc-500"
                >
                  No orders for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

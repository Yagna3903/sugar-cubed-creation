"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Row = {
  id: string;
  name: string;
  price: number;
  status: "Active" | "Archived";
  updatedAt: string;
};

const seed: Row[] = [
  {
    id: "p1",
    name: "Classic Sugar Cookie",
    price: 3.25,
    status: "Active",
    updatedAt: "2025-09-10",
  },
  {
    id: "p2",
    name: "Custom Logo Cookie",
    price: 5.5,
    status: "Active",
    updatedAt: "2025-09-12",
  },
];

export default function ProductsTable() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Row[]>(seed);
  const filtered = useMemo(
    () => rows.filter((r) => r.name.toLowerCase().includes(q.toLowerCase())),
    [rows, q]
  );

  async function onDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;

    // Optimistic UI: remove locally first
    setRows((prev) => prev.filter((r) => r.id !== id));

    try {
      // When your API is ready, this will persist the delete:
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete on server");
    } catch (e) {
      alert("Server delete failed. Restoring row.");
      // restore if server failed
      // (in real app you’d re-fetch instead)
      setRows((prev) => {
        const was = seed.find((s) => s.id === id);
        return was
          ? [...prev, was].sort((a, b) => a.name.localeCompare(b.name))
          : prev;
      });
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products…"
          className="w-full rounded-xl border px-3 py-2 sm:max-w-xs"
        />
        <div className="text-sm text-zinc-500">{filtered.length} item(s)</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-t">
          <thead className="bg-zinc-50 text-left text-sm">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 w-64">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((r) => (
              <tr key={r.id} className="text-sm">
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">${r.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 ${
                      r.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3">{r.updatedAt}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {/* READ */}
                    <Link
                      href={`/admin/products/${r.id}`}
                      className="rounded-xl border px-3 py-1.5 hover:bg-zinc-50"
                    >
                      View
                    </Link>
                    {/* UPDATE */}
                    <Link
                      href={`/admin/products/${r.id}/edit`}
                      className="rounded-xl border px-3 py-1.5 hover:bg-zinc-50"
                    >
                      Update
                    </Link>
                    {/* DELETE */}
                    <button
                      onClick={() => onDelete(r.id)}
                      className="rounded-xl border px-3 py-1.5 text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-sm text-zinc-500"
                >
                  No products match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

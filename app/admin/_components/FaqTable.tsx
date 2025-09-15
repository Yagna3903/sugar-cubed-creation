"use client";

import { useMemo, useState } from "react";

type Row = {
  id: string;
  question: string;
  answer: string;
  visible: boolean;
  updatedAt: string;
};

const seed: Row[] = [
  {
    id: "f1",
    question: "Do you deliver?",
    answer: "Yes, within GTA.",
    visible: true,
    updatedAt: "2025-09-11",
  },
  {
    id: "f2",
    question: "Custom logo cookies?",
    answer: "We print edible images.",
    visible: true,
    updatedAt: "2025-09-10",
  },
];

export default function FaqTable() {
  const [q, setQ] = useState("");
  const rows = useMemo(
    () =>
      seed.filter((r) => r.question.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  return (
    <>
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search questions…"
          className="w-full rounded-xl border px-3 py-2 sm:max-w-xs"
        />
        <div className="text-sm text-zinc-500">{rows.length} FAQ(s)</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-t">
          <thead className="bg-zinc-50 text-left text-sm">
            <tr>
              <th className="px-4 py-3">Question</th>
              <th className="px-4 py-3">Visible</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r) => (
              <tr key={r.id} className="text-sm align-top">
                <td className="px-4 py-3">
                  <div className="font-medium">{r.question}</div>
                  <div className="mt-1 line-clamp-2 text-zinc-600">
                    {r.answer}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 ${
                      r.visible
                        ? "bg-green-100 text-green-700"
                        : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {r.visible ? "Shown" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">{r.updatedAt}</td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={`/admin/faq/${r.id}`}
                    className="rounded-xl border px-3 py-1.5"
                  >
                    Edit
                  </a>
                  <a
                    href={`/admin/faq/${r.id}/toggle`}
                    className="ml-2 rounded-xl border px-3 py-1.5"
                  >
                    {r.visible ? "Hide" : "Show"}
                  </a>
                  <a
                    href={`/admin/faq/${r.id}/delete`}
                    className="ml-2 rounded-xl border px-3 py-1.5"
                  >
                    Delete
                  </a>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-12 text-center text-sm text-zinc-500"
                >
                  No FAQs match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

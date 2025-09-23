"use client";

import { useMemo, useState } from "react";
import type { QA } from "./data";

export default function FAQClient({ faqs }: { faqs: QA[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    );
  }, [query, faqs]);

  return (
    <>
      <div className="mt-6">
        <label htmlFor="faq-search" className="block text-sm font-medium">
          Search FAQs
        </label>
        <input
          id="faq-search"
          type="search"
          placeholder='Try "gluten", "pickup", "lead time"...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-2 w-full rounded-xl border px-3 py-2"
          aria-describedby="faq-search-help"
        />
        <div id="faq-search-help" className="mt-1 text-xs opacity-70">
          Type a keyword to filter questions.
        </div>
      </div>

      <div className="mt-8 space-y-3" aria-live="polite">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border bg-amber-50 p-4 text-amber-900">
            <div className="font-medium">No results found</div>
            <div className="mt-1 text-sm opacity-80">
              Try different keywords like <em>gluten</em>, <em>pickup</em>, or{" "}
              <em>custom</em>.
            </div>
          </div>
        ) : (
          filtered.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border bg-white p-4 [&_p]:leading-relaxed"
            >
              <summary className="cursor-pointer select-none text-lg font-medium">
                {f.q}
              </summary>
              <p className="mt-2 text-[15px] opacity-80">{f.a}</p>
            </details>
          ))
        )}
      </div>
    </>
  );
}

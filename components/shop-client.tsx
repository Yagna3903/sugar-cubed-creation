"use client";
export const dynamic = "force-dynamic";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/product-grid";

const filters = ["all", "seasonal", "printed", "corporate", "best-seller", "new"] as const;

export default function ShopClient({ products }: { products: Product[] }) {
  const [f, setF] = useState<(typeof filters)[number]>("all");

  const filtered = useMemo(() => {
    if (f === "all") return products;
    return products.filter((p) => p.badges?.includes(f as any));
  }, [products, f]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((k) => (
          <button
            key={k}
            onClick={() => setF(k)}
            className={`px-3 py-1 rounded-full border ${
              f === k ? "bg-brand-brown text-white" : "bg-white"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <ProductGrid items={filtered} />
      </div>
    </>
  );
}

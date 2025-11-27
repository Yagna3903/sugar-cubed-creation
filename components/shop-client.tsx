"use client";
export const dynamic = "force-dynamic";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/product-grid";

const filters = [
  { key: "all", label: "All Cookies", icon: "🍪" },
  { key: "seasonal", label: "Seasonal", icon: "🎄" },
  { key: "printed", label: "Custom Printed", icon: "🎨" },
  { key: "corporate", label: "Corporate", icon: "💼" },
  { key: "best-seller", label: "Best Sellers", icon: "⭐" },
  { key: "new", label: "New", icon: "✨" },
] as const;

export default function ShopClient({ products }: { products: Product[] }) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (activeFilter === "all") return products;
    return products.filter((p) => p.badges?.includes(activeFilter as any));
  }, [products, activeFilter]);

  return (
    <div className="animate-fade-in">
      {/* Filter Pills */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-brand-cream via-brand-cream to-transparent py-4 -mx-6 px-6">
        <div className="flex flex-wrap gap-3">
          {filters.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`
                group px-5 py-2.5 rounded-full font-medium text-sm
                transition-all duration-200
                ${activeFilter === key
                  ? "bg-brand-brown text-white shadow-md scale-105"
                  : "bg-white text-zinc-700 border-2 border-zinc-200 hover:border-brand-brown/30 hover:shadow-sm"
                }
              `}
            >
              <span className="mr-1.5">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-8 mb-6 flex items-center justify-between">
        <p className="text-sm text-zinc-600">
          Showing <span className="font-semibold text-brand-brown">{filtered.length}</span> {filtered.length === 1 ? 'cookie' : 'cookies'}
        </p>
      </div>

      {/* Product Grid */}
      <ProductGrid items={filtered} />
    </div>
  );
}

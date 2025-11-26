"use client";
import { Product } from "@/lib/types";
export const dynamic = "force-dynamic";

import { ProductCard } from "./product-card";

export function ProductGrid({ items }: { items: Product[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-500">
        <p className="text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
      {items.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}

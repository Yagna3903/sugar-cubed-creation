// components/shop-client.tsx
"use client";

import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/product-grid";

export default function ShopClient({ products }: { products: Product[] }) {
  return (
    <div className="mt-6">
      <ProductGrid items={products} />
    </div>
  );
}

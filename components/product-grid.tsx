import { Product } from "@/lib/types"
export const dynamic = "force-dynamic";

import { ProductCard } from "./product-card"
export function ProductGrid({ items }: { items: Product[] }) {
  return <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">{items.map(p => <ProductCard key={p.id} p={p} />)}</div>
}

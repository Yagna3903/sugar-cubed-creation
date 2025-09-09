"use client"
import { products } from "@/lib/data"
import { ProductGrid } from "@/components/product-grid"
import { useState } from "react"

const filters = ["all", "seasonal", "printed", "corporate", "best-seller", "new"] as const

export default function ShopPage() {
  const [f, setF] = useState<(typeof filters)[number]>("all")
  const filtered = f === "all" ? products : products.filter(p => p.badges?.includes(f as any))

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">Shop</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map(k => (
          <button key={k} onClick={() => setF(k)} className={`px-3 py-1 rounded-full border ${f===k ? "bg-brand-brown text-white" : "bg-white"}`}>{k}</button>
        ))}
      </div>
      <div className="mt-6">
        <ProductGrid items={filtered} />
      </div>
    </section>
  )
}

"use client"
import Link from "next/link"
import { Product } from "@/lib/types"
import { useCart } from "@/lib/cart-store"

export function ProductCard({ p }: { p: Product }) {
  const add = useCart((s) => s.add)
  return (
    <div className="rounded-2xl bg-white shadow-soft p-4 flex flex-col">
      <Link href={`/product/${p.slug}`} className="block">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white">
          <img src={p.image} alt={p.name + " (AI-generated)"} className="w-full h-full object-cover" />
        </div>
        <div className="mt-3 font-medium">{p.name}</div>
      </Link>
      <div className="mt-1 text-sm opacity-70">${p.price.toFixed(2)}</div>
      <div className="mt-3 flex items-center gap-2">
        {p.badges?.map(b => <span key={b} className="text-xs bg-brand-pink/60 px-2 py-1 rounded-full capitalize">{b.replace("-"," ")}</span>)}
      </div>
      <button onClick={() => add({ id:p.id, slug:p.slug, name:p.name, price:p.price, image:p.image })} className="mt-4 rounded-xl bg-brand-brown text-white py-2">Add to cart</button>
    </div>
  )
}

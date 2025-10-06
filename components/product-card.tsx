"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-store";

export function ProductCard({ p }: { p: Product }) {
  const add = useCart((s) => s.add);

  const isOutOfStock = (p.stock ?? 0) <= 0;

  return (
    <div className="rounded-2xl bg-white shadow-soft p-4 flex flex-col">
      <Link href={`/product/${p.slug}`} className="block">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white">
          <Image
            src={p.image}
            alt={p.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="mt-3 font-medium">{p.name}</div>
      </Link>

      <div className="mt-1 text-sm opacity-70">${p.price.toFixed(2)}</div>

      <div className="mt-1 text-xs text-zinc-500">
        {isOutOfStock
          ? "Out of stock"
          : `In stock: ${p.stock} | Limit per order: ${p.maxPerOrder ?? "∞"}`}
      </div>

      <div className="mt-3 flex items-center gap-2">
        {p.badges?.map((b) => (
          <span
            key={b}
            className="text-xs bg-brand-pink/60 px-2 py-1 rounded-full capitalize"
          >
            {b.replace("-", " ")}
          </span>
        ))}
      </div>

      <button
        onClick={() =>
          add({
            id: p.id,
            slug: p.slug,
            name: p.name,
            price: p.price,
            image: p.image,
            stock: p.stock ?? undefined,
            maxPerOrder: p.maxPerOrder ?? undefined,
          })
        }
        disabled={isOutOfStock}
        className={`mt-4 rounded-xl py-2 ${
          isOutOfStock
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-brand-brown text-white"
        }`}
      >
        {isOutOfStock ? "Out of stock" : "Add to cart"}
      </button>
    </div>
  );
}

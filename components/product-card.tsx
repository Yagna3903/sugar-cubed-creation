"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-store";

export function ProductCard({ p }: { p: Product }) {
  const add = useCart((s) => s.add);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const cartItem = useCart((s) => s.items.find((i) => i.id === p.id));

  const currentInCart = cartItem?.qty ?? 0;
  const isOutOfStock = (p.stock ?? 0) <= 0;
  const isLimitReached = p.maxPerOrder !== undefined && p.maxPerOrder !== null && currentInCart >= p.maxPerOrder;

  return (
    <div className="rounded-2xl bg-white shadow-soft p-4 flex flex-col">
      <Link href={`/product/${p.slug}`} className="block">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white">
          <Image src={p.image} alt={p.name} fill className="object-cover" />
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

      <div className="mt-4">
        {isOutOfStock ? (
          <button
            disabled
            className="w-full rounded-xl py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
          >
            Out of stock
          </button>
        ) : currentInCart > 0 ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between border rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentInCart <= 1) {
                    remove(p.id);
                  } else {
                    setQty(p.id, currentInCart - 1);
                  }
                }}
                className="px-4 py-2 hover:bg-gray-50 active:bg-gray-100 transition-colors text-lg"
                aria-label="Decrease quantity"
              >
                –
              </button>
              <div className="font-medium">{currentInCart}</div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setQty(p.id, currentInCart + 1);
                }}
                disabled={
                  (p.stock != null && currentInCart >= p.stock) ||
                  (p.maxPerOrder !== undefined && p.maxPerOrder !== null && currentInCart >= p.maxPerOrder)
                }
                className={`px-4 py-2 transition-colors text-lg ${(p.stock != null && currentInCart >= p.stock) ||
                  (p.maxPerOrder !== undefined && p.maxPerOrder !== null && currentInCart >= p.maxPerOrder)
                  ? "text-gray-300 cursor-not-allowed"
                  : "hover:bg-gray-50 active:bg-gray-100"
                  }`}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            {p.maxPerOrder !== undefined && p.maxPerOrder !== null && currentInCart >= p.maxPerOrder && (
              <div className="text-xs text-center text-amber-600">
                Limit reached ({p.maxPerOrder})
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              add({
                id: p.id,
                slug: p.slug,
                name: p.name,
                price: p.price,
                image: p.image,
                stock: p.stock ?? undefined,
                maxPerOrder: p.maxPerOrder ?? undefined,
              });
            }}
            className="w-full rounded-xl py-2 bg-brand-brown text-white hover:bg-opacity-90 transition-opacity shadow-sm"
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}

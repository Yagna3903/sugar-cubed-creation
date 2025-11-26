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

  return (
    <div className="group rounded-2xl bg-white shadow-soft hover:shadow-medium transition-all duration-300 p-5 flex flex-col h-full card-pop">
      <Link href={`/product/${p.slug}`} className="block">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-brand-cream to-white mb-4">
          <Image
            src={p.image}
            alt={p.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Badge overlay */}
          {p.badges && p.badges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {p.badges.slice(0, 2).map((b) => (
                <span
                  key={b}
                  className="text-xs font-medium bg-brand-brown text-white px-3 py-1 rounded-full capitalize shadow-sm"
                >
                  {b.replace("-", " ")}
                </span>
              ))}
            </div>
          )}
        </div>

        <h3 className="font-display text-lg font-semibold text-zinc-900 mb-2 group-hover:text-brand-brown transition-colors">
          {p.name}
        </h3>
      </Link>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold text-brand-brown">${p.price.toFixed(2)}</span>
      </div>

      <div className="text-xs text-zinc-500 mb-4">
        {isOutOfStock ? (
          <span className="text-red-600 font-medium">Out of stock</span>
        ) : (
          <span>In stock: {p.stock} | Limit: {p.maxPerOrder ?? "∞"}</span>
        )}
      </div>

      <div className="mt-auto">
        {isOutOfStock ? (
          <button
            disabled
            className="w-full rounded-xl py-3 bg-zinc-100 text-zinc-400 cursor-not-allowed font-medium"
          >
            Out of stock
          </button>
        ) : currentInCart > 0 ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between border-2 border-brand-brown/20 rounded-xl overflow-hidden bg-white">
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
                className="px-4 py-3 hover:bg-brand-brown/5 active:bg-brand-brown/10 transition-colors text-lg font-semibold text-brand-brown"
                aria-label="Decrease quantity"
              >
                –
              </button>
              <div className="font-bold text-brand-brown">{currentInCart}</div>
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
                className={`px-4 py-3 transition-colors text-lg font-semibold ${(p.stock != null && currentInCart >= p.stock) ||
                    (p.maxPerOrder !== undefined && p.maxPerOrder !== null && currentInCart >= p.maxPerOrder)
                    ? "text-zinc-300 cursor-not-allowed"
                    : "text-brand-brown hover:bg-brand-brown/5 active:bg-brand-brown/10"
                  }`}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            {p.maxPerOrder !== undefined && p.maxPerOrder !== null && currentInCart >= p.maxPerOrder && (
              <div className="text-xs text-center text-amber-600 font-medium">
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
            className="w-full btn-primary"
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}

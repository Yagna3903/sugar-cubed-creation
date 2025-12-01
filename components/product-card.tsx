"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-store";

export function ProductCard({ p }: { p: Product }) {
  const add = useCart((s) => s.add);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const cartItem = useCart((s) => s.items.find((i) => i.id === p.id));

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Use images array if available, otherwise fall back to single image
  const displayImages = p.images && p.images.length > 0 ? p.images : [p.image];

  const currentInCart = cartItem?.qty ?? 0;
  const isOutOfStock = (p.stock ?? 0) <= 0;

  const handleImageChange = (index: number) => {
    if (index === currentImageIndex) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setIsAnimating(false);
    }, 300);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = (currentImageIndex + 1) % displayImages.length;
    handleImageChange(next);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prev = (currentImageIndex - 1 + displayImages.length) % displayImages.length;
    handleImageChange(prev);
  };

  return (
    <div className="group rounded-2xl bg-white shadow-soft hover:shadow-medium transition-all duration-300 p-5 flex flex-col h-full card-pop hover-shine relative overflow-hidden">
      <Link href={`/product/${p.slug}`} className="block relative z-10">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-brand-cream to-white mb-4">
          <div className={`relative w-full h-full transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            <Image
              src={displayImages[currentImageIndex]}
              alt={p.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-2"
            />
          </div>

          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 z-30"
                aria-label="Previous image"
              >
                <svg className="w-4 h-4 text-brand-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 z-30"
                aria-label="Next image"
              >
                <svg className="w-4 h-4 text-brand-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {displayImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-brand-brown' : 'bg-brand-brown/30'}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Badge overlay */}
          {p.badges && p.badges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20">
              {p.badges.map((b) => (
                <span
                  key={b}
                  className="text-xs font-medium bg-brand-brown/90 backdrop-blur-sm text-white px-3 py-1 rounded-full capitalize shadow-sm"
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

      <div className="flex items-baseline gap-2 mb-3 relative z-10">
        <span className="text-2xl font-bold text-brand-brown">${p.price.toFixed(2)}</span>
      </div>

      <div className="text-xs text-zinc-500 mb-4 relative z-10">
        {isOutOfStock ? (
          <span className="text-red-600 font-medium">Out of stock</span>
        ) : (
          <span>In stock: {p.stock} | Limit: {p.maxPerOrder ?? "∞"}</span>
        )}
      </div>

      <div className="mt-auto relative z-10">
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
            className="w-full btn-primary transform transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}

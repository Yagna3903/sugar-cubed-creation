"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useCart } from "@/lib/cart-store";

type ProductForCart = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
};

export default function AddToCart({
  product,
  defaultQty = 1,
  stock = 0,
  maxPerOrder,
}: {
  product: ProductForCart;
  defaultQty?: number;
  stock?: number;
  maxPerOrder?: number;
}) {

  const add = useCart((s) => s.add);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const cartItem = useCart((s) => s.items.find((i) => i.id === product.id));

  const [qty, setLocalQty] = useState(defaultQty);

  const currentInCart = cartItem?.qty ?? 0;

  const isOutOfStock = stock <= 0;

  // Logic for "Add" mode (not in cart yet)
  const remainingAllowance = maxPerOrder !== undefined ? Math.max(0, maxPerOrder - currentInCart) : Infinity;
  const maxAddable = Math.min(stock, remainingAllowance);

  // Logic for "Update" mode (already in cart)
  const canIncreaseInCart =
    (stock > currentInCart) &&
    (maxPerOrder === undefined || currentInCart < maxPerOrder);

  if (isOutOfStock) {
    return (
      <div className="mt-6 px-6 py-3 bg-gray-100 text-gray-500 rounded-xl font-medium cursor-not-allowed w-fit">
        Out of Stock
      </div>
    );
  }

  // If item is in cart, show "Update" controls
  if (currentInCart > 0) {
    return (
      <div className="mt-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-xl overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => {
                if (currentInCart <= 1) {
                  remove(product.id);
                } else {
                  setQty(product.id, currentInCart - 1);
                }
              }}
              className="px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-lg"
              aria-label="Decrease quantity in cart"
            >
              –
            </button>
            <div className="w-12 text-center font-medium">
              {currentInCart}
            </div>
            <button
              type="button"
              onClick={() => setQty(product.id, currentInCart + 1)}
              disabled={!canIncreaseInCart}
              className={`px-4 py-3 transition-colors text-lg ${!canIncreaseInCart
                ? "text-gray-300 cursor-not-allowed"
                : "hover:bg-gray-50 active:bg-gray-100"
                }`}
              aria-label="Increase quantity in cart"
            >
              +
            </button>
          </div>
          <div className="text-sm text-brand-brown font-medium">
            In Basket
          </div>
        </div>
        {!canIncreaseInCart && maxPerOrder && (
          <div className="mt-2 text-xs text-amber-600">
            Limit reached ({maxPerOrder} per order)
          </div>
        )}
      </div>
    );
  }

  // Default "Add" mode
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <div className="flex items-center border rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setLocalQty((q) => Math.max(1, q - 1))}
          className="px-3 py-2 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          aria-label="Decrease quantity"
        >
          –
        </button>
        <input
          className="w-12 text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          type="number"
          min={1}
          max={maxAddable}
          value={qty}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (!val) return;
            setLocalQty(Math.min(maxAddable, Math.max(1, val)));
          }}
          aria-label="Quantity"
        />
        <button
          type="button"
          onClick={() => setLocalQty((q) => Math.min(maxAddable, q + 1))}
          className="px-3 py-2 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={() => add({ ...product, maxPerOrder }, qty)}
        className="rounded-xl bg-brand-brown text-white px-6 py-3 hover:bg-opacity-90 transition-opacity shadow-sm"
      >
        Add to basket
      </button>
    </div>
  );
}

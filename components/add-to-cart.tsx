"use client";
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
}: {
  product: ProductForCart;
  defaultQty?: number;
}) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(defaultQty);

  return (
    <div className="mt-6 flex items-center gap-3">
      <div className="flex items-center border rounded-xl">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="px-3 py-2"
          aria-label="Decrease quantity"
        >
          –
        </button>
        <input
          className="w-12 text-center outline-none"
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          aria-label="Quantity"
        />
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          className="px-3 py-2"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={() => add(product, qty)}
        className="rounded-xl bg-brand-brown text-white px-6 py-3"
      >
        Add to basket
      </button>
    </div>
  );
}

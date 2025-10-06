"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, type Item } from "@/lib/cart-store";

export default function CartPage() {
  const { items, setQty, remove } = useCart();
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);

  function handleQtyChange(item: Item, newQty: number) {
    if (newQty < 1) return;

    // ✅ enforce per-order limit
    if (item.maxPerOrder && newQty > item.maxPerOrder) {
      alert(`You can only order up to ${item.maxPerOrder} of this product.`);
      return;
    }

    // ✅ enforce stock availability
    if (item.stock && newQty > item.stock) {
      alert(`Only ${item.stock} left in stock.`);
      return;
    }

    setQty(item.id, newQty);
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <div>
          Cart is empty.{" "}
          <Link href="/shop" className="underline">
            Shop now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((i) => (
            <div
              key={i.id}
              className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-soft"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                <Image
                  src={i.image}
                  alt={i.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="font-medium">{i.name}</div>
                <div className="text-sm opacity-70">
                  ${i.price.toFixed(2)}
                </div>
                <div className="text-xs text-zinc-500">
                  In stock: {i.stock ?? "∞"} | Limit per order:{" "}
                  {i.maxPerOrder ?? "∞"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQtyChange(i, i.qty - 1)}
                  className="px-3 py-1 border rounded"
                >
                  -
                </button>
                <span>{i.qty}</span>
                <button
                  onClick={() => handleQtyChange(i, i.qty + 1)}
                  className="px-3 py-1 border rounded"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => remove(i.id)}
                className="ml-2 text-sm underline"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="text-right mt-4">
            <div className="text-lg">
              Subtotal: <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <Link
              href="/checkout"
              className="inline-block mt-3 rounded-xl bg-brand-brown text-white px-6 py-3"
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

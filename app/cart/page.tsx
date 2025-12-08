"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, type Item } from "@/lib/cart-store";

import { BackButton } from "@/components/ui/back-button";

export default function CartPage() {
  const { items, setQty, remove, promoCode, discountAmount, applyPromo, removePromo } = useCart();
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const total = Math.max(0, subtotal - discountAmount);

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  async function handleApplyPromo() {
    if (!promoInput.trim()) return;

    setValidating(true);
    setPromoError(null);

    try {
      const res = await fetch("/api/offers/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoInput,
          cartTotal: subtotal * 100 // API expects cents
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid promo code");
      }

      if (data.success) {
        applyPromo(data.offer.code, data.offer.discountAmount / 100); // Store in dollars
        setPromoInput("");
      }
    } catch (err: any) {
      setPromoError(err.message);
    } finally {
      setValidating(false);
    }
  }

  function handleQtyChange(item: Item, newQty: number) {
    if (newQty < 1) return;

    // enforce stock availability first
    if (item.stock !== undefined && newQty > item.stock) {
      alert(`Only ${item.stock} left in stock.`);
      return;
    }

    // enforce per-order limit
    if (item.maxPerOrder !== undefined && newQty > item.maxPerOrder) {
      alert(`You can only order up to ${item.maxPerOrder} of this product.`);
      return;
    }

    setQty(item.id, newQty);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-cream/20 to-white py-12">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="mb-6">
            <BackButton href="/shop">Back to Shop</BackButton>
          </div>
          <h1 className="font-display text-4xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-zinc-600">
            {items.length === 0 ? "Your cart is waiting to be filled" : `${items.length} ${items.length === 1 ? 'item' : 'items'} in your cart`}
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-16 text-center shadow-soft animate-scale-in">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-brand-pink/20 flex items-center justify-center">
                <span className="text-6xl">🍪</span>
              </div>
              <h2 className="font-display text-2xl font-bold mb-3">Your cart is empty</h2>
              <p className="text-zinc-600 mb-8">
                Time to fill it with delicious cookies!
              </p>
              <Link
                href="/shop"
                className="btn-primary inline-block"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((i) => {
                const itemTotal = i.price * i.qty;

                return (
                  <div
                    key={i.id}
                    className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-200 animate-fade-in"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Image */}
                      <div className="relative w-full sm:w-28 h-48 sm:h-28 rounded-xl overflow-hidden bg-gradient-to-br from-brand-cream to-white flex-shrink-0">
                        <Image
                          src={i.image}
                          alt={i.name}
                          fill
                          className="object-cover p-2"
                        />
                      </div>

                      {/* Details & Quantity Container */}
                      <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
                        {/* Details */}
                        <div className="min-w-0">
                          <Link
                            href={`/product/${i.slug}`}
                            className="font-display text-lg font-semibold text-zinc-900 hover:text-brand-brown transition-colors block mb-1"
                          >
                            {i.name}
                          </Link>
                          <p className="text-2xl font-bold text-brand-brown mb-2">
                            ${i.price.toFixed(2)}{" "}
                            <span className="text-sm font-normal text-zinc-500">each</span>
                          </p>
                          <p className="text-xs text-zinc-500">
                            {i.maxPerOrder ? `Max ${i.maxPerOrder} per order` : ''}
                          </p>
                        </div>

                        {/* Quantity & Remove */}
                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 border-t sm:border-t-0 border-zinc-100 pt-4 sm:pt-0">
                          <div className="flex items-center gap-2 bg-zinc-50 rounded-xl p-1">
                            <button
                              onClick={() => handleQtyChange(i, i.qty - 1)}
                              disabled={i.qty <= 1}
                              className="w-8 h-8 rounded-lg hover:bg-white active:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-semibold">{i.qty}</span>
                            <button
                              onClick={() => handleQtyChange(i, i.qty + 1)}
                              disabled={i.stock !== undefined && i.qty >= i.stock}
                              className="w-8 h-8 rounded-lg hover:bg-white active:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center gap-4 sm:block sm:text-right">
                            <p className="text-sm text-zinc-500 mb-0 sm:mb-1">
                              Total: <span className="font-bold text-zinc-900">${itemTotal.toFixed(2)}</span>
                            </p>

                            <button
                              onClick={() => remove(i.id)}
                              className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary - Sticky */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-soft sticky top-6 animate-slide-up">
                <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-zinc-200">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {promoCode ? (
                    <div className="flex justify-between text-green-600 font-medium animate-fade-in">
                      <span>Discount ({promoCode})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  ) : null}

                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-zinc-100">
                    <span>Total</span>
                    <span className="text-brand-brown">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="mb-6">
                  {!promoCode ? (
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                          placeholder="Promo Code"
                          className="flex-1 rounded-xl border-2 border-zinc-100 px-4 py-2 focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/10 outline-none bg-zinc-50 text-sm uppercase w-full"
                        />
                        <button
                          onClick={handleApplyPromo}
                          disabled={validating || !promoInput}
                          className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto lg:w-full xl:w-auto"
                        >
                          {validating ? "..." : "Apply"}
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-xs text-red-500 ml-1">{promoError}</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-50 border border-green-100 p-3 rounded-xl animate-fade-in">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-100 p-1 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-700">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-green-800">
                          Code <span className="font-bold">{promoCode}</span> applied
                        </span>
                      </div>
                      <button
                        onClick={removePromo}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>


                <Link
                  href="/checkout"
                  className="btn-primary w-full text-center block mb-3"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/shop"
                  className="btn-secondary w-full text-center block text-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

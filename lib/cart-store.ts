// lib/cart-store.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Item = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  stock?: number;        // product stock
  maxPerOrder?: number;  // order limit
};

type State = {
  items: Item[];
  promoCode: string | null;
  discountAmount: number;
  add: (i: Omit<Item, "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  applyPromo: (code: string, amount: number) => void;
  removePromo: () => void;
};

export const useCart = create<State>()(
  persist(
    (set) => ({
      items: [],
      promoCode: null,
      discountAmount: 0,

      add: (i, qty = 1) =>
        set((s) => {
          const existing = s.items.find((x) => x.id === i.id);

          const baseQty = existing?.qty ?? 0;
          let newQty = baseQty + qty;

          // Prefer the latest stock / maxPerOrder info
          const stock = i.stock ?? existing?.stock;
          const maxPerOrder = i.maxPerOrder ?? existing?.maxPerOrder;

          if (stock !== undefined) {
            newQty = Math.min(newQty, stock);
          }
          if (maxPerOrder !== undefined) {
            newQty = Math.min(newQty, maxPerOrder);
          }

          // Ensure at least 1 if we're adding at all
          if (newQty < 1) newQty = 1;

          if (existing) {
            return {
              items: s.items.map((x) =>
                x.id === i.id ? { ...x, ...i, qty: newQty } : x
              ),
            };
          }

          return { items: [...s.items, { ...i, qty: newQty }] };
        }),

      setQty: (id, qty) =>
        set((s) => ({
          items: s.items.map((x) => {
            if (x.id !== id) return x;

            let newQty = qty;

            if (x.stock !== undefined) {
              newQty = Math.min(newQty, x.stock);
            }
            if (x.maxPerOrder !== undefined) {
              newQty = Math.min(newQty, x.maxPerOrder);
            }
            if (newQty < 1) newQty = 1;

            return { ...x, qty: newQty };
          }),
        })),

      remove: (id) =>
        set((s) => ({
          items: s.items.filter((x) => x.id !== id),
        })),

      clear: () => set({ items: [], promoCode: null, discountAmount: 0 }),

      applyPromo: (code, amount) => set({ promoCode: code, discountAmount: amount }),
      removePromo: () => set({ promoCode: null, discountAmount: 0 }),
    }),
    {
      name: "scc-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

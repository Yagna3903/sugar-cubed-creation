"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Item = { id: string; slug: string; name: string; price: number; image: string; qty: number };
type State = {
  items: Item[];
  add: (i: Omit<Item, "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useCart = create<State>()(
  persist(
    (set) => ({
      items: [],
      add: (i, qty = 1) =>
        set((s) => {
          const idx = s.items.findIndex((x) => x.id === i.id);
          if (idx > -1) {
            const copy = [...s.items];
            copy[idx].qty += qty;
            return { items: copy };
          }
          return { items: [...s.items, { ...i, qty }] };
        }),
      setQty: (id, qty) => set((s) => ({ items: s.items.map((x) => (x.id === id ? { ...x, qty } : x)) })),
      remove: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "scc-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

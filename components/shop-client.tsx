"use client";
export const dynamic = "force-dynamic";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/product-grid";
import {
  IconCookie,
  IconWheat,
  IconGift,
  IconBriefcase,
  IconSparkle,
  IconChefHat
} from "@/components/ui/bakery-icons";
import { cn } from "@/lib/utils";

const filters = [
  { key: "all", label: "All Cookies", Icon: IconCookie },
  { key: "seasonal", label: "Seasonal", Icon: IconWheat },
  { key: "printed", label: "Custom Printed", Icon: IconGift },
  { key: "corporate", label: "Corporate", Icon: IconBriefcase },
  { key: "best-seller", label: "Best Sellers", Icon: IconSparkle },
  { key: "new", label: "New", Icon: IconChefHat },
] as const;

export default function ShopClient({ products }: { products: Product[] }) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (activeFilter === "all") return products;
    return products.filter((p) => p.badges?.includes(activeFilter as any));
  }, [products, activeFilter]);

  return (
    <div className="animate-fade-in">
      {/* Filter Pills - Mobile Dropdown, Desktop Pills */}
      <div className="sticky top-2 z-20 mb-8">
        {/* Mobile: Enhanced Dropdown Select */}
        <div className="sm:hidden">
          <div className="relative">
            <label className="block text-xs font-medium text-brand-brown/70 mb-2 ml-1">
              Filter Cookies
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                {filters.find(f => f.key === activeFilter)?.Icon && (
                  <div className="text-brand-brown/60">
                    {(() => {
                      const ActiveIcon = filters.find(f => f.key === activeFilter)!.Icon;
                      return <ActiveIcon className="w-5 h-5" />;
                    })()}
                  </div>
                )}
              </div>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl border-2 border-brand-brown/10 bg-white text-brand-brown font-medium shadow-soft focus:outline-none focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/10 transition-all appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b4226'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.25rem'
                }}
              >
                {filters.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Desktop: Pill Buttons */}
        <div className="hidden sm:block bg-white/60 backdrop-blur-md border border-white/30 shadow-soft rounded-full py-2 px-3 max-w-4xl mx-auto">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {filters.map(({ key, label, Icon }) => {
              const isActive = activeFilter === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={cn(
                    "group flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 relative overflow-hidden",
                    isActive
                      ? "bg-brand-brown text-white shadow-md"
                      : "bg-white/80 text-zinc-600 border border-zinc-200 hover:bg-brand-cream/50 hover:text-brand-brown hover:border-brand-brown/30"
                  )}
                >
                  <Icon className={cn("w-5 h-5 transition-transform duration-300", isActive ? "animate-wiggle" : "text-brand-brown/70 group-hover:text-brand-brown group-hover:scale-110")} />
                  {label}
                  {isActive && (
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-8 flex items-center justify-center">
        <p className="text-sm text-zinc-500 font-medium bg-brand-cream/50 px-4 py-1.5 rounded-full border border-brand-brown/5">
          Found <span className="text-brand-brown font-bold">{filtered.length}</span> {filtered.length === 1 ? 'sweet treat' : 'sweet treats'} for you
        </p>
      </div>

      {/* Product Grid with Waterfall Animation (No Pulse) */}
      <div className="key-grid-anim">
        {filtered.length > 0 ? (
          <ProductGrid items={filtered} />
        ) : (
          <div className="text-center py-24 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-cream mb-6 animate-float-gentle">
              <IconCookie className="w-12 h-12 text-brand-brown/40" />
            </div>
            <h3 className="text-xl font-display font-bold text-zinc-900 mb-2">No cookies found</h3>
            <p className="text-zinc-500">Try selecting a different category for more treats!</p>
          </div>
        )}
      </div>
    </div>
  );
}

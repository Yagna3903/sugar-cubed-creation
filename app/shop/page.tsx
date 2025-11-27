// app/shop/page.tsx
import ShopClient from "@/components/shop-client";
import { BackButton } from "@/components/ui/back-button";
import { IconCookie, IconWhisk, IconSparkle, IconRollingPin, IconGift } from "@/components/ui/bakery-icons";
import { listProducts } from "@/lib/server/products";

// Force this page to always run on the server (no static cache)
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await listProducts(); // Prisma query – always fresh

  return (
    <>
      {/* Shop Hero */}
      {/* Shop Hero - Hyper-Alive & Animated */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/30 via-brand-cream to-white animate-pulse-slower" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(#6b4226 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        {/* Floating Elements - Screensaver Style Movement */}
        <div className="absolute top-10 left-10 text-brand-brown/[0.04] animate-drift pointer-events-none">
          <IconCookie className="w-24 h-24 rotate-12" />
        </div>
        <div className="absolute top-20 right-20 text-brand-brown/[0.045] animate-drift-reverse pointer-events-none">
          <IconWhisk className="w-32 h-32 -rotate-12" />
        </div>
        <div className="absolute bottom-10 left-1/4 text-brand-pink-dark/[0.05] animate-drift-slow pointer-events-none">
          <IconSparkle className="w-16 h-16" />
        </div>
        <div className="absolute top-1/3 right-10 text-brand-brown/[0.035] animate-drift pointer-events-none">
          <IconRollingPin className="w-40 h-40" />
        </div>
        <div className="absolute bottom-20 right-1/3 text-brand-brown/[0.04] animate-drift-reverse pointer-events-none">
          <IconGift className="w-20 h-20" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="absolute top-0 left-6 z-20">
            <BackButton href="/">Home</BackButton>
          </div>

          <div className="text-center max-w-2xl mx-auto animate-slide-up relative z-10 mt-12 sm:mt-0">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-brand-brown/10 text-brand-brown/80 font-medium text-sm mb-6 shadow-sm animate-fade-in">
              <IconSparkle className="w-4 h-4 text-brand-brown" />
              Freshly Baked
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-zinc-900 tracking-tight">
              Our <span className="text-gradient relative inline-block">
                Cookie Collection
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-pink/50 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-xl text-zinc-600 leading-relaxed max-w-xl mx-auto">
              Handcrafted with premium ingredients and a whole lot of love.
              Find your perfect sweet treat below.
            </p>
          </div>
        </div>
      </section>

      {/* Shop Content */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-display text-zinc-400 mb-4">No products available right now</p>
            <p className="text-zinc-500">Check back soon for fresh baked cookies!</p>
          </div>
        ) : (
          <ShopClient products={products} />
        )}
      </section>
    </>
  );
}

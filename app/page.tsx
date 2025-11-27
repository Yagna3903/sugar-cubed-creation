// app/page.tsx
import { Hero } from "@/components/hero";
import { ProductGrid } from "@/components/product-grid";
import { listProducts } from "@/lib/server/products";
import Link from "next/link";
import { IconBriefcase, IconChefHat, IconCookie, IconGift, IconRollingPin, IconSparkle, IconWheat, IconWhisk } from "@/components/ui/bakery-icons";
import { CookieWave } from "@/components/ui/cookie-wave";

export const dynamic = "force-dynamic";


export default async function HomePage() {
  // fetch products from DB
  const products = await listProducts();

  const best = products.filter((p) => p.badges?.includes("best-seller"));
  const newest = products.filter((p) => p.badges?.includes("new"));

  return (
    <>
      <Hero />

      {/* Cookie Wave Divider - flows naturally between sections */}
      <CookieWave className="-mt-32 z-20 relative" />

      <section className="relative mx-auto max-w-7xl px-6 py-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pattern-sprinkles opacity-40 pointer-events-none" />

        {/* Floating decorations */}
        <div className="absolute top-12 right-8 text-brand-brown/10 animate-float-gentle">
          <IconCookie className="w-12 h-12" />
        </div>
        <div className="absolute bottom-20 left-12 text-brand-brown/10 animate-twinkle">
          <IconSparkle className="w-8 h-8" />
        </div>
        <div className="absolute top-1/3 left-10 text-brand-brown/5 animate-float-slower">
          <IconRollingPin className="w-10 h-10 rotate-45" />
        </div>

        <div className="flex items-end justify-between mb-8 relative z-10">
          <h2 className="text-3xl font-bold animate-slide-up text-zinc-900 drop-shadow-sm">
            Our cookies
          </h2>
          <Link href="/shop" className="text-sm font-semibold underline decoration-brand-brown/30 hover:decoration-brand-brown transition-all hover:text-brand-brown">
            See all
          </Link>
        </div>
        <div className="mt-6 relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-xl text-brand-brown">Best-sellers</h3>
            <span className="text-brand-brown animate-wiggle">
              <IconWheat className="w-6 h-6" />
            </span>
          </div>
          <ProductGrid items={best} />

          {/* Extra floating icons for Best Sellers */}
          <div className="absolute top-1/2 right-0 text-brand-brown/5 animate-spin-very-slow pointer-events-none">
            <IconCookie className="w-32 h-32" />
          </div>
          <div className="absolute bottom-10 left-1/4 text-brand-brown/10 animate-float-reverse pointer-events-none">
            <IconWhisk className="w-12 h-12 -rotate-12" />
          </div>
        </div>

        <div className="mt-16 relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-xl text-brand-brown">New products</h3>
            <span className="text-brand-brown animate-pulse-gentle">
              <IconSparkle className="w-6 h-6" />
            </span>
          </div>
          <ProductGrid items={newest} />

          {/* Extra floating icons for New Products */}
          <div className="absolute -bottom-10 right-10 text-brand-brown/10 animate-bounce-gentle pointer-events-none">
            <IconGift className="w-16 h-16 rotate-12" />
          </div>
          <div className="absolute top-10 left-10 text-brand-brown/5 animate-float-slow pointer-events-none">
            <IconChefHat className="w-20 h-20 -rotate-6" />
          </div>
        </div>
      </section>

      {/* Bottom Section - On-brand & Engaging */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Corporate Cookies - Warm Brand Colors */}
          <Link
            href="/corporate-inquiry"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-brown to-brand-brown/90 p-8 text-white shadow-strong hover:shadow-xl transition-all duration-300"
          >
            {/* Animated floating cookies - continuous animation */}
            <div className="absolute top-4 right-8 text-white/10 animate-float-slow">
              <IconCookie className="w-16 h-16" />
            </div>
            <div className="absolute bottom-8 right-16 text-white/5 animate-float-slower">
              <IconCookie className="w-12 h-12" />
            </div>
            <div className="absolute top-1/2 right-4 text-white/5 animate-bounce-gentle">
              <IconBriefcase className="w-10 h-10" />
            </div>

            {/* Pulsing glow effect */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl animate-pulse-slow" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-brand-pink/20 blur-2xl animate-pulse-slower" />

            <div className="relative">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
                <span className="text-white animate-wiggle">
                  <IconBriefcase className="w-8 h-8" />
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">
                Corporate Inquiry
              </h3>
              <p className="text-white/90 mb-6 leading-relaxed">
                Custom printed logo cookies perfect for events, corporate gifts, and special occasions.
              </p>
              <div className="inline-flex items-center gap-2 font-semibold group-hover:gap-3 transition-all">
                Start Your Inquiry
                <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Our Story - Soft Cream & Pink */}
          <Link
            href="/our-story"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-cream via-brand-pink/30 to-brand-cream p-8 shadow-soft hover:shadow-medium transition-all duration-300 border border-brand-pink/20"
          >
            {/* Cookie illustration - continuous spinning */}
            <div className="absolute -right-16 -bottom-16 text-brand-brown/5 animate-spin-very-slow">
              <IconCookie className="w-64 h-64" />
            </div>

            {/* Animated sparkles - continuous floating */}
            <div className="absolute top-8 right-12 text-brand-brown/20 animate-float-gentle">
              <IconSparkle className="w-8 h-8" />
            </div>
            <div className="absolute bottom-12 left-8 text-brand-brown/15 animate-float-reverse">
              <IconSparkle className="w-6 h-6" />
            </div>
            <div className="absolute top-20 left-12 text-brand-brown/10 animate-twinkle">
              <IconRollingPin className="w-8 h-8" />
            </div>

            <div className="relative">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-brown/10 group-hover:scale-110 transition-transform">
                <span className="text-brand-brown animate-pulse-gentle">
                  <IconChefHat className="w-8 h-8" />
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold text-zinc-900 mb-3">
                Our Story
              </h3>
              <p className="text-zinc-700 mb-6 leading-relaxed">
                Handcrafted with love since day one. Every cookie tells a story of quality ingredients and passion for baking.
              </p>
              <div className="inline-flex items-center gap-2 text-brand-brown font-semibold group-hover:gap-3 transition-all">
                Learn More About Us
                <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom Feature Cards - Clean & Subtle */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group rounded-2xl bg-white p-6 shadow-soft border border-zinc-100 hover:shadow-medium transition-all hover:-translate-y-1">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-cream text-brand-brown group-hover:scale-110 transition-transform">
              <IconWheat className="w-6 h-6" />
            </div>
            <h4 className="font-display text-lg font-semibold mb-2 text-zinc-900">Quality Ingredients</h4>
            <p className="text-sm text-zinc-600">
              We use only the finest, ethically sourced ingredients in every batch.
            </p>
          </div>

          <div className="group rounded-2xl bg-white p-6 shadow-soft border border-zinc-100 hover:shadow-medium transition-all hover:-translate-y-1">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pink/30 text-brand-brown group-hover:rotate-12 transition-transform">
              <IconWhisk className="w-6 h-6" />
            </div>
            <h4 className="font-display text-lg font-semibold mb-2 text-zinc-900">Freshly Baked</h4>
            <p className="text-sm text-zinc-600">
              Every order is baked fresh to ensure maximum flavor and quality.
            </p>
          </div>

          <div className="group rounded-2xl bg-white p-6 shadow-soft border border-zinc-100 hover:shadow-medium transition-all hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-brown/10 text-brand-brown group-hover:scale-110 transition-transform">
              <IconRollingPin className="w-6 h-6" />
            </div>
            <h4 className="font-display text-lg font-semibold mb-2 text-zinc-900">Custom Designs</h4>
            <p className="text-sm text-zinc-600">
              Need something special? We love creating custom cookies for your events!
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import Image from "next/image";
import { IconCookie, IconSparkle, IconWheat, IconWhisk } from "@/components/ui/bakery-icons";

export const dynamic = "force-dynamic";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-brand-pink via-brand-cream to-brand-cream overflow-hidden">
      {/* Animated floating decorations - Custom SVGs */}
      <div className="absolute top-20 left-10 text-brand-brown/20 animate-float-slow">
        <IconCookie className="w-12 h-12" />
      </div>
      <div className="absolute top-32 right-20 text-brand-brown/15 animate-float-slower">
        <IconSparkle className="w-8 h-8" />
      </div>
      <div className="absolute bottom-32 left-1/4 text-brand-brown/10 animate-bounce-gentle">
        <IconWhisk className="w-16 h-16" />
      </div>
      <div className="absolute top-1/2 right-12 text-brand-brown/15 animate-twinkle">
        <IconWheat className="w-10 h-10" />
      </div>
      <div className="absolute bottom-20 right-1/3 text-brand-brown/10 animate-float-reverse">
        <IconSparkle className="w-6 h-6" />
      </div>

      {/* Pulsing background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-brown/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse-slower" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-slide-up">
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 bg-brand-brown/10 text-brand-brown px-4 py-2 rounded-full text-sm font-medium animate-fade-in">
              <IconSparkle className="w-4 h-4" />
              Freshly Baked
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Gift for your{" "}
            <span className="text-gradient">mood</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-700 mb-8 leading-relaxed max-w-lg">
            Handcrafted cookies made with <span className="font-semibold text-brand-brown">love</span> and the finest ingredients.
            Perfect for gifts, celebrations, or just because.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="group btn-primary inline-flex items-center justify-center gap-2"
            >
              <span>Shop Now</span>
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <Link
              href="/our-story"
              className="btn-secondary inline-flex items-center justify-center"
            >
              Our Story
            </Link>
          </div>
        </div>

        <div className="relative animate-scale-in">
          <div className="relative aspect-square rounded-3xl bg-white/50 backdrop-blur-sm shadow-strong overflow-hidden group">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/20 via-transparent to-brand-brown/10 pointer-events-none z-10" />

            <Image
              src="/images/Main-Cookie.png"
              alt="Delicious handcrafted cookies"
              fill
              priority
              className="object-contain p-8 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-2"
            />

            {/* Floating badge */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-medium z-20 animate-fade-in hover:scale-105 transition-transform">
              <p className="text-sm font-medium text-brand-brown">⭐ Rated 5.0/5.0</p>
              <p className="text-xs text-zinc-600">by 200+ customers</p>
            </div>
          </div>

          {/* Animated decorative dots */}
          <div className="absolute -top-4 -right-4 w-24 h-24 grid grid-cols-4 gap-2 opacity-30 animate-pulse-gentle">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-brand-brown" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

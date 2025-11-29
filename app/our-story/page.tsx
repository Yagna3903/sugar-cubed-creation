import Link from "next/link";
import Image from "next/image";
import { IconCookie, IconWhisk, IconSparkle, IconGift } from "@/components/ui/bakery-icons";
import { BackButton } from "@/components/ui/back-button";

export const metadata = {
  title: "Our Story — Sugar Cubed Creation",
  description: "From a tiny kitchen to your doorstep. The story behind our handcrafted cookies.",
};

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-cream/30 via-white to-brand-pink/10 relative overflow-hidden">
      {/* Floating Background Decorations */}
      <div className="absolute top-20 right-10 text-brand-brown/[0.08] animate-drift pointer-events-none">
        <IconCookie className="w-40 h-40" />
      </div>
      <div className="absolute bottom-40 left-10 text-brand-brown/[0.09] animate-drift-reverse pointer-events-none">
        <IconWhisk className="w-32 h-32" />
      </div>
      <div className="absolute top-1/3 left-1/4 text-brand-pink-dark/[0.10] animate-drift-slow pointer-events-none">
        <IconSparkle className="w-24 h-24" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6">
        <div className="mx-auto max-w-7xl">
          <BackButton href="/">Home</BackButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pb-16 pt-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-brand-brown/10 text-brand-brown px-5 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <IconWhisk className="w-4 h-4" />
            Since 2024
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            Baked with <span className="text-gradient">Heart</span>
          </h1>

          <p className="text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed animate-fade-in delay-100">
            Every cookie tells a story. Ours begins in a tiny kitchen with a big dream and an even bigger appetite for perfection.
          </p>
        </div>
      </section>

      {/* Main Story Content */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <div className="relative animate-scale-in delay-200">
              <div className="absolute -inset-4 bg-gradient-to-br from-brand-pink/20 to-brand-brown/20 rounded-[2rem] -z-10 rotate-2" />
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/story-placeholder.png"
                  alt="Our bakery kitchen"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />

                {/* Floating Badge */}
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-white/20">
                  <p className="font-display text-2xl font-bold text-brand-brown">100%</p>
                  <p className="text-xs font-medium text-zinc-600 uppercase tracking-wider">Handmade</p>
                </div>
              </div>
            </div>

            {/* Text Side */}
            <div className="space-y-8 animate-fade-in delay-300">
              <div className="prose prose-lg prose-brown">
                <h2 className="font-display text-3xl font-bold text-brand-brown">The Beginning</h2>
                <p className="text-zinc-600 leading-relaxed">
                  It started with a simple craving for the perfect chocolate chip cookie—crispy on the edges, chewy in the center, and loaded with premium chocolate. Disappointed by store-bought options, we took to the kitchen.
                </p>
                <p className="text-zinc-600 leading-relaxed">
                  Hundreds of batches later (and many happy taste-testers), Sugar Cubed Creation was born. We realized that the secret ingredient wasn&apos;t just butter or sugar—it was the patience to get it right.
                </p>

                <h3 className="font-display text-2xl font-bold text-brand-brown pt-4">Our Promise</h3>
                <p className="text-zinc-600 leading-relaxed">
                  We believe in quality over quantity. That&apos;s why every batch is made to order, ensuring that what you receive is as fresh as if you pulled it from your own oven. No preservatives, no shortcuts, just pure cookie joy.
                </p>
              </div>

              {/* Values Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-cream/50">
                  <IconSparkle className="w-8 h-8 text-brand-pink-dark mb-2" />
                  <h4 className="font-bold text-zinc-800">Premium Ingredients</h4>
                  <p className="text-sm text-zinc-500">Only the best butter, chocolate, and vanilla.</p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-cream/50">
                  <IconGift className="w-8 h-8 text-brand-brown mb-2" />
                  <h4 className="font-bold text-zinc-800">Made Fresh</h4>
                  <p className="text-sm text-zinc-500">Baked only after you place your order.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="relative rounded-3xl p-12 overflow-hidden shadow-2xl text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-brown via-brand-pink to-brand-brown" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />

            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to taste the difference?
              </h2>
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 bg-white text-brand-brown px-8 py-4 rounded-xl font-bold hover:bg-brand-cream transition-all shadow-xl hover:shadow-2xl hover:scale-105 group"
              >
                <span>Shop Our Cookies</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

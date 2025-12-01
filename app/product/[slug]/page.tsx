import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AddToCart from "@/components/add-to-cart";
import { prisma } from "@/lib/db";
import { IconSparkle, IconGift, IconCookie, IconWhisk, IconRollingPin } from "@/components/ui/bakery-icons";
import { BackButton } from "@/components/ui/back-button";
import ProductGallery from "@/components/product/ProductGallery";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { inventory: true },
  });

  if (!p || !p.active) return notFound();

  const isOutOfStock = (p.inventory?.stock ?? 0) <= 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-cream/30 to-white relative overflow-hidden">
      {/* Floating Background Decorations */}
      <div className="absolute top-20 right-10 text-brand-brown/[0.10] animate-drift pointer-events-none">
        <IconCookie className="w-32 h-32" />
      </div>
      <div className="absolute bottom-40 left-10 text-brand-brown/[0.09] animate-drift-reverse pointer-events-none">
        <IconWhisk className="w-24 h-24" />
      </div>
      <div className="absolute top-1/2 right-1/4 text-brand-pink-dark/[0.10] animate-drift-slow pointer-events-none">
        <IconSparkle className="w-16 h-16" />
      </div>

      {/* Back Button */}
      <div className="mx-auto max-w-7xl px-6 py-6 relative z-10 animate-fade-in">
        <BackButton href="/shop">Back to Shop</BackButton>
      </div>

      {/* Product Content */}
      <section className="mx-auto max-w-7xl px-6 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Image Gallery */}
          <ProductGallery
            images={p.images.length > 0 ? p.images : (p.imageUrl ? [p.imageUrl] : [])}
            name={p.name}
            isOutOfStock={isOutOfStock}
          />

          {/* Product Details */}
          <div className="animate-slide-up">
            {/* Badges */}
            {p.badges && p.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {p.badges.map((badge, index) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 bg-brand-brown/10 text-brand-brown px-4 py-1.5 rounded-full text-sm font-medium capitalize shadow-sm hover:shadow-md transition-all hover:scale-105 animate-fade-in relative overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    {badge.replace("-", " ")}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 mb-4 animate-fade-in">
              {p.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <span className="text-4xl font-bold text-brand-brown animate-pulse-gentle">
                ${(p.priceCents / 100).toFixed(2)}
              </span>
              <span className="text-zinc-500">per cookie</span>
            </div>

            {p.description && (
              <div className="prose prose-zinc max-w-none mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <p className="text-lg text-zinc-600 leading-relaxed">
                  {p.description}
                </p>
              </div>
            )}

            {/* Stock & Limit Info */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-zinc-100 mb-8 shadow-soft hover:shadow-medium transition-all animate-scale-in" style={{ animationDelay: '300ms' }}>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-zinc-500 mb-1">Availability</p>
                  <p className={`font-semibold ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                    {isOutOfStock ? 'Out of Stock' : `${p.inventory?.stock ?? 0} in stock`}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500 mb-1">Order Limit</p>
                  <p className="font-semibold text-zinc-900">
                    {p.inventory?.maxPerOrder ?? '∞'} per order
                  </p>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
              <AddToCart
                product={{
                  id: p.id,
                  slug: p.slug,
                  name: p.name,
                  price: p.priceCents / 100,
                  image: p.imageUrl || "/images/Main-Cookie.png",
                }}
                stock={p.inventory?.stock ?? 0}
                maxPerOrder={p.inventory?.maxPerOrder ?? undefined}
              />
            </div>

            {/* Additional Info - With Custom Icons */}
            <div className="mt-8 pt-8 border-t border-zinc-200 animate-fade-in" style={{ animationDelay: '500ms' }}>
              <div className="grid gap-4 text-sm">
                <div className="flex items-start gap-3 group hover:translate-x-1 transition-transform">
                  <div className="text-brand-brown/70 group-hover:text-brand-brown transition-colors group-hover:animate-wiggle">
                    <IconSparkle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">Fresh Daily</p>
                    <p className="text-zinc-600">Baked fresh with premium ingredients</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 group hover:translate-x-1 transition-transform">
                  <div className="text-brand-brown/70 group-hover:text-brand-brown transition-colors group-hover:animate-bounce-gentle">
                    <IconCookie className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">Careful Packaging</p>
                    <p className="text-zinc-600">Each cookie individually wrapped for freshness</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 group hover:translate-x-1 transition-transform">
                  <div className="text-brand-brown/70 group-hover:text-brand-brown transition-colors group-hover:animate-float-gentle">
                    <IconGift className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">Gift Ready</p>
                    <p className="text-zinc-600">Beautiful presentation perfect for gifting</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

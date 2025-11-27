import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AddToCart from "@/components/add-to-cart";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { inventory: true },
  });

  if (!p || !p.active) return notFound();

  const isOutOfStock = (p.inventory?.stock ?? 0) <= 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-cream/30 to-white">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex items-center gap-2 text-sm text-zinc-600 animate-fade-in">
          <Link href="/" className="hover:text-brand-brown transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand-brown transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-brand-brown font-medium">{p.name}</span>
        </div>
      </div>

      {/* Product Content */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Image Gallery */}
          <div className="animate-scale-in sticky top-6">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-white to-brand-cream/30 shadow-strong group">
              <Image
                src={p.imageUrl || "/images/Main-Cookie.png"}
                alt={p.name}
                fill
                priority
                className="object-cover p-8 transition-transform duration-500 group-hover:scale-110"
              />

              {/* Stock Badge */}
              {isOutOfStock && (
                <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Optional: Image Thumbnails Placeholder */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-zinc-100 opacity-30"
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="animate-slide-up">
            {/* Badges */}
            {p.badges && p.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {p.badges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-block bg-brand-brown/10 text-brand-brown px-4 py-1.5 rounded-full text-sm font-medium capitalize"
                  >
                    {badge.replace("-", " ")}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
              {p.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-brand-brown">
                ${(p.priceCents / 100).toFixed(2)}
              </span>
              <span className="text-zinc-500">per cookie</span>
            </div>

            {p.description && (
              <div className="prose prose-zinc max-w-none mb-8">
                <p className="text-lg text-zinc-600 leading-relaxed">
                  {p.description}
                </p>
              </div>
            )}

            {/* Stock & Limit Info */}
            <div className="bg-white rounded-2xl p-6 border-2 border-zinc-100 mb-8">
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

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-zinc-200">
              <div className="grid gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <p className="font-semibold text-zinc-900">Fresh Daily</p>
                    <p className="text-zinc-600">Baked fresh each morning with premium ingredients</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <p className="font-semibold text-zinc-900">Careful Packaging</p>
                    <p className="text-zinc-600">Each cookie individually wrapped for freshness</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎁</span>
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

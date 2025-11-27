// app/shop/page.tsx
import ShopClient from "@/components/shop-client";
import { BackButton } from "@/components/ui/back-button";
import { listProducts } from "@/lib/server/products";

// Force this page to always run on the server (no static cache)
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await listProducts(); // Prisma query – always fresh

  return (
    <>
      {/* Shop Hero */}
      <section className="relative bg-gradient-to-br from-brand-pink/40 via-brand-cream to-white py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-brown/10 rounded-full blur-2xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="absolute top-0 left-6 hidden md:block">
            <BackButton href="/">Home</BackButton>
          </div>

          <div className="text-center max-w-2xl mx-auto animate-slide-up">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-gradient">Cookie Collection</span>
            </h1>
            <p className="text-lg text-zinc-600">
              Handcrafted with love, baked fresh daily. Find your perfect sweet treat.
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

// app/page.tsx
import { Hero } from "@/components/hero";
import { ProductGrid } from "@/components/product-grid";
import { listProducts } from "@/lib/server/products"; // ✅ use live DB
import Link from "next/link";

export const dynamic = "force-dynamic";


export default async function HomePage() {
  // fetch products from DB
  const products = await listProducts();

  const best = products.filter((p) => p.badges?.includes("best-seller"));
  const newest = products.filter((p) => p.badges?.includes("new"));

  return (
    <>
      <Hero />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">Our cookies</h2>
          <Link href="/shop" className="text-sm underline">
            See all
          </Link>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Best-sellers</h3>
          <ProductGrid items={best} />
        </div>
        <div className="mt-10">
          <h3 className="font-semibold mb-3">New products</h3>
          <ProductGrid items={newest} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Corporate Inquiry</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/corporate-inquiry"
            className="group rounded-2xl bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5"
          >
            <div className="text-xl font-semibold">Corporate Logo Cookies</div>
            <p className="mt-2 opacity-80">
              Printed (not hand-piped) logo cookies for events & gifting.
            </p>
            <div className="mt-4 underline">Start inquiry</div>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-white p-8 shadow-soft">
            <h3 className="text-xl font-bold mb-2">Watch video</h3>
            <div className="aspect-video bg-black/5 rounded-xl" />
          </div>
          <div className="rounded-2xl bg-white p-8 shadow-soft">
            <h3 className="text-xl font-bold mb-2">Read what&apos;s new</h3>
            <ul className="space-y-3">
              {/* you can still use static blog posts if needed */}
              {/* Or fetch from DB if you want in the future */}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

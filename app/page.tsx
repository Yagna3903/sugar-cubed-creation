// app/page.tsx
import { Hero } from "@/components/hero";
import { listProducts } from "@/lib/server/products";
import Link from "next/link";
import Image from "next/image";
import AddToCart from "@/components/add-to-cart";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // fetch products from backend (same source as /shop)
  const products = await listProducts();

  // choose 4 cookies to feature on the home page
  const featured = products.slice(0, 4);

  return (
    <>
      <Hero />

      {/* Corporate Inquiry */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-brand-brown tracking-tight">
          Corporate Inquiry
        </h2>

        <Link
          href="/corporate-inquiry"
          className="group block rounded-3xl bg-white p-8 shadow-soft border border-transparent
                     transition-all duration-300
                     hover:-translate-y-1 hover:border-brand-brown hover:shadow-xl"
        >
          <div className="text-xl font-semibold text-brand-brown">
            Corporate Logo Cookies
          </div>

          <p className="mt-2 text-brand-brown/80 leading-relaxed">
            Printed (not hand-piped) logo cookies for events & gifting. I am
            open to doing corporate cookies all year round. The standard flavour
            is vanilla.
          </p>

          <button
            className="mt-6 inline-block rounded-full border border-brand-brown px-6 py-2 text-sm font-medium 
                       text-brand-brown transition-all duration-200
                       group-hover:bg-brand-brown group-hover:text-white"
          >
            Start inquiry
          </button>
        </Link>
      </section>

      {/* Discover our cookies – 4 horizontal tiles, linked to product pages */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-brown tracking-tight">
              Discover our cookies
            </h2>
            <Link
              href="/shop"
              className="text-sm font-semibold text-brand-brown underline underline-offset-4"
            >
              Shop all
            </Link>
          </div>

          <div className="space-y-6">
            {featured.map((p) => (
              <div
                key={p.id}
                className="group rounded-3xl bg-white p-6 md:p-8 shadow-soft
                           border border-transparent transition-all duration-300
                           hover:-translate-y-1 hover:border-brand-brown hover:shadow-xl"
              >
                {/* Clickable area: image + text → goes to product page */}
                <Link
                  href={`/product/${p.slug}`}
                  className="flex flex-col md:flex-row gap-6"
                >
                  {/* Image side */}
                  <div className="relative w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden bg-white">
                    <Image
                      src={p.image ?? "/images/Main-Cookie.png"}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Text side */}
                  <div className="mt-4 md:mt-0 md:ml-2 flex-1 flex flex-col justify-center">
                    <h3 className="text-lg md:text-xl font-semibold text-brand-brown">
                      {p.name}
                    </h3>

                    {p.description && (
                      <p className="mt-2 text-sm md:text-base text-brand-brown/80 leading-relaxed line-clamp-3">
                        {p.description}
                      </p>
                    )}

                    <span className="mt-2 text-xs text-brand-brown/60 underline">
                      View details
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

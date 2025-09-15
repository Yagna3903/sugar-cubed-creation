import { products } from "@/lib/data";
import { notFound } from "next/navigation";
import AddToCart from "@/components/add-to-cart";
import BackButton from "@/components/BackButton"; // 👈 import

export default function ProductPage({ params }: { params: { slug: string } }) {
  const p = products.find((x) => x.slug === params.slug);
  if (!p) return notFound();

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 grid md:grid-cols-2 gap-10">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-soft">
        <img
          src={p.image}
          alt={p.name + " (Hello)"}
          className="w-full h-full object-cover"
        />
      </div>

      <div>
        <div className="mb-4">
          <BackButton fallbackHref="/shop" label="Back to shop" />
        </div>

        <h1 className="text-3xl font-bold">{p.name}</h1>
        <div className="mt-2 text-lg">${p.price.toFixed(2)}</div>
        <p className="mt-4 opacity-80">
          {p.description ?? "Soft centers, chewy edges—our signature bake."}
        </p>
        <div className="mt-8 text-sm opacity-70">
          * Printed cookies use a food-safe printer (not hand-piped).
        </div>

        <AddToCart
          product={{
            id: p.id,
            slug: p.slug,
            name: p.name,
            price: p.price,
            image: p.image,
          }}
        />
      </div>
    </section>
  );
}

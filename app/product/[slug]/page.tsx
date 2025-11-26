import { notFound } from "next/navigation";
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

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 grid md:grid-cols-2 gap-10">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-soft">
        <Image
          src={p.imageUrl || "/images/Main-Cookie.png"}
          alt={p.name}
          fill
          className="object-cover"
        />
      </div>
      <div>
        <h1 className="text-3xl font-bold">{p.name}</h1>
        <div className="mt-2 text-lg">${(p.priceCents / 100).toFixed(2)}</div>

        {p.description && <p className="mt-4 opacity-80">{p.description}</p>}

        <div className="mt-8 text-sm opacity-70">
          {p.inventory?.stock ?? 0} in stock
          {p.inventory?.maxPerOrder && (
            <span className="ml-2 text-zinc-500">
              | Limit per order: {p.inventory.maxPerOrder}
            </span>
          )}
        </div>

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
    </section>
  );
}

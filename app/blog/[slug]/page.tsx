// app/product/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

type Params = { slug: string };

// (Optional) Dynamic metadata for the product page.
// Next 15: `params` is a Promise and must be awaited.
export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;

  try {
    const p = await prisma.product.findUnique({
      where: { slug },
      select: { name: true },
    });
    const title = p?.name ? `${p.name} • Product` : `Product • ${slug}`;
    return { title };
  } catch {
    return { title: `Product • ${slug}` };
  }
}

// Next 15: page receives `params` as a Promise.
export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const p = await prisma.product.findUnique({
    where: { slug },
    include: { inventory: true },
  });

  if (!p) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">{p.name}</h1>
      <div className="mt-2 text-sm opacity-70">SKU: {p.slug}</div>

      <div className="mt-4 text-xl font-semibold">
        ${(p.priceCents / 100).toFixed(2)}
      </div>

      {p.imageUrl ? (
        // Replace with your own Image component if you have one
        <img
          src={p.imageUrl}
          alt={p.name}
          className="mt-6 w-full max-w-md rounded-xl border"
        />
      ) : null}

      {p.badges?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {p.badges.map((b: string) => (
            <span
              key={b}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium"
            >
              {b}
            </span>
          ))}
        </div>
      ) : null}

      {p.description ? (
        <p className="prose mt-6 whitespace-pre-line">{p.description}</p>
      ) : null}

      <div className="mt-6 text-sm text-zinc-600">
        In stock: {p.inventory?.stock ?? 0} · Max per order:{" "}
        {p.inventory?.maxPerOrder ?? 12}
      </div>
    </main>
  );
}

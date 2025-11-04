import { prisma } from "@/lib/db";
import type { Product } from "@/lib/types";

// Map DB row → UI Product type
function mapRow(r: {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
  badges: string[];
  description: string | null;
  inventory: { stock: number; maxPerOrder: number } | null;
}): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    price: r.priceCents / 100,
    image: r.imageUrl ?? "/images/Main-Cookie.png",
    badges: (r.badges ?? []) as Product["badges"],
    description: r.description ?? undefined,
    stock: r.inventory?.stock ?? null,          // ✅ add stock
    maxPerOrder: r.inventory?.maxPerOrder ?? null, // ✅ add maxPerOrder
  };
}

/** List all active products (for /shop) */
export async function listProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      priceCents: true,
      imageUrl: true,
      badges: true,
      description: true,
      inventory: { select: { stock: true, maxPerOrder: true } }, // ✅ include inventory
    },
  });
  return rows.map(mapRow);
}

/** Get a single product by slug (for /product/[slug]) */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const r = await prisma.product.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      priceCents: true,
      imageUrl: true,
      badges: true,
      description: true,
      inventory: { select: { stock: true, maxPerOrder: true } }, // ✅ include inventory
    },
  });
  return r ? mapRow(r) : null;
}

/** Find by id (used by APIs) */
export async function findById(id: string): Promise<Product | null> {
  const r = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      name: true,
      priceCents: true,
      imageUrl: true,
      badges: true,
      description: true,
      inventory: { select: { stock: true, maxPerOrder: true } }, // ✅ include inventory
    },
  });
  return r ? mapRow(r) : null;
}

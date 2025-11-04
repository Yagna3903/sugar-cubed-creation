// app/api/dev/seed/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { products as seedProducts } from "@/lib/data";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  for (const p of seedProducts) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        slug: p.slug,
        name: p.name,
        description: p.description ?? null,
        priceCents: Math.round(p.price * 100),
        imageUrl: p.image,
        badges: p.badges ?? [],
        active: true,
      },
      create: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description ?? null,
        priceCents: Math.round(p.price * 100),
        imageUrl: p.image,
        badges: p.badges ?? [],
        active: true,
        inventory: {
          create: { stock: 9999, maxPerOrder: 12 },
        },
      },
    });
  }

  return NextResponse.json({ ok: true, count: seedProducts.length });
}

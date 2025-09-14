import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const list = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
  }) as Array<{
    id: string;
    slug: string;
    name: string;
    priceCents: number;
    imageUrl: string;
    badges: string[];
    description: string | null;
  }>;

  const out = list.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.priceCents / 100,
    image: p.imageUrl,
    badges: p.badges,
    description: p.description ?? undefined,
  }));

  return NextResponse.json(out);
}

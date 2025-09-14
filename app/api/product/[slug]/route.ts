import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const p = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.priceCents / 100,
    image: p.imageUrl,
    badges: p.badges,
    description: p.description ?? undefined,
  });
}

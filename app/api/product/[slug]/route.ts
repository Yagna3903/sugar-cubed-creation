// app/api/product/[slug]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { slug: string };

export async function GET(
  _req: Request,
  { params }: { params: Promise<Params> } // Next 15: params is a Promise
) {
  try {
    const { slug } = await params; // await it

    const p = await prisma.product.findUnique({ where: { slug } });
    if (!p) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.priceCents / 100,
      image: p.imageUrl,
      badges: p.badges,
      description: p.description ?? undefined,
    });
  } catch (err) {
    console.error("GET /api/product/[slug] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

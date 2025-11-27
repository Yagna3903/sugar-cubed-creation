import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { products as staticProducts } from "@/lib/data";

export async function GET() {
    try {
        // Get products marked as available for corporate (includes archived products)
        // This allows corporate-exclusive cookies that aren't in the regular shop
        const dbProducts = await prisma.product.findMany({
            where: {
                availableForCorporate: true,
            } as any, // Type assertion to bypass TS cache issue
            select: {
                id: true,
                name: true,
                slug: true,
                imageUrl: true,
                badges: true,
            },
        });

        // Enrich with images from static data (fallback)
        const enrichedProducts = dbProducts.map((p) => {
            const staticProduct = staticProducts.find((sp) => sp.id === p.id);
            return {
                ...p,
                imageUrl: p.imageUrl || staticProduct?.image || "/images/Main-Cookie.png",
            };
        });

        return NextResponse.json(enrichedProducts);
    } catch (error) {
        console.error("Error fetching corporate products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

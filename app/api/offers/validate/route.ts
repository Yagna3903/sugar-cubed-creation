import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { code, cartTotal } = await request.json();

        if (!code) {
            return NextResponse.json(
                { error: "Promo code is required" },
                { status: 400 }
            );
        }

        const offer = await prisma.offer.findUnique({
            where: { promoCode: code.toUpperCase() },
        });

        if (!offer) {
            return NextResponse.json(
                { error: "Invalid promo code" },
                { status: 404 }
            );
        }

        // Check if active
        if (!offer.active) {
            return NextResponse.json(
                { error: "This promo code is no longer active" },
                { status: 400 }
            );
        }

        // Check dates
        const now = new Date();
        if (now < offer.validFrom || now > offer.validUntil) {
            return NextResponse.json(
                { error: "This promo code has expired or is not yet valid" },
                { status: 400 }
            );
        }

        // Check minimum purchase
        if (offer.minPurchase && cartTotal < offer.minPurchase) {
            return NextResponse.json(
                {
                    error: `Minimum purchase of $${(offer.minPurchase / 100).toFixed(
                        2
                    )} required`,
                },
                { status: 400 }
            );
        }

        // Calculate discount
        let discountAmount = 0;
        if (offer.discountType === "percentage") {
            discountAmount = Math.round((cartTotal * offer.discountValue) / 100);
        } else {
            discountAmount = offer.discountValue * 100; // Assuming value is stored in dollars but we work in cents? Wait, schema says Int. Let's assume cents for consistency with priceCents.
            // Actually, in the form I said "500 for $5.00", so it's cents.
            discountAmount = offer.discountValue;
        }

        // Ensure discount doesn't exceed total
        discountAmount = Math.min(discountAmount, cartTotal);

        return NextResponse.json({
            success: true,
            offer: {
                code: offer.promoCode,
                type: offer.discountType,
                value: offer.discountValue,
                discountAmount,
            },
        });
    } catch (error) {
        console.error("Promo validation error:", error);
        return NextResponse.json(
            { error: "Failed to validate promo code" },
            { status: 500 }
        );
    }
}

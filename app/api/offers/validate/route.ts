import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { logError, logEvent, logWarning } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const { code, cartTotal } = await request.json();
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";
    const normalizedCode =
      typeof code === "string" ? code.trim().toUpperCase() : "";

    logEvent("promo.validate.request", {
      code: normalizedCode || null,
      cartTotal,
      clientIp,
    });

    if (!normalizedCode) {
      logWarning("promo.validate.missing_code", { clientIp });
      return NextResponse.json(
        { error: "Promo code is required" },
        { status: 400 }
      );
    }

    const offer = await prisma.offer.findUnique({
      where: { promoCode: normalizedCode },
    });

    if (!offer) {
      logWarning("promo.validate.not_found", {
        code: normalizedCode,
        clientIp,
      });
      return NextResponse.json(
        { error: "Invalid promo code" },
        { status: 404 }
      );
    }

    // Check if active
    if (!offer.active) {
      logWarning("promo.validate.inactive", {
        code: normalizedCode,
        clientIp,
      });
      return NextResponse.json(
        { error: "This promo code is no longer active" },
        { status: 400 }
      );
    }

    // Check dates
    const now = new Date();
    if (now < offer.validFrom || now > offer.validUntil) {
      logWarning("promo.validate.out_of_window", {
        code: normalizedCode,
        clientIp,
      });
      return NextResponse.json(
        { error: "This promo code has expired or is not yet valid" },
        { status: 400 }
      );
    }

    // Check minimum purchase
    if (offer.minPurchase && cartTotal < offer.minPurchase) {
      logWarning("promo.validate.min_purchase", {
        code: normalizedCode,
        clientIp,
        cartTotal,
        minPurchase: offer.minPurchase,
      });
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

    logEvent("promo.validate.success", {
      code: normalizedCode,
      clientIp,
      discountAmount,
    });

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
    logError("promo.validate.exception", {
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Failed to validate promo code" },
      { status: 500 }
    );
  }
}

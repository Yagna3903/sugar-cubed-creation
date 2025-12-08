// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { CreateOrderInput } from "@/lib/server/validators";
import { prisma } from "@/lib/db";
import { OrderStatus, Prisma } from "@prisma/client";
import { sendOrderEmail, sendAdminNewOrderEmail } from "@/lib/email";
import { verifyEmailDeliverable } from "@/lib/server/email-verifier";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreateOrderInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { customer, items } = parsed.data;
  const normalizedEmail = customer.email.trim();

  try {
    const verification = await verifyEmailDeliverable(normalizedEmail);
    if (!verification.deliverable) {
      return NextResponse.json(
        {
          error:
            "We couldn't verify that email can receive receipts. Please use another address.",
          reason: verification.reason,
          suggestion: verification.suggestion,
        },
        { status: 422 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Email verification failed" },
      { status: 502 }
    );
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const ids = items.map((i) => i.id);

      const dbProducts = await tx.product.findMany({
        where: { id: { in: ids }, active: true },
        select: {
          id: true,
          priceCents: true,
          inventory: { select: { stock: true } },
        },
      });

      if (dbProducts.length !== ids.length) {
        const found = new Set(dbProducts.map((p) => p.id));
        const missing = ids.filter((id) => !found.has(id));
        throw new Error(`Products not found: ${missing.join(", ")}`);
      }

      let totalCents = 0;
      const orderItemsData = items.map((it) => {
        const product = dbProducts.find((p) => p.id === it.id)!;
        if (!product.inventory) {
          throw new Error(`Product ${it.id} has no inventory record`);
        }

        if (product.inventory.stock < it.qty) {
          throw new Error(
            `Not enough stock for ${it.id}. Only ${product.inventory.stock} left.`
          );
        }

        totalCents += product.priceCents * it.qty;
        return {
          productId: it.id,
          qty: it.qty,
          unitPriceCents: product.priceCents,
        };
      });

      // Calculate discount if promo code provided
      let discountTotal = 0;
      const { promoCode } = parsed.data;

      if (promoCode) {
        const offer = await tx.offer.findUnique({
          where: { promoCode },
        });

        if (offer && offer.active) {
          const now = new Date();
          if (now >= offer.validFrom && now <= offer.validUntil) {
            // Check min purchase
            if (!offer.minPurchase || totalCents >= offer.minPurchase) {
              if (offer.discountType === "percentage") {
                discountTotal = Math.round(
                  totalCents * (offer.discountValue / 100)
                );
              } else {
                discountTotal = offer.discountValue; // Value is in cents
              }

              // Increment usage
              await tx.offer.update({
                where: { id: offer.id },
                data: { usageCount: { increment: 1 } },
              });
            }
          }
        }
      }

      const finalTotal = Math.max(0, totalCents - discountTotal);

      const orderData = {
        email: normalizedEmail,
        customerName: customer.name,
        status: OrderStatus.pending,
        // subtotal is defined in schema and generated types
        subtotal: totalCents,
        discountTotal,
        totalCents: finalTotal,
        promoCode: promoCode || null,
        items: { create: orderItemsData },
      };

      const order = await tx.order.create({
        data: orderData,
      });

      for (const it of items) {
        await tx.inventory.update({
          where: { productId: it.id },
          data: { stock: { decrement: it.qty } },
        });
      }

      return order;
    });

    // Send emails (fire and forget)
    const orderWithItems = await prisma.order.findUnique({
      where: { id: order.id },
      include: { items: { include: { product: true } } },
    });

    if (orderWithItems) {
      console.log("[OrderAPI] Sending confirmation emails...");
      await Promise.all([
        sendOrderEmail(orderWithItems, "pending").catch((err) =>
          console.error("Failed to send customer email:", err)
        ),
        sendAdminNewOrderEmail(orderWithItems).catch((err) =>
          console.error("Failed to send admin email:", err)
        ),
      ]);
    }

    const origin = new URL(req.url).origin;
    const checkoutUrl = `${origin}/checkout/success?o=${encodeURIComponent(
      order.id
    )}`;

    // Revalidate paths to update stock display
    revalidatePath("/", "layout");

    return NextResponse.json({ orderId: order.id, checkoutUrl });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Order failed" },
      { status: 400 }
    );
  }
}

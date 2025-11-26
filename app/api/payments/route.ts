// app/api/payments/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CreateOrderInput } from "@/lib/server/validators";
import { OrderStatus } from "@prisma/client";
import { z } from "zod";

// Extend your existing CreateOrderInput with Square token + card info
const PaymentsInput = CreateOrderInput.extend({
  token: z.string().min(1, "Missing payment token"),
  cardBrand: z.string().optional(),
  cardLast4: z.string().optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = PaymentsInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { customer, items, token, cardBrand, cardLast4 } = parsed.data;

  try {
    const { order, payment } = await prisma.$transaction(async (tx) => {
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

      // Create order as pending (client can accept/cancel later)
      const order = await tx.order.create({
        data: {
          email: customer.email,
          customerName: customer.name,
          status: OrderStatus.pending,
          totalCents,
          items: { create: orderItemsData },
        },
      });

      // Create a pending Payment record with token + card info
      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          provider: "square",
          providerPaymentId: token, // use token as provider ID for admin view
          status: "pending",        // NOT auto-completed
          amountCents: totalCents,
          currency: "CAD",
          cardBrand: cardBrand ?? null,
          cardLast4: cardLast4 ?? null,
          receiptUrl: null,
          idempotencyKey: `${order.id}:${token}`, // unique
          metadata: {},
        },
      });

      // Optionally hold or decrement stock. Keeping same behaviour as /api/orders:
      for (const it of items) {
        await tx.inventory.update({
          where: { productId: it.id },
          data: { stock: { decrement: it.qty } },
        });
      }

      return { order, payment };
    });

    const origin = new URL(req.url).origin;
    const checkoutUrl = `${origin}/checkout/success?o=${encodeURIComponent(
      order.id
    )}`;

    return NextResponse.json({
      orderId: order.id,
      paymentId: payment.id,
      checkoutUrl,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Payment failed" },
      { status: 400 }
    );
  }
}

import { NextResponse } from "next/server";
import { CreateOrderInput } from "@/lib/server/validators";
import { prisma } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

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

  // Transaction: validate stock, create order, decrement stock
  try {
    const order = await prisma.$transaction(async (tx) => {
      // Fetch product data including stock
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

      // Check stock + build items
      let totalCents = 0;
      const orderItemsData = items.map((it) => {
        const product = dbProducts.find((p) => p.id === it.id)!;
        if (!product.inventory)
          throw new Error(`Product ${it.id} has no inventory record`);

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

      // Create order
      const order = await tx.order.create({
        data: {
          email: customer.email,
          customerName: customer.name,
          status: OrderStatus.pending, // if status is enum
          totalCents,
          items: { create: orderItemsData },
        },
      });

      // Decrement stock for each item
      for (const it of items) {
        await tx.inventory.update({
          where: { productId: it.id },
          data: { stock: { decrement: it.qty } },
        });
      }

      return order;
    });

    const origin = new URL(req.url).origin;
    // Only expose an opaque order reference in the URL (no PII)
    const checkoutUrl = `${origin}/checkout/success?o=${encodeURIComponent(
      order.id
    )}`;

    return NextResponse.json({ orderId: order.id, checkoutUrl });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Order failed" },
      { status: 400 }
    );
  }
}

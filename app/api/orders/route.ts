// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { CreateOrderInput } from "@/lib/server/validators";
import { prisma } from "@/lib/db";
import { OrderStatus } from "@prisma/client";
import { sendOrderEmail, sendAdminNewOrderEmail } from "@/lib/email";

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

      const order = await tx.order.create({
        data: {
          email: customer.email,
          customerName: customer.name,
          status: OrderStatus.pending,
          totalCents,
          items: { create: orderItemsData },
        },
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
      include: { items: { include: { product: true } } }
    });

    if (orderWithItems) {
      sendOrderEmail(orderWithItems, "pending");
      sendAdminNewOrderEmail(orderWithItems);
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

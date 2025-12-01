import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendInvoiceEmail } from "@/lib/server/email";
import { OrderStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const orderId = body?.orderId as string | undefined;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const existing = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const wasPaid = existing.status === OrderStatus.paid;
    if (!wasPaid) {
      await prisma.order.update({
        where: { id: existing.id },
        data: { status: OrderStatus.paid },
      });
      // Send receipt email only on first transition to paid
      try {
        await sendInvoiceEmail(orderId);
      } catch (e) {
        console.error("Failed to send receipt email:", e);
      }
    }

    return NextResponse.json({ ok: true, alreadyPaid: wasPaid });
  } catch (err) {
    console.error("Error in /api/orders/mark-paid:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

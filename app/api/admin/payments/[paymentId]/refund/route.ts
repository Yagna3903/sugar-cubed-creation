import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(
  req: Request,
  { params }: { params: { paymentId: string } }
) {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  const squareBase =
    process.env.SQUARE_API_BASE_URL ?? "https://connect.squareupsandbox.com";
  const squareVersion = process.env.SQUARE_API_VERSION ?? "2025-08-20";
  if (!accessToken)
    return NextResponse.json(
      { error: "SQUARE_ACCESS_TOKEN not configured" },
      { status: 500 }
    );

  const body = (await req.json().catch(() => ({}))) as {
    amountCents?: number;
    reason?: string;
  };

  // Find local payment by providerPaymentId
  const payment = await (prisma as any).payment.findUnique({
    where: { providerPaymentId: params.paymentId },
  });
  if (!payment)
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });

  // Only allow refund for completed/captured payments
  const refundableStatuses = ["completed", "captured", "succeeded", "paid"];
  if (!refundableStatuses.includes(String(payment.status))) {
    return NextResponse.json(
      { error: "Payment is not in a refundable state" },
      { status: 400 }
    );
  }

  const amount = Number(body.amountCents ?? payment.amountCents ?? 0);
  if (!amount || amount <= 0) {
    return NextResponse.json(
      { error: "Refund amount must be greater than 0" },
      { status: 400 }
    );
  }

  const idempotency_key = `refund-${payment.id}-${crypto.randomUUID()}`;
  const payload = {
    idempotency_key,
    payment_id: params.paymentId,
    amount_money: { amount, currency: payment.currency ?? "CAD" },
    reason: body.reason ?? "Admin initiated refund",
  };

  const resp = await fetch(`${squareBase}/v2/refunds`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Square-Version": squareVersion,
    },
    body: JSON.stringify(payload),
  });
  const data = await resp.json();
  if (!resp.ok) {
    return NextResponse.json({ error: data }, { status: resp.status });
  }

  // Persist status as refunded
  await (prisma as any).payment.update({
    where: { id: payment.id },
    data: { status: "refunded", metadata: data },
  });

  // If full refund amount equals original captured amount, mark order refunded
  try {
    if (Number(amount) === Number(payment.amountCents)) {
      await (prisma as any).order.update({
        where: { id: payment.orderId },
        data: { status: "refunded" },
      });
    }
  } catch {}

  return NextResponse.json({ ok: true, refund: data });
}

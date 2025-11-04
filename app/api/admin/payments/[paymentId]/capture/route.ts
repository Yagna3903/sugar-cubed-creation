import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

  const { action } = (await req.json().catch(() => ({}))) as {
    action?: "capture" | "cancel";
  };
  if (action !== "capture" && action !== "cancel") {
    return NextResponse.json(
      { error: "action must be 'capture' or 'cancel'" },
      { status: 400 }
    );
  }

  // Find the local payment to know the order
  const dbPayment = await prisma.payment.findUnique({
    where: { providerPaymentId: params.paymentId },
    select: { orderId: true, status: true },
  });
  if (!dbPayment)
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });

  // Short-circuits
  if (action === "capture" && dbPayment.status === "completed") {
    return NextResponse.json({ ok: true, message: "Already captured" });
  }
  if (action === "cancel" && dbPayment.status === "canceled") {
    return NextResponse.json({ ok: true, message: "Already canceled" });
  }

  // Call Square
  const endpoint =
    action === "capture"
      ? `${squareBase}/v2/payments/${params.paymentId}/complete`
      : `${squareBase}/v2/payments/${params.paymentId}/cancel`;

  const resp = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Square-Version": squareVersion,
    },
  });
  const data = await resp.json();
  if (!resp.ok)
    return NextResponse.json({ error: data }, { status: resp.status });

  // Update local DB
  if (action === "capture") {
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { providerPaymentId: params.paymentId },
        data: { status: "completed", metadata: data },
      });
      await tx.order.update({
        where: { id: dbPayment.orderId },
        data: { status: "paid" },
      });
    });
  } else {
    await prisma.payment.update({
      where: { providerPaymentId: params.paymentId },
      data: { status: "cancelled", metadata: data },
    });
    // Optional: mark order cancelled too
    await prisma.order.update({
      where: { id: dbPayment.orderId },
      data: { status: "cancelled" },
    });
  }

  return NextResponse.json({ ok: true });
}

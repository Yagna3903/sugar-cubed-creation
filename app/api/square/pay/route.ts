import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendInvoiceEmail } from "@/lib/server/email";
// If you use enum:
// import { OrderStatus } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PayBody = {
  sourceId?: string;
  orderId?: string;
  idempotencyKey?: string;
  verificationToken?: string;
  // amountCents?: number; // ignored
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as PayBody;
  const {
    sourceId,
    orderId,
    idempotencyKey: clientIdemp,
    verificationToken,
  } = body;

  if (!sourceId || !orderId) {
    return NextResponse.json(
      { error: "Missing sourceId or orderId" },
      { status: 400 }
    );
  }

  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  const locationId =
    process.env.SQUARE_LOCATION_ID ??
    process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ??
    "";
  const squareBase =
    process.env.SQUARE_API_BASE_URL ?? "https://connect.squareupsandbox.com";
  const squareVersion = process.env.SQUARE_API_VERSION ?? "2025-08-20";

  if (!accessToken)
    return NextResponse.json(
      { error: "SQUARE_ACCESS_TOKEN not configured" },
      { status: 500 }
    );
  if (!locationId)
    return NextResponse.json(
      { error: "SQUARE_LOCATION_ID not configured" },
      { status: 500 }
    );

  // Load order
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order)
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status === "paid") {
    return NextResponse.json(
      { ok: true, message: "Already paid" },
      { status: 200 }
    );
  }

  // Optional guard: prevent multiple auths for same order
  // Cast to any in case Prisma client types are out-of-date locally.
  const existingAuth = await (prisma as any).payment.findFirst({
    where: { orderId, status: { in: ["approved", "completed"] } },
  });
  if (existingAuth) {
    return NextResponse.json(
      { error: "Payment already authorized or captured" },
      { status: 409 }
    );
  }

  const idempotencyKey = clientIdemp ?? `order-${orderId}`;

  // Authorize only
  const payload: Record<string, any> = {
    source_id: sourceId,
    idempotency_key: idempotencyKey,
    amount_money: { amount: order.totalCents, currency: "CAD" },
    location_id: locationId,
    autocomplete: false, // AUTH-ONLY
    delay_action: "CANCEL", // or omit; default behavior is OK
    // delay_duration: "P7D",            // optional; default for CNP is ~7 days
  };
  if (verificationToken) payload.verification_token = verificationToken;

  let squareJson: any;
  try {
    const resp = await fetch(`${squareBase}/v2/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Square-Version": squareVersion,
      },
      body: JSON.stringify(payload),
    });
    squareJson = await resp.json();
    if (!resp.ok) {
      const code = squareJson?.errors?.[0]?.code ?? null;
      return NextResponse.json(
        { error: squareJson, code },
        { status: resp.status }
      );
    }
  } catch (e: any) {
    return NextResponse.json(
      { error: "Upstream error to Square", detail: String(e?.message ?? e) },
      { status: 502 }
    );
  }

  const payment = squareJson?.payment;
  const providerPaymentId = payment?.id ?? null;
  const status = String(payment?.status ?? "").toLowerCase(); // expect "approved"
  const paidAmount = Number(payment?.amount_money?.amount ?? order.totalCents);
  const currency = String(
    payment?.amount_money?.currency ?? "CAD"
  ).toUpperCase();
  const receiptUrl = payment?.receipt_url ?? null;
  const cardBrand =
    payment?.card_details?.card?.card_brand ??
    payment?.card_details?.card_brand ??
    null;
  const cardLast4 =
    payment?.card_details?.card?.last_4 ??
    payment?.card_details?.last_4 ??
    null;

  if (currency !== "CAD") {
    return NextResponse.json(
      { error: "Only CAD payments are accepted" },
      { status: 400 }
    );
  }

  // Persist auth and mark order approved (NOT paid)
  await prisma.$transaction(async (tx) => {
    await (tx as any).payment.create({
      data: {
        orderId,
        provider: "square",
        providerPaymentId,
        status, // likely "approved"
        amountCents: paidAmount,
        currency,
        cardBrand,
        cardLast4,
        receiptUrl,
        idempotencyKey,
        metadata: squareJson,
      },
    });
    await (tx as any).order.update({
      where: { id: orderId },
      data: { status: "approved" }, // or OrderStatus.approved
    });
  });

  // Send 'in process' invoice email (best-effort; don't block response)
  try {
    const emailRes = await sendInvoiceEmail(orderId);
    if ((emailRes as any)?.ok === false) {
      console.error("[square.pay] invoice email failed", emailRes);
    }
  } catch (e) {
    console.error("[square.pay] invoice email threw", e);
  }

  return NextResponse.json(
    { success: true, paymentId: providerPaymentId, payment: squareJson },
    { status: 200 }
  );
}

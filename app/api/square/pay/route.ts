import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendInvoiceEmail } from "@/lib/server/email";
import {
  logPaymentError,
  logPaymentEvent,
  logPaymentWarning,
} from "@/lib/logger";
import {
  incrementFailureCounter,
  resetFailureCounter,
} from "@/lib/payment-failure-tracker";
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
    orderId: rawOrderId,
    idempotencyKey: clientIdemp,
    verificationToken,
  } = body;
  const orderId =
    typeof rawOrderId === "string" ? rawOrderId.trim() || undefined : undefined;
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  logPaymentEvent("payment.request.received", {
    orderId: orderId ?? null,
    clientIp,
    hasSource: Boolean(sourceId),
  });

  if (!sourceId || !orderId) {
    logPaymentWarning("payment.request.invalid", {
      reason: "missing-source-or-order",
      clientIp,
    });
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

  if (!accessToken) {
    logPaymentError("payment.config.missing", {
      key: "SQUARE_ACCESS_TOKEN",
    });
    return NextResponse.json(
      { error: "SQUARE_ACCESS_TOKEN not configured" },
      { status: 500 }
    );
  }
  if (!locationId) {
    logPaymentError("payment.config.missing", {
      key: "SQUARE_LOCATION_ID",
    });
    return NextResponse.json(
      { error: "SQUARE_LOCATION_ID not configured" },
      { status: 500 }
    );
  }

  const safeOrderId = orderId as string;
  const ipFailureKey = `ip:${clientIp}`;
  const orderFailureKey = `order:${safeOrderId}`;

  const withFailureStats = (extra?: Record<string, unknown>) => {
    const ipStats = incrementFailureCounter(ipFailureKey);
    const orderStats = incrementFailureCounter(orderFailureKey);
    const context = {
      orderId: safeOrderId,
      clientIp,
      ipFailures: ipStats.count,
      orderFailures: orderStats.count,
      ...extra,
    };
    if (ipStats.thresholdHit || orderStats.thresholdHit) {
      logPaymentWarning("payment.failure.threshold_reached", context);
    }
    return context;
  };

  // Load order
  const order = await prisma.order.findUnique({ where: { id: safeOrderId } });
  if (!order) {
    const context = withFailureStats({ reason: "order-not-found" });
    logPaymentWarning("payment.order.not_found", context);
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status === "paid") {
    logPaymentEvent("payment.duplicate", {
      orderId: safeOrderId,
      clientIp,
      status: order.status,
    });
    return NextResponse.json(
      { ok: true, message: "Already paid" },
      { status: 200 }
    );
  }

  // Optional guard: prevent multiple auths for same order
  // Cast to any in case Prisma client types are out-of-date locally.
  const existingAuth = await (prisma as any).payment.findFirst({
    where: { orderId: safeOrderId, status: { in: ["approved", "completed"] } },
  });
  if (existingAuth) {
    logPaymentWarning("payment.auth.exists", {
      orderId: safeOrderId,
      clientIp,
      paymentId: existingAuth.id,
    });
    return NextResponse.json(
      { error: "Payment already authorized or captured" },
      { status: 409 }
    );
  }

  const idempotencyKey = clientIdemp ?? `order-${safeOrderId}`;

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
    logPaymentEvent("payment.square.request", {
      orderId: safeOrderId,
      clientIp,
      amountCents: order.totalCents,
      idempotencyKey,
    });
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
      const context = withFailureStats({ status: resp.status, code });
      logPaymentWarning("payment.square.response_error", context);
      return NextResponse.json(
        { error: squareJson, code },
        { status: resp.status }
      );
    }
  } catch (e: any) {
    const context = withFailureStats({
      message: e?.message ?? String(e),
    });
    logPaymentError("payment.square.fetch_failed", context);
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
    const context = withFailureStats({ currency });
    logPaymentWarning("payment.currency.invalid", context);
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

  logPaymentEvent("payment.auth.recorded", {
    orderId: safeOrderId,
    clientIp,
    providerPaymentId,
    status,
    amountCents: paidAmount,
  });

  resetFailureCounter(ipFailureKey);
  resetFailureCounter(orderFailureKey);

  // Send 'in process' invoice email (best-effort; don't block response)
  try {
    const emailRes = await sendInvoiceEmail(safeOrderId);
    if ((emailRes as any)?.ok === false) {
      logPaymentWarning("payment.email.failed", {
        orderId: safeOrderId,
        detail: emailRes,
      });
    }
  } catch (e: unknown) {
    logPaymentError("payment.email.exception", {
      orderId: safeOrderId,
      message: e instanceof Error ? e.message : String(e),
    });
  }

  return NextResponse.json(
    { success: true, paymentId: providerPaymentId, payment: squareJson },
    { status: 200 }
  );
}

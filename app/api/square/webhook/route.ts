import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * ENV required:
 *  - SQUARE_WEBHOOK_SIGNATURE_KEY  // from Square subscription
 *  - WEBHOOK_PUBLIC_URL            // exact origin you registered, e.g. https://example.com
 *
 * Square signature = base64( HMAC_SHA256( key, url + raw_body ) )
 * Header: x-square-hmacsha256-signature
 */
export async function POST(req: Request) {
  const raw = await req.text();

  const sigHeader =
    req.headers.get("x-square-hmacsha256-signature") ??
    req.headers.get("x-square-signature") ??
    "";

  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || "";
  const baseUrl = process.env.WEBHOOK_PUBLIC_URL || "";
  const fullUrl = `${baseUrl}/api/square/webhook`;

  if (!key || !baseUrl) {
    return NextResponse.json(
      { error: "Missing SQUARE_WEBHOOK_SIGNATURE_KEY or WEBHOOK_PUBLIC_URL" },
      { status: 500 }
    );
  }

  const hmac256 = crypto.createHmac("sha256", key);
  hmac256.update(fullUrl + raw);
  const expected256 = hmac256.digest("base64");

  let verified = timingSafeEq(expected256, sigHeader);

  // Optional legacy fallback
  if (!verified && sigHeader) {
    try {
      const hmac1 = crypto.createHmac("sha1", key);
      hmac1.update(raw);
      const expected1 = hmac1.digest("base64");
      verified = timingSafeEq(expected1, sigHeader);
    } catch { }
  }

  if (!verified) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let evt: any;
  try {
    evt = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const type: string = evt?.type ?? evt?.event_type ?? "";
  if (!type) return NextResponse.json({ ok: true });

  // ---- payment events -------------------------------------------------------
  if (type === "payment.created" || type === "payment.updated") {
    const pay = evt?.data?.object?.payment;
    if (pay) {
      const providerPaymentId = String(pay.id || "");
      const status = String(pay.status || "").toUpperCase(); // APPROVED | COMPLETED | CANCELED | FAILED
      const amount = Number(pay?.amount_money?.amount ?? 0);
      const currency = String(pay?.amount_money?.currency || "").toUpperCase();

      if (currency && currency !== "CAD") {
        return NextResponse.json({ ok: true, note: "ignored-non-CAD" });
      }

      try {
        const existing = await prisma.payment.findUnique({
          where: { providerPaymentId },
        });

        if (existing) {
          await prisma.payment.update({
            where: { id: existing.id },
            data: {
              status: status.toLowerCase(),
              amountCents: amount || existing.amountCents,
              metadata: evt,
            },
          });

          if (status === "COMPLETED") {
            const updatedOrder = await prisma.order.update({
              where: { id: existing.orderId },
              data: { status: "paid" },
              include: {
                items: {
                  include: {
                    product: true,
                  },
                },
              },
            });

            // Send confirmation email
            await sendOrderConfirmation(updatedOrder, updatedOrder.email);
          }

          if (status === "CANCELED" || status === "FAILED") {
            await prisma.order.update({
              where: { id: existing.orderId },
              data: { status: "cancelled" },
            });
          }
        } else {
          // No local Payment row (for example, invoice-only payments).
          // Optionally insert a reconciliation record here.
        }
      } catch {
        // Never 5xx to Square
      }
    }
  }

  // ---- invoice events (ignored for now) ------------------------------------
  if (
    type === "invoice.created" ||
    type === "invoice.updated" ||
    type === "invoice.published" ||
    type === "invoice.canceled" ||
    type === "invoice.payment_made"
  ) {
    // You can extend this block later if you add invoiceId/invoiceState fields.
    return NextResponse.json({ ok: true, note: "invoice-event-ignored" });
  }

  return NextResponse.json({ ok: true });
}

function timingSafeEq(a: string, b: string): boolean {
  try {
    const A = Buffer.from(a);
    const B = Buffer.from(b);
    if (A.length !== B.length) return false;
    return crypto.timingSafeEqual(A, B);
  } catch {
    return false;
  }
}

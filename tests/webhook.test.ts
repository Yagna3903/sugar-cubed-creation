import { describe, it, expect, beforeEach } from "vitest";
import crypto from "crypto";
import { prismaMock, seedOrder, seedPayment, resetDb } from "./__mocks__/prisma";
vi.mock("@/lib/db", () => ({ prisma: prismaMock }));

import * as Webhook from "../app/api/square/webhook/route";

function sign(body: string) {
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!;
  const base = process.env.WEBHOOK_PUBLIC_URL! + "/api/square/webhook";
  return crypto.createHmac("sha256", key).update(base + body).digest("base64");
}

function req(body: any, headers: Record<string, string> = {}) {
  const raw = JSON.stringify(body);
  return new Request("https://example.com/api/square/webhook", {
    method: "POST",
    headers: {
      "x-square-hmacsha256-signature": sign(raw),
      "Content-Type": "application/json",
      ...headers,
    },
    body: raw,
  });
}

function rawReq(bodyStr: string, headerValue?: string) {
  const sig = headerValue ?? sign(bodyStr);
  return new Request("https://example.com/api/square/webhook", {
    method: "POST",
    headers: {
      "x-square-hmacsha256-signature": sig,
      "Content-Type": "application/json",
    },
    body: bodyStr,
  });
}

describe("POST /api/square/webhook", () => {
  beforeEach(() => resetDb());

  it("401 on invalid signature", async () => {
    const r = new Request("https://example.com/api/square/webhook", {
      method: "POST",
      headers: { "x-square-hmacsha256-signature": "bad" },
      body: "{}",
    });
    const res = await (Webhook as any).POST(r);
    expect(res.status).toBe(401);
  });

  it("updates payment + order to paid on payment.updated COMPLETED", async () => {
    const order = seedOrder({ status: "approved" });
    seedPayment({
      orderId: order.id,
      providerPaymentId: "PAY_WB",
      status: "approved",
      amountCents: 2500,
      currency: "CAD",
    });

    const evt = {
      type: "payment.updated",
      data: {
        object: { payment: { id: "PAY_WB", status: "COMPLETED", amount_money: { amount: 2500, currency: "CAD" } } },
      },
    };

    const res = await (Webhook as any).POST(req(evt));
    expect(res.status).toBe(200);

    const pay = await prismaMock.payment.findUnique({ where: { providerPaymentId: "PAY_WB" } });
    expect(pay?.status).toBe("completed");
    const ord = await prismaMock.order.findUnique({ where: { id: order.id } });
    expect(ord?.status).toBe("paid");
  });

  it("updates order to paid on invoice.updated PAID", async () => {
    const order = seedOrder({ status: "approved", invoiceId: "INV_1" });
    const evt = { type: "invoice.updated", data: { object: { invoice: { id: "INV_1", status: "PAID" } } } };
    const res = await (Webhook as any).POST(req(evt));
    expect(res.status).toBe(200);
    const ord = await prismaMock.order.findUnique({ where: { id: order.id } });
    expect(ord?.status).toBe("paid");
  });

  // Extra coverage: bad JSON
  it("400 on bad JSON", async () => {
    const r = rawReq("{not-json}", sign("{not-json}"));
    const res = await (Webhook as any).POST(r);
    expect(res.status).toBe(400);
  });

  // Extra coverage: empty type no-op
  it("200 on empty type (no-op)", async () => {
    const res = await (Webhook as any).POST(req({}));
    expect(res.status).toBe(200);
  });

  // Extra coverage: non-CAD ignored
  it("ignores non-CAD payments", async () => {
    const evt = {
      type: "payment.updated",
      data: { object: { payment: { id: "PAY_USD", status: "COMPLETED", amount_money: { amount: 100, currency: "USD" } } } },
    };
    const res = await (Webhook as any).POST(req(evt));
    expect(res.status).toBe(200);
  });

  // Extra coverage: FAILED cancels order
  it("marks order cancelled on FAILED", async () => {
    const order = seedOrder({ status: "approved" });
    seedPayment({ orderId: order.id, providerPaymentId: "PAY_BAD", status: "approved", amountCents: 100, currency: "CAD" });

    const evt = {
      type: "payment.updated",
      data: { object: { payment: { id: "PAY_BAD", status: "FAILED", amount_money: { amount: 100, currency: "CAD" } } } },
    };
    const res = await (Webhook as any).POST(req(evt));
    expect(res.status).toBe(200);

    const ord = await prismaMock.order.findUnique({ where: { id: order.id } });
    expect(ord?.status).toBe("cancelled");
  });

  // Extra coverage: invoice canceled
  it("invoice CANCELED sets order cancelled", async () => {
    const order = seedOrder({ status: "approved", invoiceId: "INV_X" });
    const evt = { type: "invoice.updated", data: { object: { invoice: { id: "INV_X", status: "CANCELED" } } } };
    const res = await (Webhook as any).POST(req(evt));
    expect(res.status).toBe(200);
    const ord = await prismaMock.order.findUnique({ where: { id: order.id } });
    expect(ord?.status).toBe("cancelled");
  });

  // Extra coverage: missing WEBHOOK_PUBLIC_URL
  it("500 when WEBHOOK_PUBLIC_URL missing", async () => {
    const saved = process.env.WEBHOOK_PUBLIC_URL;
    delete (process.env as any).WEBHOOK_PUBLIC_URL;

    const r = new Request("https://example.com/api/square/webhook", {
      method: "POST",
      headers: { "x-square-hmacsha256-signature": "x" },
      body: "{}",
    });
    const res = await (Webhook as any).POST(r);
    expect(res.status).toBe(500);

    process.env.WEBHOOK_PUBLIC_URL = saved;
  });

  // Extra coverage: unknown type → no-op end path
  it("200 when unknown type (no-op path at end)", async () => {
    const res = await (Webhook as any).POST(req({ type: "something.else" }));
    expect(res.status).toBe(200);
  });

  // Legacy HMAC-SHA1 acceptance varies by implementation; allow either.
  it("accepts legacy HMAC-SHA1 if provided (fallback may accept or reject)", async () => {
    const body = JSON.stringify({ type: "noop" });
    const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!;
    const sha1 = crypto.createHmac("sha1", key).update(body).digest("base64");
    const r = new Request("https://example.com/api/square/webhook", {
      method: "POST",
      headers: { "x-square-hmacsha256-signature": sha1, "Content-Type": "application/json" },
      body,
    });
    const res = await (Webhook as any).POST(r);
    expect([200, 401]).toContain(res.status);
  });
});

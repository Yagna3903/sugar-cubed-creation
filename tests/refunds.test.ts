import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock, seedOrder, seedPayment, resetDb } from "./__mocks__/prisma";
vi.mock("@/lib/db", () => ({ prisma: prismaMock }));

import * as RefundRoute from "../app/api/admin/payments/[paymentId]/refund/route";

const req = (paymentId: string, json: any) =>
  ([
    new Request(`http://localhost/api/admin/payments/${paymentId}/refund`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    }),
    { params: { paymentId } } as any,
  ] as const);

describe("POST /api/admin/payments/[paymentId]/refund", () => {
  beforeEach(() => {
    resetDb();
    vi.restoreAllMocks();
  });

  it("404 if payment not found", async () => {
    const [r, p] = req("NOPE", { amountCents: 100 });
    const res = await (RefundRoute as any).POST(r, p);
    expect(res.status).toBe(404);
  });

  it("400 if not refundable state", async () => {
    const order = seedOrder({ status: "paid" });
    seedPayment({ orderId: order.id, providerPaymentId: "PAY_A", status: "approved", amountCents: 500 });
    const [r, p] = req("PAY_A", { amountCents: 500 });
    const res = await (RefundRoute as any).POST(r, p);
    expect(res.status).toBe(400);
  });

  it("400 if bad amount", async () => {
    const order = seedOrder({ status: "paid" });
    seedPayment({ orderId: order.id, providerPaymentId: "PAY_B", status: "completed", amountCents: 1000 });
    const [r, p] = req("PAY_B", { amountCents: 0 });
    const res = await (RefundRoute as any).POST(r, p);
    expect(res.status).toBe(400);
  });

  it("200 on refund + sets payment.refunded + order.refunded if full", async () => {
    const order = seedOrder({ status: "paid" });
    const pay = seedPayment({
      orderId: order.id,
      providerPaymentId: "PAY_OK",
      status: "completed",
      amountCents: 1500,
      currency: "CAD",
    });
    (global.fetch as any) = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ refund: { id: "RF_1", status: "APPROVED" } }),
    });
    const [r, p] = req("PAY_OK", { amountCents: 1500, reason: "Order cancel" });
    const res = await (RefundRoute as any).POST(r, p);
    expect(res.status).toBe(200);
    const updatedPay = await prismaMock.payment.findUnique({ where: { id: pay.id } });
    expect(updatedPay?.status).toBe("refunded");
    const updatedOrder = await prismaMock.order.findUnique({ where: { id: order.id } });
    expect(updatedOrder?.status).toBe("refunded");
  });

  // Extra coverage: missing token
  it("500 when SQUARE_ACCESS_TOKEN missing on refund", async () => {
    const prev = process.env.SQUARE_ACCESS_TOKEN;
    delete (process.env as any).SQUARE_ACCESS_TOKEN;

    const order = seedOrder({ status: "paid" });
    seedPayment({ orderId: order.id, providerPaymentId: "PAY_R", status: "completed", amountCents: 300 });

    const [r, p] = req("PAY_R", { amountCents: 100 });
    const res = await (RefundRoute as any).POST(r, p);
    expect(res.status).toBe(500);

    process.env.SQUARE_ACCESS_TOKEN = prev;
  });

  // Extra coverage: upstream error
  it("propagates upstream error on refund", async () => {
    const order = seedOrder({ status: "paid" });
    seedPayment({ orderId: order.id, providerPaymentId: "PAY_R2", status: "completed", amountCents: 300 });

    (global.fetch as any) = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 402,
      json: async () => ({ errors: [{ code: "PAYMENT_NOT_REFUNDABLE" }] }),
    });

    const [r, p] = req("PAY_R2", { amountCents: 200 });
    const res = await (RefundRoute as any).POST(r, p);
    expect(res.status).toBe(402);
  });

  // Extra coverage: partial refund should not mark order refunded
  it("partial refund does not set order.refunded", async () => {
    const order = seedOrder({ status: "paid" });
    seedPayment({
      orderId: order.id,
      providerPaymentId: "PAY_PART",
      status: "completed",
      amountCents: 1000,
      currency: "CAD",
    });

    (global.fetch as any) = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ refund: { id: "RF_PART", status: "APPROVED" } }),
    });

    const [r, p] = req("PAY_PART", { amountCents: 200, reason: "Partial" });
    const res = await (RefundRoute as any).POST(r, p);
    expect(res.status).toBe(200);

    const ord = await prismaMock.order.findUnique({ where: { id: order.id } });
    expect(ord?.status).toBe("paid");
  });
});

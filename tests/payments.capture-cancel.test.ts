import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock, seedOrder, seedPayment, resetDb } from "./__mocks__/prisma";
vi.mock("@/lib/db", () => ({ prisma: prismaMock }));

import * as Route from "../app/api/admin/payments/[paymentId]/capture/route";

const req = (paymentId: string, action: "capture" | "cancel") =>
  ([
    new Request(`http://localhost/api/admin/payments/${paymentId}/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    }),
    { params: { paymentId } } as any,
  ] as const);

describe("POST /api/admin/payments/[paymentId]/capture (supports cancel via action)", () => {
  beforeEach(() => {
    resetDb();
    vi.restoreAllMocks();
  });

  it("400 if action invalid", async () => {
    const [r, p] = [
      new Request("http://x", { method: "POST", body: JSON.stringify({ action: "noop" }) }),
      { params: { paymentId: "P" } } as any,
    ] as const;
    const res = await (Route as any).POST(r, p);
    expect(res.status).toBe(400);
  });

  it("404 if payment not found", async () => {
    const [r, p] = req("NOPE", "capture");
    const res = await (Route as any).POST(r, p);
    expect(res.status).toBe(404);
  });

  it("capture short-circuits when already completed", async () => {
    const order = seedOrder({ status: "paid" });
    seedPayment({ orderId: order.id, providerPaymentId: "PAY_X", status: "completed" });
    const [r, p] = req("PAY_X", "capture");
    const res = await (Route as any).POST(r, p);
    expect(res.status).toBe(200);
  });

  it("capture success updates payment + order", async () => {
    const order = seedOrder({ status: "approved" });
    seedPayment({ orderId: order.id, providerPaymentId: "PAY_1", status: "approved", amountCents: 2500 });
    (global.fetch as any) = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ payment: { id: "PAY_1", status: "COMPLETED" } }),
    });
    const [r, p] = req("PAY_1", "capture");
    const res = await (Route as any).POST(r, p);
    expect(res.status).toBe(200);
    const pay = await prismaMock.payment.findUnique({ where: { providerPaymentId: "PAY_1" } });
    expect(pay?.status).toBe("completed");
    const ord = await prismaMock.order.findUnique({ where: { id: order.id } });
    expect(ord?.status).toBe("paid");
  });

  it("cancel success updates payment + order", async () => {
    const order = seedOrder({ status: "approved" });
    seedPayment({ orderId: order.id, providerPaymentId: "PAY_2", status: "approved" });
    (global.fetch as any) = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ payment: { id: "PAY_2", status: "CANCELED" } }),
    });
    const [r, p] = req("PAY_2", "cancel");
    const res = await (Route as any).POST(r, p);
    expect(res.status).toBe(200);
    const pay = await prismaMock.payment.findUnique({ where: { providerPaymentId: "PAY_2" } });
    expect(pay?.status).toBe("cancelled");
    const ord = await prismaMock.order.findUnique({ where: { id: order.id } });
    expect(ord?.status).toBe("cancelled");
  });

  // Extra coverage: missing access token
  it("500 when SQUARE_ACCESS_TOKEN missing", async () => {
    const prev = process.env.SQUARE_ACCESS_TOKEN;
    delete (process.env as any).SQUARE_ACCESS_TOKEN;
    const [r, p] = req("ANY", "capture");
    const res = await (Route as any).POST(r, p);
    expect(res.status).toBe(500);
    process.env.SQUARE_ACCESS_TOKEN = prev;
  });

  // Extra coverage: upstream error on capture
  it("propagates upstream error on capture", async () => {
    const order = seedOrder({ status: "approved" });
    seedPayment({ orderId: order.id, providerPaymentId: "PAY_ERR", status: "approved" });
    (global.fetch as any) = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({ errors: [{ code: "CONFLICT" }] }),
    });
    const [r, p] = req("PAY_ERR", "capture");
    const res = await (Route as any).POST(r, p);
    expect(res.status).toBe(409);
  });

  // Extra coverage: upstream error on cancel
  it("propagates upstream error on cancel", async () => {
    const order = seedOrder({ status: "approved" });
    seedPayment({ orderId: order.id, providerPaymentId: "PAY_ERR2", status: "approved" });
    (global.fetch as any) = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 502,
      json: async () => ({ errors: [{ code: "UPSTREAM_FAILURE" }] }),
    });
    const [r, p] = req("PAY_ERR2", "cancel");
    const res = await (Route as any).POST(r, p);
    expect(res.status).toBe(502);
  });
});

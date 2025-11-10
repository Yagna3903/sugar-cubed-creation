import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock, seedOrder, resetDb } from "./__mocks__/prisma";

vi.mock("@/lib/db", () => ({ prisma: prismaMock }));
vi.mock("@/lib/server/email", () => ({
  sendInvoiceEmail: vi.fn().mockResolvedValue({ ok: true }),
}));

import * as PayRoute from "../app/api/square/pay/route";

const req = (json: any) =>
  new Request("http://localhost/api/square/pay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json),
  });

describe("POST /api/square/pay", () => {
  beforeEach(() => {
    resetDb();
    vi.restoreAllMocks();
  });

  it("400 if missing sourceId or orderId", async () => {
    const res = await PayRoute.POST(req({ sourceId: "tok" }));
    expect(res.status).toBe(400);
  });

  it("404 if order not found", async () => {
    const res = await PayRoute.POST(req({ sourceId: "tok", orderId: "nope" }));
    expect(res.status).toBe(404);
  });

  it("409 if payment already authorized", async () => {
    const order = seedOrder({ status: "approved" });
    await prismaMock.payment.create({
      data: { orderId: order.id, status: "approved", amountCents: order.totalCents },
    });
    const res = await PayRoute.POST(req({ sourceId: "tok", orderId: order.id }));
    expect(res.status).toBe(409);
  });

  it("400 if Square returns non-CAD", async () => {
    const order = seedOrder({ status: "pending", totalCents: 1999 });
    (global.fetch as any) = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        payment: {
          id: "PAY_1",
          status: "APPROVED",
          amount_money: { amount: 1999, currency: "USD" },
        },
      }),
    });
    const res = await PayRoute.POST(req({ sourceId: "tok", orderId: order.id }));
    expect(res.status).toBe(400);
  });

  it("200 + persists payment and order approved", async () => {
    const order = seedOrder({ status: "pending", totalCents: 2500 });
    (global.fetch as any) = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        payment: {
          id: "PAY_OK",
          status: "APPROVED",
          amount_money: { amount: 2500, currency: "CAD" },
          receipt_url: "https://example/receipt",
          card_details: { card: { card_brand: "VISA", last_4: "4242" } },
        },
      }),
    });
    const res = await PayRoute.POST(req({ sourceId: "tok", orderId: order.id }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ success: true, paymentId: "PAY_OK" });
    const saved = await prismaMock.payment.findUnique({
      where: { providerPaymentId: "PAY_OK" },
    });
    expect(saved?.status).toBe("approved");
    const ord = await prismaMock.order.findUnique({ where: { id: order.id } });
    expect(ord?.status).toBe("approved");
  });

  it("propagates Square error", async () => {
    const order = seedOrder();
    (global.fetch as any) = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 402,
      json: async () => ({ errors: [{ code: "CARD_DECLINED" }] }),
    });
    const res = await PayRoute.POST(req({ sourceId: "tok", orderId: order.id }));
    expect(res.status).toBeGreaterThanOrEqual(400);
    const b = await res.json();
    expect(b.code).toBe("CARD_DECLINED");
  });

  // Extra coverage: missing access token
  it("500 when missing SQUARE_ACCESS_TOKEN", async () => {
    const prev = process.env.SQUARE_ACCESS_TOKEN;
    delete (process.env as any).SQUARE_ACCESS_TOKEN;

    const order = seedOrder();
    const res = await PayRoute.POST(req({ sourceId: "tok", orderId: order.id }));
    expect(res.status).toBe(500);

    process.env.SQUARE_ACCESS_TOKEN = prev;
  });

  // Extra coverage: missing location id
  it("500 when missing SQUARE_LOCATION_ID", async () => {
    const prev1 = process.env.SQUARE_LOCATION_ID;
    const prev2 = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
    delete (process.env as any).SQUARE_LOCATION_ID;
    delete (process.env as any).NEXT_PUBLIC_SQUARE_LOCATION_ID;

    const order = seedOrder();
    const res = await PayRoute.POST(req({ sourceId: "tok", orderId: order.id }));
    expect(res.status).toBe(500);

    process.env.SQUARE_LOCATION_ID = prev1;
    process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID = prev2;
  });

  // Extra coverage: already paid
  it("200 early-exit when order already paid", async () => {
    const order = seedOrder({ status: "paid" });
    const res = await PayRoute.POST(req({ sourceId: "tok", orderId: order.id }));
    expect(res.status).toBe(200);
    const b = await res.json();
    expect(b.message).toMatch(/Already paid/);
  });

  // Extra coverage: thrown upstream error
  it("502 on thrown upstream error", async () => {
    const order = seedOrder({ status: "pending" });
    (global.fetch as any) = vi.fn().mockImplementationOnce(() => {
      throw new Error("boom");
    });
    const res = await PayRoute.POST(req({ sourceId: "tok", orderId: order.id }));
    expect(res.status).toBe(502);
  });

  // Extra coverage: email ok:false
  it("logs when sendInvoiceEmail returns ok:false", async () => {
    const order = seedOrder({ status: "pending", totalCents: 999 });
    (global.fetch as any) = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        payment: { id: "PAY_MAIL_BAD", status: "APPROVED", amount_money: { amount: 999, currency: "CAD" } },
      }),
    });

    const emailMod: any = await import("@/lib/server/email");
    emailMod.sendInvoiceEmail.mockResolvedValueOnce({ ok: false });

    const res = await PayRoute.POST(req({ sourceId: "tok", orderId: order.id }));
    expect(res.status).toBe(200);
  });

  // Extra coverage: email throws
  it("catches when sendInvoiceEmail throws", async () => {
    const order = seedOrder({ status: "pending", totalCents: 777 });
    (global.fetch as any) = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        payment: { id: "PAY_MAIL_THROW", status: "APPROVED", amount_money: { amount: 777, currency: "CAD" } },
      }),
    });

    const emailMod: any = await import("@/lib/server/email");
    emailMod.sendInvoiceEmail.mockImplementationOnce(() => {
      throw new Error("smtp down");
    });

    const res = await PayRoute.POST(req({ sourceId: "tok", orderId: order.id }));
    expect(res.status).toBe(200);
  });
});

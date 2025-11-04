import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = { orderId: string; dueInDays?: number };

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Partial<Body>;
  const orderId = String(body.orderId || "");
  const dueInDays =
    typeof body.dueInDays === "number" && Number.isFinite(body.dueInDays)
      ? body.dueInDays
      : 7;

  if (!orderId)
    return NextResponse.json({ error: "orderId required" }, { status: 400 });

  // Load local order with items + product names
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });
  if (!order)
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (!order.email)
    return NextResponse.json({ error: "Order has no email" }, { status: 400 });
  if (!order.items.length)
    return NextResponse.json({ error: "Order has no items" }, { status: 400 });

  // Square env
  const token = process.env.SQUARE_ACCESS_TOKEN;
  const locationId =
    process.env.SQUARE_LOCATION_ID ??
    process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ??
    "";
  const base =
    process.env.SQUARE_API_BASE_URL ?? "https://connect.squareupsandbox.com";
  const version = process.env.SQUARE_API_VERSION ?? "2025-08-20";
  if (!token)
    return NextResponse.json(
      { error: "SQUARE_ACCESS_TOKEN not set" },
      { status: 500 }
    );
  if (!locationId)
    return NextResponse.json(
      { error: "SQUARE_LOCATION_ID not set" },
      { status: 500 }
    );

  const H = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "Square-Version": version,
  };

  // 1) Ensure Square Customer
  const customerId = await getOrCreateCustomer({
    email: order.email!,
    name: order.customerName ?? undefined,
    base,
    headers: H,
  });

  // 2) Create a Square Order (required for invoices)
  const sqOrderRes = await fetch(`${base}/v2/orders`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({
      idempotency_key: `sqo-${orderId}-${crypto.randomUUID()}`,
      order: {
        location_id: locationId,
        line_items: order.items.map((it) => ({
          name: it.product?.name ?? it.productId,
          quantity: String(it.qty),
          base_price_money: { amount: it.unitPriceCents, currency: "CAD" },
        })),
      },
    }),
  });
  const sqOrderJson = await sqOrderRes.json();
  if (!sqOrderRes.ok)
    return NextResponse.json(
      { error: sqOrderJson },
      { status: sqOrderRes.status }
    );
  const sqOrderId = sqOrderJson?.order?.id as string;

  // 3) Create a DRAFT invoice tied to that Square order
  const dueDateISO = new Date(Date.now() + dueInDays * 86400_000)
    .toISOString()
    .slice(0, 10);
  const invCreateRes = await fetch(`${base}/v2/invoices`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({
      idempotency_key: `inv-${orderId}`,
      invoice: {
        location_id: locationId,
        order_id: sqOrderId,
        delivery_method: "EMAIL",
        primary_recipient: { customer_id: customerId },
        payment_requests: [{ request_type: "BALANCE", due_date: dueDateISO }],
        title: "Invoice for your order",
      },
    }),
  });
  const invCreateJson = await invCreateRes.json();
  if (!invCreateRes.ok)
    return NextResponse.json(
      { error: invCreateJson },
      { status: invCreateRes.status }
    );

  // 4) Publish invoice (emails the customer)
  const invId = invCreateJson?.invoice?.id as string;
  const invVersion = invCreateJson?.invoice?.version as number;
  const publishRes = await fetch(`${base}/v2/invoices/${invId}/publish`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({
      idempotency_key: `inv-publish-${orderId}`,
      version: invVersion,
    }),
  });
  const publishJson = await publishRes.json();
  if (!publishRes.ok)
    return NextResponse.json(
      { error: publishJson },
      { status: publishRes.status }
    );

  const publicUrl = publishJson?.invoice?.public_url as string | undefined;
  const invoiceStatus = publishJson?.invoice?.status as string | undefined;

  // 5) Persist identifiers (if your schema has these fields)
  try {
    await (prisma as any).order.update({
      where: { id: orderId },
      data: {
        invoiceId: invId,
        invoiceUrl: publicUrl,
        invoiceState: invoiceStatus,
      },
    });
  } catch {
    // Ignore if those columns don’t exist
  }

  return NextResponse.json(
    { ok: true, invoiceId: invId, status: invoiceStatus, publicUrl },
    { status: 200 }
  );
}

/** Search by email; create customer if not found. */
async function getOrCreateCustomer(args: {
  email: string;
  name?: string;
  base: string;
  headers: Record<string, string>;
}): Promise<string> {
  const { email, name, base, headers } = args;

  const searchRes = await fetch(`${base}/v2/customers/search`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: { filter: { email_address: { exact: email } } },
    }),
  });
  const searchJson = await searchRes.json();
  const found = Array.isArray(searchJson?.customers)
    ? searchJson.customers[0]
    : null;
  if (found?.id) return found.id as string;

  const [givenName, ...rest] = (name ?? "").trim().split(" ");
  const createRes = await fetch(`${base}/v2/customers`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email_address: email,
      given_name: givenName || undefined,
      family_name: rest.join(" ") || undefined,
      idempotency_key: `cust-${email}`,
    }),
  });
  const createJson = await createRes.json();
  if (!createRes.ok) throw new Error(JSON.stringify(createJson));
  return createJson?.customer?.id as string;
}

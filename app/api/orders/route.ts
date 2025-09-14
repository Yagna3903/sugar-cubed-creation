import { NextResponse } from "next/server";
import { CreateOrderInput /*, type CreateOrder*/ } from "@/lib/server/validators";
import { prisma } from "@/lib/db";
// Removed $Enums import as it is not exported by @prisma/client

export async function POST(req: Request) {
  // 1) Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 2) Validate
  const parsed = CreateOrderInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  // If you exported `type CreateOrder`, you can uncomment this cast:
  // const { customer, items } = parsed.data as CreateOrder;
  const { customer, items } = parsed.data;

  // 3) Fetch product prices from DB
  const ids = items.map((i) => i.id);
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: ids }, active: true },
    select: { id: true, priceCents: true },
  });
  if (dbProducts.length !== ids.length) {
    const found = new Set<string>(dbProducts.map((p: { id: string }) => p.id));
    const missing = ids.filter((id) => !found.has(id));
    return NextResponse.json(
      { error: `Products not found: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  // ✅ Type the map callback param to avoid "implicitly any"
  const priceMap = new Map<string, number>(
    dbProducts.map(
      (p: { id: string; priceCents: number }) =>
        [p.id, p.priceCents] as [string, number]
    )
  );

  // 4) Compute total + build items safely
  let totalCents = 0;
  const orderItemsData = items.map((it) => {
    const unitPrice = priceMap.get(it.id);
    if (unitPrice == null) throw new Error(`Price missing for product ${it.id}`);
    totalCents += unitPrice * it.qty;
    return { productId: it.id, qty: it.qty, unitPriceCents: unitPrice };
  });

  // 5) Create order (use Prisma enum via $Enums)
  const order = await prisma.order.create({
    data: {
      email: customer.email,
      customerName: customer.name,
      status: "pending", // Use string literal for the status
      totalCents,
      items: { create: orderItemsData },
    },
    select: { id: true },
  });

  // 6) Return absolute success URL
  const origin = new URL(req.url).origin;
  const checkoutUrl =
    `${origin}/checkout/success` +
    `?orderId=${encodeURIComponent(order.id)}` +
    `&name=${encodeURIComponent(customer.name)}` +
    `&email=${encodeURIComponent(customer.email)}` +
    `&total=${encodeURIComponent((totalCents / 100).toFixed(2))}`;

  return NextResponse.json({ orderId: order.id, checkoutUrl });
}

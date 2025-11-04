import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Stub: we'll verify Square signatures and update order/payment later
  // when the database layer is added.
  const text = await req.text().catch(() => "");
  console.log("[square.webhook] received:", text.slice(0, 500));
  return NextResponse.json({ ok: true });
}

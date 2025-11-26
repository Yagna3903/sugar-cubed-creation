// app/api/products/route.ts
import { NextResponse } from "next/server";
import { listProducts } from "@/lib/server/products";

/**
 * Public API – list active products for the storefront.
 * Uses the shared server-side mapping so UI and API stay in sync.
 */
export async function GET() {
  // listProducts returns the `Product` type from lib/types.ts
  const products = await listProducts();
  return NextResponse.json(products);
}

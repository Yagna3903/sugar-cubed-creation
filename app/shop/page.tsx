// app/shop/page.tsx
import ShopClient from "@/components/shop-client";
import { listProducts } from "@/lib/server/products";
export const dynamic = "force-dynamic";
export const revalidate = 30; // refresh every 30s


export default async function ShopPage() {
  const products = await listProducts(); // ← fetch from Postgres via Prisma

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">Shop</h1>
      <ShopClient products={products} />
    </section>
  );
}

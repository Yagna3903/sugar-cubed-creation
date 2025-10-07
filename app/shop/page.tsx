// app/shop/page.tsx
import ShopClient from "@/components/shop-client";
import { listProducts } from "@/lib/server/products";

// Force this page to always run on the server (no static cache)
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await listProducts(); // Prisma query – always fresh

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Shop</h1>
      {products.length === 0 ? (
        <p className="text-zinc-600">No products available right now.</p>
      ) : (
        <ShopClient products={products} />
      )}
    </section>
  );
}

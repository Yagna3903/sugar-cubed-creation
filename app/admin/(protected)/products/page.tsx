// app/admin/(protected)/products/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteProduct } from "./actions";

export default async function ProductsListPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { inventory: true },
  });

  // Type for one element of the array returned by findMany
  type ProductRow = (typeof products)[number];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-xl bg-brand-brown px-4 py-2 text-white"
        >
          New product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-zinc-600">No products yet.</p>
      ) : (
        <div className="divide-y rounded-2xl border bg-white">
          {products.map((p: ProductRow) => (
            <div key={p.id} className="grid grid-cols-12 items-center gap-4 p-4">
              <div className="col-span-6 flex items-center gap-3">
                <img
                  src={p.imageUrl || "/images/Main-Cookie.png"}
                  alt={p.name}
                  className="h-12 w-12 rounded object-cover border"
                />
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-zinc-500">{p.slug}</div>
                </div>
              </div>
              <div className="col-span-2 text-sm">
                ${(p.priceCents / 100).toFixed(2)}
              </div>
              <div className="col-span-2 text-sm">
                {p.inventory?.stock ?? 0} in stock
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                <Link
                  className="rounded-xl border px-3 py-1.5 text-sm"
                  href={`/admin/products/${p.id}`}
                >
                  Edit
                </Link>
                <form action={deleteProduct.bind(null, p.id)}>
                  <button className="rounded-xl border px-3 py-1.5 text-sm text-red-700">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

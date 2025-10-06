// app/admin/(protected)/products/page.tsx
import Link from "next/link";
import Image from "next/image";
import BackLink from "@/app/admin/_components/BackLink";
import { prisma } from "@/lib/db";
import {
  archiveProduct,
  restoreProduct,
  forceDeleteProduct,
} from "./actions";

type PageProps = { searchParams?: { status?: string } };

export default async function ProductsListPage({ searchParams }: PageProps) {
  const statusParam = (searchParams?.status ?? "active").toLowerCase();
  const status: "all" | "active" | "archived" =
    statusParam === "all" || statusParam === "archived"
      ? (statusParam as any)
      : "active";

  const where = status === "all" ? {} : { active: status === "active" };

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { inventory: true },
  });
  type ProductRow = (typeof products)[number];

  const Filter = ({
    href,
    label,
    active,
  }: {
    href: string;
    label: string;
    active: boolean;
  }) => (
    <Link
      href={href}
      className={[
        "rounded-full border px-3 py-1.5 text-sm transition",
        active
          ? "bg-zinc-900 text-white border-zinc-900"
          : "bg-white hover:bg-zinc-50",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );

  return (
    <div>
      <BackLink href="/admin">Back to Admin</BackLink>

      <div className="mb-4 mt-3 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Products</h1>

        <nav className="flex items-center gap-2" aria-label="Filter products">
          <Filter
            href="/admin/products?status=all"
            label="All"
            active={status === "all"}
          />
          <Filter
            href="/admin/products?status=active"
            label="Active"
            active={status === "active"}
          />
          <Filter
            href="/admin/products?status=archived"
            label="Archived"
            active={status === "archived"}
          />
        </nav>

        <Link
          href="/admin/products/new"
          className="rounded-xl bg-brand-brown px-4 py-2 text-white"
        >
          New product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-zinc-600">
          {status === "active"
            ? "No active products."
            : status === "archived"
            ? "No archived products."
            : "No products yet."}
        </p>
      ) : (
        <div className="divide-y rounded-2xl border bg-white">
          {products.map((p: ProductRow) => (
            <div
              key={p.id}
              className="grid grid-cols-12 items-center gap-4 p-4"
            >
              {/* Product thumbnail + name */}
              <div className="col-span-6 flex items-center gap-3">
                <Image
                  src={p.imageUrl || "/images/Main-Cookie.png"}
                  alt={p.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded object-cover border"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{p.name}</div>
                    <span
                      className={[
                        "rounded-full px-2 py-0.5 text-xs",
                        p.active
                          ? "bg-green-100 text-green-800"
                          : "bg-zinc-100 text-zinc-700",
                      ].join(" ")}
                    >
                      {p.active ? "Active" : "Archived"}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500">{p.slug}</div>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-2 text-sm">
                ${(p.priceCents / 100).toFixed(2)}
              </div>

              {/* Stock */}
              <div className="col-span-2 text-sm">
                {p.inventory?.stock ?? 0} in stock
              </div>

              {/* Actions */}
              <div className="col-span-2 flex justify-end gap-2">
                <Link
                  className="rounded-xl border px-3 py-1.5 text-sm"
                  href={`/admin/products/${p.id}`}
                >
                  Edit
                </Link>

                {p.active ? (
                  <form action={archiveProduct.bind(null, p.id)}>
                    <button className="rounded-xl border px-3 py-1.5 text-sm text-zinc-700">
                      Archive
                    </button>
                  </form>
                ) : (
                  <>
                    <form action={restoreProduct.bind(null, p.id)}>
                      <button className="rounded-xl border px-3 py-1.5 text-sm text-zinc-700">
                        Restore
                      </button>
                    </form>
                    <form action={forceDeleteProduct.bind(null, p.id)}>
                      <button className="rounded-xl border px-3 py-1.5 text-sm text-red-700">
                        Delete permanently
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

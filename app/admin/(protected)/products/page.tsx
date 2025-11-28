// app/admin/(protected)/products/page.tsx

export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import BackLink from "@/app/admin/_components/BackLink";
import StatusBadge from "@/app/admin/_components/StatusBadge";
import EmptyState from "@/app/admin/_components/EmptyState";
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
        "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
        active
          ? "bg-brand-brown text-white border-brand-brown shadow-sm"
          : "bg-white hover:bg-zinc-50 border-zinc-200 hover:border-zinc-300",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <BackLink href="/admin" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-zinc-900">Products</h1>
          <p className="text-zinc-600 mt-1">
            Manage your product catalog and inventory
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="rounded-xl bg-gradient-to-r from-brand-brown to-brand-brown/90 px-6 py-3 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 active:scale-95 flex items-center gap-2"
        >
          <span className="text-lg">+</span>
          New Product
        </Link>
      </div>

      {/* Filters */}
      <nav className="flex items-center gap-3" aria-label="Filter products">
        <Filter
          href="/admin/products?status=all"
          label={`All (${products.length})`}
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

      {/* Products List */}
      {products.length === 0 ? (
        <EmptyState
          icon="🍪"
          title={
            status === "active"
              ? "No active products"
              : status === "archived"
                ? "No archived products"
                : "No products yet"
          }
          description={
            status === "active"
              ? "Start building your product catalog by adding your first delicious creation!"
              : status === "archived"
                ? "You haven't archived any products yet."
                : "Get started by creating your first product."
          }
          actionLabel={status === "active" ? "Create First Product" : undefined}
          actionHref={status === "active" ? "/admin/products/new" : undefined}
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-soft border border-zinc-100 overflow-hidden">
          {products.map((p: ProductRow, index) => {
            const stock = p.inventory?.stock ?? 0;
            const stockColor =
              stock === 0
                ? "text-red-600"
                : stock < 10
                  ? "text-amber-600"
                  : "text-green-600";

            return (
              <div
                key={p.id}
                className={`grid grid-cols-12 items-center gap-4 p-4 hover:bg-zinc-50 transition-colors duration-150 ${index !== products.length - 1 ? "border-b border-zinc-100" : ""
                  }`}
              >
                {/* Product thumbnail + name */}
                <div className="col-span-12 sm:col-span-6 flex items-center gap-4">
                  <div className="relative">
                    <Image
                      src={p.imageUrl || "/images/Main-Cookie.png"}
                      alt={p.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-xl object-cover border-2 border-zinc-100 shadow-sm"
                    />
                    {!p.active && (
                      <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Archived</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="font-semibold text-zinc-900 hover:text-brand-brown transition-colors truncate"
                      >
                        {p.name}
                      </Link>
                      <StatusBadge status={p.active ? "active" : "archived"} />
                    </div>
                    <div className="text-xs text-zinc-500">{p.slug}</div>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-6 sm:col-span-2">
                  <p className="text-sm font-semibold text-zinc-900">
                    ${(p.priceCents / 100).toFixed(2)}
                  </p>
                  <p className="text-xs text-zinc-500">Price</p>
                </div>

                {/* Stock */}
                <div className="col-span-6 sm:col-span-2">
                  <p className={`text-sm font-semibold ${stockColor}`}>
                    {stock}
                  </p>
                  <p className="text-xs text-zinc-500">In stock</p>
                </div>

                {/* Actions */}
                <div className="col-span-12 sm:col-span-2 flex justify-end gap-2">
                  <Link
                    className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 hover:border-zinc-400 transition-all duration-150"
                    href={`/admin/products/${p.id}`}
                  >
                    Edit
                  </Link>

                  {p.active ? (
                    <form action={archiveProduct.bind(null, p.id)}>
                      <button className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400 transition-all duration-150">
                        Archive
                      </button>
                    </form>
                  ) : (
                    <>
                      <form action={restoreProduct.bind(null, p.id)}>
                        <button className="rounded-xl border border-green-300 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100 transition-all duration-150">
                          Restore
                        </button>
                      </form>
                      <form action={forceDeleteProduct.bind(null, p.id)}>
                        <button className="rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition-all duration-150">
                          Delete
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

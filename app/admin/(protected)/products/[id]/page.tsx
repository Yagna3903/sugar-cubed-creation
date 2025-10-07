// app/admin/(protected)/products/[id]/page.tsx
import { prisma } from "@/lib/db";
import BackLink from "@/app/admin/_components/BackLink";
import ProductForm from "../_form";
import { updateProduct } from "../actions";

export const dynamic = "force-dynamic";

export default async function ProductEditPage({ params }: { params: { id: string } }) {
  const p = await prisma.product.findUnique({
    where: { id: params.id },
    include: { inventory: true },
  });
  if (!p) return null;

  return (
    <div>
      <BackLink href="/admin/products">Back to Products</BackLink>
      <h1 className="mt-3 text-2xl font-semibold">Edit product</h1>

      <ProductForm
        mode="edit"
        action={updateProduct.bind(null, p.id)}
        initial={{
          id: p.id,
          name: p.name,
          slug: p.slug,
          priceCents: p.priceCents,
          description: p.description ?? "",
          badges: p.badges ?? [],
          active: p.active,
          stock: p.inventory?.stock ?? 0,
          maxPerOrder: p.inventory?.maxPerOrder ?? 12,
          imageUrl: p.imageUrl ?? "",
        }}
      />
    </div>
  );
}

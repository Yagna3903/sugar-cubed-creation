// app/admin/(protected)/products/[id]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ProductForm from "../_form";
import { updateProduct } from "../actions";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const p = await prisma.product.findUnique({
    where: { id: params.id },
    include: { inventory: true },
  });
  if (!p) return notFound();

  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold">Edit product</h1>
      <ProductForm
        mode="edit"
        action={updateProduct.bind(null, p.id) as any}
        initial={{
          id: p.id,
          name: p.name,
          slug: p.slug,
          priceCents: p.priceCents,
          description: p.description,
          badges: p.badges,
          active: p.active,
          stock: p.inventory?.stock ?? 0,
          maxPerOrder: p.inventory?.maxPerOrder ?? 12,
          imageUrl: p.imageUrl ?? undefined,
        }}
      />
    </div>
  );
}

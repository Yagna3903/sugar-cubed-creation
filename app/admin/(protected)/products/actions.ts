// app/admin/(protected)/products/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ProductCreateInput, ProductUpdateInput } from "@/lib/server/validators";
import { uploadProductImage } from "@/lib/storage";
import { requireAdmin } from "@/lib/server/admin"; // you already have this

function toCents(priceStr: string) {
  const n = Number(priceStr);
  if (Number.isNaN(n)) throw new Error("Price must be a number");
  return Math.round(n * 100);
}

export async function createProduct(_: unknown, formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = ProductCreateInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().formErrors.join(", ") || "Invalid input" };
  }

  const { name, slug, price, description, badges, active, stock, maxPerOrder } = parsed.data;

  // 1) create product
  const product = await prisma.product.create({
    data: {
      id: slug, // optional: keep your seed ids separate; or use cuid() if you prefer
      slug,
      name,
      description: description || null,
      priceCents: toCents(price),
      badges,
      active: active ?? true,
      inventory: {
        create: {
          stock: stock ?? 0,
          maxPerOrder: maxPerOrder ?? 12,
        },
      },
    },
  });

  // 2) optional image upload
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const url = await uploadProductImage(file, product.id);
    await prisma.product.update({
      where: { id: product.id },
      data: { imageUrl: url },
    });
  }

  revalidatePath("/admin/products");
  return { ok: true, id: product.id };
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();

  const raw = { ...Object.fromEntries(formData.entries()), id };
  const parsed = ProductUpdateInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().formErrors.join(", ") || "Invalid input" };
  }

  const { name, slug, price, description, badges, active, stock, maxPerOrder } = parsed.data;

  // 1) update product
  const updateData: any = {
    ...(name != null && { name }),
    ...(slug != null && { slug }),
    ...(description !== undefined && { description: description || null }),
    ...(badges != null && { badges }),
    ...(active != null && { active }),
    ...(price != null && { priceCents: toCents(price) }),
    ...(stock != null || maxPerOrder != null
      ? {
          inventory: {
            upsert: {
              create: { stock: stock ?? 0, maxPerOrder: maxPerOrder ?? 12 },
              update: {
                ...(stock != null && { stock }),
                ...(maxPerOrder != null && { maxPerOrder }),
              },
            },
          },
        }
      : {}),
  };

  const product = await prisma.product.update({ where: { id }, data: updateData });

  // 2) optional image replacement
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const url = await uploadProductImage(file, product.id);
    await prisma.product.update({
      where: { id: product.id },
      data: { imageUrl: url },
    });
  }

  revalidatePath("/admin/products");
  return { ok: true, id: product.id };
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  return { ok: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/server/admin";
import {
  ProductCreateInput,
  ProductUpdateInput,
} from "@/lib/server/validators";
import { uploadProductImage } from "@/lib/storage";

function toCents(priceStr: string) {
  const n = Number(priceStr);
  if (Number.isNaN(n)) throw new Error("Price must be a number");
  return Math.round(n * 100);
}

// ✅ Create Product
export async function createProduct(formData: FormData): Promise<void> {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = ProductCreateInput.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      parsed.error.flatten().formErrors.join(", ") || "Invalid input"
    );
  }

  const { name, slug, price, description, badges, active, stock, maxPerOrder } =
    parsed.data;

  const product = await prisma.product.create({
    data: {
      id: slug,
      slug,
      name,
      description: description || null,
      priceCents: toCents(price),
      badges,
      active: active ?? true,
      inventory: {
        create: { stock: stock ?? 0, maxPerOrder: maxPerOrder ?? 12 },
      },
    },
  });

  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const url = await uploadProductImage(file, product.id);
    await prisma.product.update({
      where: { id: product.id },
      data: { imageUrl: url },
    });
  }

  // 🔹 Revalidate both admin and client pages
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/product/${product.slug}`);
  revalidatePath("/");

  redirect("/admin/products");
}

// ✅ Update Product
export async function updateProduct(
  id: string,
  formData: FormData
): Promise<void> {
  await requireAdmin();

  const raw = { ...Object.fromEntries(formData.entries()), id };
  const parsed = ProductUpdateInput.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid input");

  const { name, slug, price, description, badges, active, stock, maxPerOrder } =
    parsed.data;

  const data: any = {
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
              create: {
                stock: stock ?? 0,
                maxPerOrder: maxPerOrder ?? 12,
              },
              update: {
                ...(stock != null && { stock }),
                ...(maxPerOrder != null && { maxPerOrder }),
              },
            },
          },
        }
      : {}),
  };

  const product = await prisma.product.update({ where: { id }, data });

  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const url = await uploadProductImage(file, product.id);
    await prisma.product.update({
      where: { id: product.id },
      data: { imageUrl: url },
    });
  }

  // 🔹 Revalidate both admin and client pages
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/product/${product.slug}`);
  revalidatePath("/");

  redirect("/admin/products");
}

// ✅ Archive Product
export async function archiveProduct(id: string): Promise<void> {
  await requireAdmin();
  const product = await prisma.product.update({
    where: { id },
    data: { active: false },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/product/${product.slug}`);
  revalidatePath("/");
}

// ✅ Restore Product
export async function restoreProduct(id: string): Promise<void> {
  await requireAdmin();
  const product = await prisma.product.update({
    where: { id },
    data: { active: true },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/product/${product.slug}`);
  revalidatePath("/");
}

// ✅ Permanently Delete Product
export async function forceDeleteProduct(id: string): Promise<void> {
  await requireAdmin();
  const refs = await prisma.orderItem.count({ where: { productId: id } });
  if (refs > 0)
    throw new Error("Cannot delete referenced product. Keep it archived.");

  const product = await prisma.product.delete({ where: { id } });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/product/${product.slug}`);
  revalidatePath("/");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductCreateInput, ProductUpdateInput } from "@/lib/server/validators";
import { uploadProductImage } from "@/lib/storage";
import { requireAdmin } from "@/lib/server/admin";

function toCents(priceStr: string) {
  const n = Number(priceStr);
  if (Number.isNaN(n)) throw new Error("Price must be a number");
  return Math.round(n * 100);
}

// ---- helper: detect unique-constraint errors without instanceof
function isUniqueConstraintError(e: unknown): boolean {
  return typeof e === "object" && e !== null && (e as any).code === "P2002";
}

/** CREATE */
export async function createProduct(formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = ProductCreateInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().formErrors.join(", ") || "Invalid input" };
  }

  const { name, slug, price, description, badges, active, stock, maxPerOrder } = parsed.data;

  try {
    const product = await prisma.product.create({
      data: {
        id: slug, // using slug as id per your schema (no default)
        slug,
        name,
        description: description || null,
        priceCents: toCents(price),
        badges,
        active: active ?? true,
        inventory: { create: { stock: stock ?? 0, maxPerOrder: maxPerOrder ?? 12 } },
      },
    });

    const file = formData.get("image") as File | null;
    if (file && file.size > 0) {
      const url = await uploadProductImage(file, product.id);
      await prisma.product.update({ where: { id: product.id }, data: { imageUrl: url } });
    }
  } catch (e) {
    if (isUniqueConstraintError(e)) {
      return { ok: false, error: "That slug already exists. Try a different slug." };
    }
    console.error("createProduct error:", e);
    return { ok: false, error: "Failed to create product." };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

/** UPDATE */
export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();

  const raw = { ...Object.fromEntries(formData.entries()), id };
  const parsed = ProductUpdateInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().formErrors.join(", ") || "Invalid input" };
  }

  const { name, slug, price, description, badges, active, stock, maxPerOrder } = parsed.data;

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

  const product = await prisma.product.update({ where: { id }, data });

  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const url = await uploadProductImage(file, product.id);
    await prisma.product.update({ where: { id: product.id }, data: { imageUrl: url } });
  }

  revalidatePath("/admin/products");
  return { ok: true, id: product.id };
}

/** SOFT DELETE (archive) */
export async function archiveProduct(id: string) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { active: false } });
  revalidatePath("/admin/products");
  return { ok: true };
}

/** RESTORE from archive */
export async function restoreProduct(id: string) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { active: true } });
  revalidatePath("/admin/products");
  return { ok: true };
}

/** HARD DELETE (only if not referenced by orders) */
export async function forceDeleteProduct(id: string) {
  await requireAdmin();

  const refs = await prisma.orderItem.count({ where: { productId: id } });
  if (refs > 0) {
    return { ok: false, error: "Cannot delete: product is referenced by past orders. Keep it archived." };
  }

  await prisma.product.delete({ where: { id } }); // Inventory cascades via schema
  revalidatePath("/admin/products");
  return { ok: true };
}

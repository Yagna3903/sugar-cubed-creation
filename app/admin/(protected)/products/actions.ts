"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/server/admin";
import {
  ProductCreateInput,
  ProductUpdateInput,
} from "@/lib/server/validators";
import { uploadProductImage, deleteImages } from "@/lib/storage";

function toCents(priceStr: string) {
  const n = Number(priceStr);
  if (Number.isNaN(n)) throw new Error("Price must be a number");
  return Math.round(n * 100);
}

// Create Product
export async function createProduct(formData: FormData): Promise<void> {
  await requireAdmin();

  const raw = {
    ...Object.fromEntries(formData.entries()),
    // Checkboxes are missing from FormData when unchecked, so we must check for null
    active: formData.get("active") !== null,
    availableForCorporate: formData.get("availableForCorporate") !== null,
  };
  const images = formData.getAll("images") as string[];
  const parsed = ProductCreateInput.safeParse({ ...raw, images });

  if (!parsed.success) {
    throw new Error(
      parsed.error.flatten().formErrors.join(", ") || "Invalid input"
    );
  }

  const { name, slug, price, description, badges, active, availableForCorporate, stock, maxPerOrder, images: validatedImages } =
    parsed.data;

  // Use the first image as the main imageUrl for backward compatibility
  const mainImageUrl = validatedImages.length > 0 ? validatedImages[0] : null;

  const product = await prisma.product.create({
    data: {
      id: slug,
      slug,
      name,
      description: description || null,
      priceCents: toCents(price),
      badges,
      active: active ?? true,
      availableForCorporate: availableForCorporate ?? false,
      imageUrl: mainImageUrl,
      images: validatedImages,
      inventory: {
        create: { stock: stock ?? 0, maxPerOrder: maxPerOrder ?? 12 },
      },
    } as any, // Type assertion to bypass TS cache issue
  });


  // 🔹 Revalidate both admin and client pages
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/product/${product.slug}`);
  revalidatePath("/");

  redirect("/admin/products");
}

// Update Product
export async function updateProduct(
  id: string,
  formData: FormData
): Promise<void> {
  await requireAdmin();

  // Fetch current product to compare images
  const currentProduct = await prisma.product.findUnique({
    where: { id },
    select: { images: true },
  });

  const raw = {
    ...Object.fromEntries(formData.entries()),
    id,
    // Checkboxes are missing from FormData when unchecked, so we must check for null
    active: formData.get("active") !== null,
    availableForCorporate: formData.get("availableForCorporate") !== null,
  };
  const images = formData.getAll("images") as string[];
  const parsed = ProductUpdateInput.safeParse({ ...raw, images });

  if (!parsed.success) throw new Error("Invalid input");

  const { name, slug, price, description, badges, active, availableForCorporate, stock, maxPerOrder, images: validatedImages } =
    parsed.data;

  // Detect removed images
  if (currentProduct?.images && validatedImages) {
    const removedImages = currentProduct.images.filter(
      (img) => !validatedImages.includes(img)
    );
    if (removedImages.length > 0) {
      // Fire and forget deletion
      deleteImages(removedImages).catch((err) =>
        console.error("Background image deletion failed:", err)
      );
    }
  }

  // Use the first image as the main imageUrl for backward compatibility
  const mainImageUrl = validatedImages && validatedImages.length > 0 ? validatedImages[0] : undefined;

  const data: any = {
    ...(name != null && { name }),
    ...(slug != null && { slug }),
    ...(description !== undefined && { description: description || null }),
    ...(badges != null && { badges }),
    ...(active != null && { active }),
    ...(availableForCorporate != null && { availableForCorporate }),
    ...(price != null && { priceCents: toCents(price) }),
    ...(validatedImages != null && { images: validatedImages }),
    ...(mainImageUrl !== undefined && { imageUrl: mainImageUrl }),
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


  // 🔹 Revalidate both admin and client pages
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/product/${product.slug}`);
  revalidatePath("/");

  return; // No redirect for update to allow toast
}

// Archive Product
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

// Restore Product
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

// Permanently Delete Product
export async function forceDeleteProduct(id: string): Promise<void> {
  await requireAdmin();
  const refs = await prisma.orderItem.count({ where: { productId: id } });
  if (refs > 0)
    throw new Error("Cannot delete referenced product. Keep it archived.");

  const product = await prisma.product.delete({ where: { id } });

  // Clean up storage by deleting specific images
  if (product.images && product.images.length > 0) {
    deleteImages(product.images).catch((err) =>
      console.error("Background storage cleanup failed:", err)
    );
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/product/${product.slug}`);
  revalidatePath("/");
}

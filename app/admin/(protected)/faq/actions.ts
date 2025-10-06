"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/server/admin";
import { FaqCreateInput, FaqUpdateInput } from "@/lib/server/validators";

/** CREATE */
export async function createFaq(formData: FormData): Promise<void> {
  await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  const parsed = FaqCreateInput.safeParse(raw);
  if (!parsed.success) {
    // Instead of returning, throw or redirect with an error if needed
    throw new Error(parsed.error.flatten().formErrors.join(", ") || "Invalid input");
  }
  const { question, answer, active, sort } = parsed.data;

  await prisma.faq.create({
    data: { question, answer, active: active ?? true, sort: sort ?? null },
  });

  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  redirect("/admin/faq");
}

/** UPDATE */
export async function updateFaq(id: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const raw = { ...Object.fromEntries(formData.entries()), id };
  const parsed = FaqUpdateInput.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.flatten().formErrors.join(", ") || "Invalid input");
  }
  const { question, answer, active, sort } = parsed.data;

  await prisma.faq.update({
    where: { id },
    data: {
      ...(question != null && { question }),
      ...(answer != null && { answer }),
      ...(active != null && { active }),
      ...(sort !== undefined && { sort: sort ?? null }),
    },
  });

  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}

/** SOFT DELETE (archive) */
export async function archiveFaq(id: string): Promise<void> {
  await requireAdmin();
  await prisma.faq.update({ where: { id }, data: { active: false } });
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}

/** RESTORE */
export async function restoreFaq(id: string): Promise<void> {
  await requireAdmin();
  await prisma.faq.update({ where: { id }, data: { active: true } });
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}

/** HARD DELETE */
export async function deleteFaq(id: string): Promise<void> {
  await requireAdmin();
  await prisma.faq.delete({ where: { id } });
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}

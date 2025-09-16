"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/server/admin";
import { FaqCreateInput, FaqUpdateInput } from "@/lib/server/validators";

/** CREATE */
export async function createFaq(formData: FormData) {
  await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  const parsed = FaqCreateInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().formErrors.join(", ") || "Invalid input" };
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
export async function updateFaq(id: string, formData: FormData) {
  await requireAdmin();
  const raw = { ...Object.fromEntries(formData.entries()), id };
  const parsed = FaqUpdateInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().formErrors.join(", ") || "Invalid input" };
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
  return { ok: true };
}

/** SOFT DELETE (archive) */
export async function archiveFaq(id: string) {
  await requireAdmin();
  await prisma.faq.update({ where: { id }, data: { active: false } });
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  return { ok: true };
}

/** RESTORE */
export async function restoreFaq(id: string) {
  await requireAdmin();
  await prisma.faq.update({ where: { id }, data: { active: true } });
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  return { ok: true };
}

/** HARD DELETE */
export async function deleteFaq(id: string) {
  await requireAdmin();
  await prisma.faq.delete({ where: { id } });
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  return { ok: true };
}

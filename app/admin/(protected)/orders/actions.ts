"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/server/admin";
import { UpdateOrderStatusInput } from "@/lib/server/validators";

// Revalidate all places that show order info
function revalidateAll(id?: string) {
  revalidatePath("/admin");           // dashboard cards
  revalidatePath("/admin/orders");    // list
  if (id) revalidatePath(`/admin/orders/${id}`); // detail
}

/** Generic status setter used by form + quick buttons */
export async function setOrderStatus(id: string, formData: FormData) {
  await requireAdmin();

  const raw = { id, status: String(formData.get("status") || "") };
  const parsed = UpdateOrderStatusInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Invalid status" };
  }

  await prisma.order.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  revalidateAll(id);
  return { ok: true };
}

/** Quick buttons (no form) */
export async function markPaid(id: string) {
  await requireAdmin();
  await prisma.order.update({ where: { id }, data: { status: "paid" } });
  revalidateAll(id);
  return { ok: true };
}

export async function markFulfilled(id: string) {
  await requireAdmin();
  await prisma.order.update({ where: { id }, data: { status: "fulfilled" } });
  revalidateAll(id);
  return { ok: true };
}

export async function cancelOrder(id: string) {
  await requireAdmin();
  await prisma.order.update({ where: { id }, data: { status: "cancelled" } });
  revalidateAll(id);
  return { ok: true };
}

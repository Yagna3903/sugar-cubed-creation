"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/server/admin";
import { UpdateOrderStatusInput } from "@/lib/server/validators";

function revalidateAll(id?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  if (id) revalidatePath(`/admin/orders/${id}`);
}

export async function setOrderStatus(id: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const raw = { id, status: String(formData.get("status") || "") };
  const parsed = UpdateOrderStatusInput.safeParse(raw);
  if (!parsed.success) return;

  await prisma.order.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  revalidateAll(id);
}

export async function markPaid(id: string) {
  await requireAdmin();
  await prisma.order.update({ where: { id }, data: { status: "paid" } });
  revalidateAll(id);
}

export async function markFulfilled(id: string) {
  await requireAdmin();
  await prisma.order.update({ where: { id }, data: { status: "fulfilled" } });
  revalidateAll(id);
}

export async function cancelOrder(id: string) {
  await requireAdmin();
  await prisma.order.update({ where: { id }, data: { status: "cancelled" } });
  revalidateAll(id);
}

/** SOFT DELETE → archive cancelled order */
export async function archiveOrder(id: string) {
  await requireAdmin();
  await prisma.order.update({
    where: { id },
    data: { archived: true },   // requires `archived Boolean @default(false)` in schema
  });
  revalidateAll();
  redirect("/admin/orders");    // go back to list
}

/** HARD DELETE → permanently remove */
export async function deleteOrder(id: string) {
  await requireAdmin();
  await prisma.order.delete({ where: { id } });
  revalidateAll();
  redirect("/admin/orders");    // go back after deletion
}

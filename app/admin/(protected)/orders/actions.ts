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

/** Generic status setter used by <form action={setOrderStatus}> */
export async function setOrderStatus(id: string, formData: FormData): Promise<void> {
  await requireAdmin();

  const raw = { id, status: String(formData.get("status") || "") };
  const parsed = UpdateOrderStatusInput.safeParse(raw);
  if (!parsed.success) {
    // You could log an error here if needed, but don't return anything
    return;
  }

  await prisma.order.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  revalidateAll(id);
}

/** Quick buttons (bound with .bind in JSX) */
export async function markPaid(id: string): Promise<void> {
  await requireAdmin();
  await prisma.order.update({ where: { id }, data: { status: "paid" } });
  revalidateAll(id);
}

export async function markFulfilled(id: string): Promise<void> {
  await requireAdmin();
  await prisma.order.update({ where: { id }, data: { status: "fulfilled" } });
  revalidateAll(id);
}

export async function cancelOrder(id: string): Promise<void> {
  await requireAdmin();
  await prisma.order.update({ where: { id }, data: { status: "cancelled" } });
  revalidateAll(id);
}

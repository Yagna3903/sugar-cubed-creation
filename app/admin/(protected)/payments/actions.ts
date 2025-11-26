"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Accept a pending payment.
 * - Payment.status: pending -> completed
 * - Order.status: pending -> paid
 */
export async function capturePayment(paymentId: string) {
  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: "completed" },
  });

  await prisma.order.update({
    where: { id: payment.orderId },
    data: { status: "paid" },
  });

  revalidatePath("/admin/payments");
  revalidatePath("/admin/orders");
}

/**
 * Cancel a pending payment (or expire it).
 * - Payment.status: -> cancelled
 * - Order.status: -> cancelled
 */
export async function cancelPayment(paymentId: string) {
  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: "cancelled" },
  });

  await prisma.order.update({
    where: { id: payment.orderId },
    data: { status: "cancelled" },
  });

  revalidatePath("/admin/payments");
  revalidatePath("/admin/orders");
}

/**
 * Refund an accepted payment.
 * - Payment.status: completed -> refunded
 * - Order.status: paid/fulfilled -> refunded
 *
 * (If you wire Square refunds later, call their API here before updating DB.)
 */
export async function refundPayment(paymentId: string) {
  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: "refunded" },
  });

  await prisma.order.update({
    where: { id: payment.orderId },
    data: { status: "refunded" },
  });

  revalidatePath("/admin/payments");
  revalidatePath("/admin/orders");
}

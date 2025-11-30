"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/server/admin";
import { UpdateOrderStatusInput } from "@/lib/server/validators";
import { sendOrderConfirmation, sendOrderEmail } from "@/lib/email";

function revalidateAll(id?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  if (id) revalidatePath(`/admin/orders/${id}`);
}

export async function resendOrderEmail(orderId: string) {
  await requireAdmin();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order || !order.email) {
    return { success: false, error: "Order or email not found" };
  }

  const result = await sendOrderConfirmation(order, order.email);
  return result;
}

export async function setOrderStatus(
  id: string,
  formData: FormData
): Promise<void> {
  await requireAdmin();
  const raw = { id, status: String(formData.get("status") || "") };
  const parsed = UpdateOrderStatusInput.safeParse(raw);
  if (!parsed.success) return;

  // Validator may include values not present in the Prisma OrderStatus enum (e.g. "approved"),
  // cast here to satisfy the Prisma typings.
  const newStatus = parsed.data.status as any;
  await prisma.order.update({
    where: { id },
    data: { status: newStatus },
  });

  // Send email update
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } }
  });

  if (order) {
    if (newStatus === "paid") await sendOrderEmail(order, "paid");
    else if (newStatus === "fulfilled") await sendOrderEmail(order, "shipped");
    else if (newStatus === "cancelled") await sendOrderEmail(order, "cancelled");
    // Add other statuses if needed
  }

  revalidateAll(id);
}

export async function markPaid(id: string) {
  await requireAdmin();
  await prisma.order.update({ where: { id }, data: { status: "paid" } });

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } }
  });
  if (order) await sendOrderEmail(order, "paid");

  revalidateAll(id);
}

export async function markFulfilled(id: string) {
  await requireAdmin();
  await prisma.order.update({ where: { id }, data: { status: "fulfilled" } });

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } }
  });
  if (order) await sendOrderEmail(order, "shipped");

  revalidateAll(id);
}

export async function cancelOrder(id: string) {
  await requireAdmin();
  // Try to find any related payment (most recent)
  const payment = await (prisma as any).payment.findFirst({
    where: { orderId: id },
    orderBy: { createdAt: "desc" },
  });

  const squareBase =
    process.env.SQUARE_API_BASE_URL ?? "https://connect.squareupsandbox.com";
  const squareVersion = process.env.SQUARE_API_VERSION ?? "2025-08-20";
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;

  try {
    if (payment && payment.provider === "square" && payment.providerPaymentId) {
      const providerId = payment.providerPaymentId;

      // If the payment is an authorization (not captured), cancel the auth.
      if (["approved", "authorized", "pending"].includes(payment.status)) {
        if (!accessToken) {
          // Can't talk to Square — still mark order cancelled locally and log.
          await prisma.order.update({
            where: { id },
            data: { status: "cancelled" },
          });
          revalidateAll(id);
          return;
        }

        const resp = await fetch(
          `${squareBase}/v2/payments/${providerId}/cancel`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              "Square-Version": squareVersion,
            },
          }
        );
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) {
          // If the cancel failed, log and still mark order cancelled locally.
          console.error("[admin.cancelOrder] failed to cancel Square payment", {
            providerId,
            data,
          });
          await prisma.order.update({
            where: { id },
            data: { status: "cancelled" },
          });
          revalidateAll(id);
          return;
        }

        // Update payment + order in a transaction
        await prisma.$transaction(async (tx) => {
          await (tx as any).payment.update({
            where: { id: payment.id },
            data: { status: "cancelled", metadata: data },
          });
          await tx.order.update({
            where: { id },
            data: { status: "cancelled" },
          });
        });

        revalidateAll(id);
        return;
      }

      // If payment was already captured/completed, create a refund
      if (
        ["completed", "captured", "succeeded", "paid"].includes(payment.status)
      ) {
        if (!accessToken) {
          await prisma.order.update({
            where: { id },
            data: { status: "cancelled" },
          });
          revalidateAll(id);
          return;
        }

        const idempotencyKey = `refund-${payment.id}-${crypto.randomUUID()}`;
        const refundPayload = {
          idempotency_key: idempotencyKey,
          payment_id: payment.providerPaymentId,
          amount_money: {
            amount: payment.amountCents,
            currency: payment.currency ?? "CAD",
          },
          reason: "Order cancelled by admin",
        };

        const resp = await fetch(`${squareBase}/v2/refunds`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Square-Version": squareVersion,
          },
          body: JSON.stringify(refundPayload),
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) {
          console.error("[admin.cancelOrder] refund failed", {
            providerId,
            data,
          });
          // Mark order cancelled locally and surface for manual refund later
          await prisma.order.update({
            where: { id },
            data: { status: "cancelled" },
          });
          revalidateAll(id);
          return;
        }

        await prisma.$transaction(async (tx) => {
          await (tx as any).payment.update({
            where: { id: payment.id },
            data: { status: "refunded", metadata: data },
          });
          await tx.order.update({
            where: { id },
            data: { status: "cancelled" },
          });
        });

        revalidateAll(id);
        return;
      }
    }

    // No provider payment to manage: just mark cancelled locally
    await prisma.order.update({ where: { id }, data: { status: "cancelled" } });
    revalidateAll(id);
  } catch (err: any) {
    console.error("[admin.cancelOrder] unexpected error:", err?.message ?? err);
    // Fallback: mark cancelled locally to avoid charging customer later
    await prisma.order.update({ where: { id }, data: { status: "cancelled" } });

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } }
    });
    if (order) await sendOrderEmail(order, "cancelled");

    revalidateAll(id);
  }
}

/** SOFT DELETE -> archive cancelled order */
export async function archiveOrder(id: string) {
  await requireAdmin();
  await prisma.order.update({
    where: { id },
    data: { archived: true }, // requires `archived Boolean @default(false)` in schema
  });
  revalidateAll();
  redirect("/admin/orders"); // go back to list
}

/** HARD DELETE -> permanently remove */
export async function deleteOrder(id: string) {
  await requireAdmin();
  await prisma.order.delete({ where: { id } });
  revalidateAll();
  redirect("/admin/orders"); // go back after deletion
}

import { prisma } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";

type EmailResult =
  | { ok: true }
  | { ok: false; error: string }
  | { ok: true; skipped: true };

export async function sendInvoiceEmail(orderId: string): Promise<EmailResult> {
  // Load order with items and product names
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order || !order.email) {
    return { ok: false, error: "Order/email not found" };
  }

  const result = await sendOrderConfirmation(order, order.email);

  if (result?.success) {
    return { ok: true };
  } else {
    return {
      ok: false,
      error: result?.error ? String(result.error) : "Unknown error",
    };
  }
}

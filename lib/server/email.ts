import { prisma } from "@/lib/db";

type EmailResult =
  | { ok: true }
  | { ok: false; error: string }
  | { ok: true; skipped: true };

async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "orders@sugar-cubed.example";
  if (!apiKey) {
    console.log("[email] RESEND_API_KEY not set. Skipping email.");
    return { ok: true, skipped: true };
  }
  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!resp.ok) {
      const err = await resp.text();
      return { ok: false, error: err };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? String(e) };
  }
}

function renderInvoiceHtml(opts: {
  orderId: string;
  name?: string | null;
  email?: string | null;
  items: Array<{ name: string; qty: number; unitCents: number }>;
  totalCents: number;
}) {
  const currency = "CAD";
  const rows = opts.items
    .map(
      (it) =>
        `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;">${
          it.name
        }</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">x${
          it.qty
        }</td><td style="padding:6px 8px;border-bottom:1px solid #eee; text-align:right;">$${(
          it.unitCents / 100
        ).toFixed(2)}</td></tr>`
    )
    .join("");
  const total = `$${(opts.totalCents / 100).toFixed(2)} ${currency}`;
  return `
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; max-width:560px; margin:0 auto;">
    <h2>Thanks for your order${opts.name ? ", " + opts.name : ""}!</h2>
    <p>Your order <strong>#${
      opts.orderId
    }</strong> is currently <strong>in process</strong>.</p>
    <p>We’ve received your card details and placed an authorization. We’ll email you once the payment is either <strong>accepted</strong> (captured) or <strong>cancelled</strong>.</p>
    <table style="width:100%; border-collapse:collapse; margin-top:12px;">
      <thead>
        <tr>
          <th style="text-align:left; padding:6px 8px; border-bottom:1px solid #ddd;">Item</th>
          <th style="text-align:left; padding:6px 8px; border-bottom:1px solid #ddd;">Qty</th>
          <th style="text-align:right; padding:6px 8px; border-bottom:1px solid #ddd;">Unit</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding:10px 8px; text-align:right; font-weight:600;">Total</td>
          <td style="padding:10px 8px; text-align:right; font-weight:600;">${total}</td>
        </tr>
      </tfoot>
    </table>
    <p style="margin-top:16px; color:#555; font-size:14px;">If you have questions, reply to this email and we’ll be happy to help.</p>
  </div>`;
}

export async function sendInvoiceEmail(orderId: string): Promise<EmailResult> {
  // Load order with items and product names
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: { select: { name: true } } },
      },
    },
  });
  if (!order || !order.email)
    return { ok: false, error: "Order/email not found" };

  const items = order.items.map((it) => ({
    name: it.product?.name ?? it.productId,
    qty: it.qty,
    unitCents: it.unitPriceCents,
  }));
  const html = renderInvoiceHtml({
    orderId: order.id,
    name: order.customerName,
    email: order.email,
    items,
    totalCents: order.totalCents,
  });
  const subject = `Your order #${order.id} is in process`;
  return await sendEmail(order.email, subject, html);
}

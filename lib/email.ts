import { Resend } from "resend";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import OrderConfirmationEmail from "@/components/emails/OrderConfirmation";
import { Order, OrderItem, Product } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY || "re_123");

type OrderWithItemsAndProducts = Order & {
  items: (OrderItem & { product: Product })[];
};

export type EmailType =
  | "pending"
  | "paid"
  | "shipped"
  | "cancelled"
  | "refunded";

export async function sendOrderEmail(
  order: OrderWithItemsAndProducts,
  emailType: EmailType
) {
  const customerEmail = order.email;
  if (!customerEmail) {
    console.warn("No customer email provided. Skipping email.");
    return;
  }

  let subject = "";
  let statusMessage = "";

  switch (emailType) {
    case "pending":
      subject = `Order Received #${order.id.slice(-6).toUpperCase()}`;
      statusMessage =
        "We have received your order and it is currently pending.";
      break;
    case "paid":
      subject = `Order Confirmed #${order.id.slice(-6).toUpperCase()}`;
      statusMessage =
        "Thank you! Your payment has been received and your order is confirmed.";
      break;
    case "shipped":
      subject = `Order Shipped #${order.id.slice(-6).toUpperCase()}`;
      statusMessage = "Great news! Your order is on its way.";
      break;
    case "cancelled":
      subject = `Order Cancelled #${order.id.slice(-6).toUpperCase()}`;
      statusMessage = "Your order has been cancelled.";
      break;
    case "refunded":
      subject = `Order Refunded #${order.id.slice(-6).toUpperCase()}`;
      statusMessage = "A refund has been processed for your order.";
      break;
  }

  try {
    // Render shared HTML template
    const emailHtml = await render(
      OrderConfirmationEmail({
        orderId: order.id,
        customerName: order.customerName || "Valued Customer",
        items: order.items.map((item) => ({
          name: item.product.name,
          quantity: item.qty,
          price: item.unitPriceCents / 100,
        })),
        total: order.totalCents / 100,
        shippingAddress: {
          line1: "",
          city: "",
          state: "",
          postalCode: "",
        },
      })
    );

    const hasSmtp = !!(
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    );

    if (hasSmtp) {
      const port = Number(process.env.SMTP_PORT || 587);
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      const from =
        process.env.EMAIL_FROM ||
        `Sugar Cubed Creation <${process.env.SMTP_USER}>`;
      const info = await transporter.sendMail({
        from,
        to: customerEmail,
        subject,
        html: emailHtml,
      });
      // @ts-ignore
      const previewUrl = (nodemailer as any).getTestMessageUrl?.(info);
      if (previewUrl) console.log("Email preview:", previewUrl);
      return { success: true, data: info };
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("No SMTP or RESEND configured. Skipping email.");
      return { success: false, error: "No email provider configured" };
    }

    const from = process.env.RESEND_FROM || "onboarding@resend.dev";
    const { data, error } = await resend.emails.send({
      from,
      to: [customerEmail],
      subject,
      html: emailHtml,
    });
    if (error) {
      console.error(`Error sending ${emailType} email:`, error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error(`Exception sending ${emailType} email:`, error);
    return { success: false, error };
  }
}

// Backwards compatibility wrapper
export async function sendOrderConfirmation(
  order: OrderWithItemsAndProducts,
  customerEmail: string | null
) {
  return sendOrderEmail(order, "paid");
}

export async function sendAdminNewOrderEmail(order: OrderWithItemsAndProducts) {
  if (!process.env.RESEND_API_KEY) return;

  const adminEmail =
    process.env.ADMIN_EMAIL ||
    process.env.RESEND_FROM ||
    "admin@sugar-cubed.com"; // Fallback
  const from = process.env.RESEND_FROM || "onboarding@resend.dev";

  try {
    const { data, error } = await resend.emails.send({
      from: from,
      to: [adminEmail],
      subject: `[ADMIN] New Order #${order.id.slice(-6).toUpperCase()}`,
      html: `
                <h1>New Order Received</h1>
                <p>Order ID: ${order.id}</p>
                <p>Customer: ${order.customerName} (${order.email})</p>
                <p>Total: $${(order.totalCents / 100).toFixed(2)}</p>
                <p>Status: ${order.status}</p>
                <br/>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${order.id}">View Order in Admin</a>
            `,
    });

    if (error) console.error("Error sending admin email:", error);
    return { success: !error, error };
  } catch (error) {
    console.error("Exception sending admin email:", error);
    return { success: false, error };
  }
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const hasSmtp = !!(
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    );
    if (hasSmtp) {
      const port = Number(process.env.SMTP_PORT || 587);
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      const from =
        process.env.EMAIL_FROM ||
        `Sugar Cubed Creation <${process.env.SMTP_USER}>`;
      const info = await transporter.sendMail({ from, to, subject, html });
      // @ts-ignore
      const previewUrl = (nodemailer as any).getTestMessageUrl?.(info);
      if (previewUrl) console.log("Email preview:", previewUrl);
      return { success: true, data: info };
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("No SMTP or RESEND configured. Skipping email.");
      return { success: false, error: "No email provider configured" };
    }

    const from = process.env.RESEND_FROM || "onboarding@resend.dev";
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
    });
    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Exception sending email:", error);
    return { success: false, error };
  }
}

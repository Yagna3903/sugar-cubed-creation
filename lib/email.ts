import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import OrderConfirmationEmail from "@/components/emails/OrderConfirmation";
import { Order, OrderItem, Product } from "@prisma/client";

type OrderWithItemsAndProducts = Order & {
  items: (OrderItem & { product: Product })[];
};

export type EmailType =
  | "pending"
  | "paid"
  | "shipped"
  | "cancelled"
  | "refunded";

const getTransporter = () => {
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const getFromEmail = () => {
  return (
    process.env.EMAIL_FROM || `Sugar Cubed Creations <${process.env.SMTP_USER}>`
  );
};

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
        "Thanks for your order! We have received it and are currently verifying your payment. You will receive another email once your order is confirmed.";
      break;
    case "paid":
      subject = `Order Confirmed #${order.id.slice(-6).toUpperCase()}`;
      statusMessage =
        "Great news! Your payment has been verified and we are starting to prepare your order.";
      break;
    case "shipped":
      subject = `Order Fulfilled #${order.id.slice(-6).toUpperCase()}`;
      statusMessage = "Your order has been fulfilled and is on its way!";
      break;
    case "cancelled":
      subject = `Order Cancelled #${order.id.slice(-6).toUpperCase()}`;
      statusMessage = "Your order has been cancelled. If you have any questions, please reply to this email.";
      break;
    case "refunded":
      subject = `Order Refunded #${order.id.slice(-6).toUpperCase()}`;
      statusMessage = "A refund has been processed for your order. Please allow 5-10 business days for it to appear on your statement.";
      break;
  }

  try {
    console.log(`[Email] Preparing to send '${emailType}' email to: ${customerEmail}`);

    // Check Env Vars explicitly
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("[Email] CRITICAL: SMTP environment variables are missing!");
      return { success: false, error: "SMTP not configured" };
    }

    // Hardcoded for reliability as requested
    const baseUrl = "https://sugar-cubed-creations.vercel.app";

    // Render shared HTML template
    console.log("[Email] Rendering HTML template...");
    const emailHtml = await render(
      OrderConfirmationEmail({
        heading: subject,
        message: statusMessage,
        orderId: order.id,
        customerName: order.customerName || "Valued Customer",
        items: order.items.map((item) => {
          const img = item.product.imageUrl;
          let absoluteImg = `${baseUrl}/images/Main-Cookie.png`; // Default fallback

          if (img) {
            if (img.startsWith("http")) {
              absoluteImg = img;
            } else if (img.startsWith("/")) {
              absoluteImg = `${baseUrl}${img}`;
            } else {
              // Handle relative path without leading slash
              absoluteImg = `${baseUrl}/${img}`;
            }
          }

          return {
            name: item.product.name,
            quantity: item.qty,
            price: item.unitPriceCents / 100,
            imageUrl: absoluteImg,
          };
        }),
        total: order.totalCents / 100,
        orderUrl: `${baseUrl}/checkout/success?o=${order.id}`,
        shippingAddress: {
          line1: "",
          city: "",
          state: "",
          postalCode: "",
        },
      })
    );

    const transporter = getTransporter();
    console.log("[Email] Sending via Transporter:", {
      host: process.env.SMTP_HOST,
      user: process.env.SMTP_USER
    });

    const info = await transporter.sendMail({
      from: getFromEmail(),
      to: customerEmail,
      subject,
      html: emailHtml,
    });

    console.log("[Email] SUCCESS! Message ID:", info.messageId);

    // @ts-ignore
    const previewUrl = (nodemailer as any).getTestMessageUrl?.(info);
    if (previewUrl) console.log("Email preview:", previewUrl);
    return { success: true, data: info };
  } catch (error) {
    console.error(`[Email] EXCEPTION sending ${emailType} email:`, error);
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
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    return { success: false, error: "SMTP not configured" };
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (!adminEmail) return { success: false, error: "No admin email configured" };

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: getFromEmail(),
      to: adminEmail,
      subject: `[ADMIN] New Order #${order.id.slice(-6).toUpperCase()}`,
      html: `
                <h1>New Order Received</h1>
                <p>Order ID: ${order.id}</p>
                <p>Customer: ${order.customerName} (${order.email})</p>
                <p>Total: $${(order.totalCents / 100).toFixed(2)}</p>
                <p>Status: ${order.status}</p>
                <br/>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${order.id
        }">View Order in Admin</a>
            `,
    });

    return { success: true, data: info };
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
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      console.warn("SMTP not configured. Skipping email.");
      return { success: false, error: "SMTP not configured" };
    }

    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: getFromEmail(),
      to,
      subject,
      html,
    });

    // @ts-ignore
    const previewUrl = (nodemailer as any).getTestMessageUrl?.(info);
    if (previewUrl) console.log("Email preview:", previewUrl);
    return { success: true, data: info };
  } catch (error) {
    console.error("Exception sending email:", error);
    return { success: false, error };
  }
}

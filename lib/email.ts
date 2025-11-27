import { Resend } from "resend";
import { render } from "@react-email/render";
import OrderConfirmationEmail from "@/components/emails/OrderConfirmation";
import { Order, OrderItem, Product } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderWithItemsAndProducts = Order & {
    items: (OrderItem & { product: Product })[];
};

export async function sendOrderConfirmation(
    order: OrderWithItemsAndProducts,
    customerEmail: string | null
) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Skipping email.");
        return;
    }

    if (!customerEmail) {
        console.warn("No customer email provided. Skipping email.");
        return;
    }

    try {
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
                    line1: "123 Cookie Lane", // Placeholder as schema doesn't have address yet
                    city: "Sweet City",
                    state: "SC",
                    postalCode: "12345",
                },
            })
        );

        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev", // Using Resend test email - change to custom domain after DNS verification
            to: [customerEmail],
            subject: `Order Confirmation #${order.id.slice(-6).toUpperCase()}`,
            html: emailHtml,
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

/**
 * Send a custom email with HTML content
 */
export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Skipping email.");
        return { success: false, error: "Missing API key" };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
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

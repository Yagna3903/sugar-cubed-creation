import { Resend } from "resend";
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
        const { data, error } = await resend.emails.send({
            from: "Sugar Cubed Creation <orders@sugarcubedcreation.com>", // You'll need to verify a domain or use 'onboarding@resend.dev' for testing
            to: [customerEmail],
            subject: `Order Confirmation #${order.id.slice(-6).toUpperCase()}`,
            react: OrderConfirmationEmail({
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
            }),
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

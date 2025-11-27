import { NextResponse } from "next/server";
import { sendOrderConfirmation } from "@/lib/email";
import { OrderStatus } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        // Mock order data
        const mockOrder: any = {
            id: "TEST-ORDER-123",
            customerName: "Test User",
            email: email,
            totalCents: 2500,
            status: OrderStatus.paid,
            createdAt: new Date(),
            updatedAt: new Date(),
            items: [
                {
                    id: "item_1",
                    qty: 2,
                    unitPriceCents: 1000,
                    product: { name: "Test Cookie" },
                },
                {
                    id: "item_2",
                    qty: 1,
                    unitPriceCents: 500,
                    product: { name: "Another Cookie" },
                },
            ],
            shippingAddress: "123 Test St",
            shippingCity: "Test City",
            shippingState: "TS",
            shippingZip: "12345",
        };

        const result = await sendOrderConfirmation(mockOrder, email);

        if (!result?.success) {
            throw new Error(JSON.stringify(result?.error));
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to send email" },
            { status: 500 }
        );
    }
}

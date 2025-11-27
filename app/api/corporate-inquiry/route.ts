import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";

interface SelectedProduct {
    id: string;
    name: string;
    imageUrl: string;
    slug: string;
}

interface InquiryRequest {
    fullName: string;
    companyName?: string;
    email: string;
    selectedProducts: SelectedProduct[];
    message?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: InquiryRequest = await request.json();

        // Validate input
        if (!body.fullName || !body.email || !body.selectedProducts || body.selectedProducts.length === 0) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create inquiry in database
        const inquiry = await prisma.corporateInquiry.create({
            data: {
                fullName: body.fullName,
                companyName: body.companyName,
                email: body.email,
                selectedProducts: body.selectedProducts as any,
                message: body.message,
                status: "new",
            },
        });

        // Send confirmation email to customer
        const productList = body.selectedProducts
            .map((p) => `• ${p.name}`)
            .join("\n");

        const customerEmailHtml = `
      <h1>Thank you for your corporate inquiry!</h1>
      <p>Hi ${body.fullName},</p>
      <p>We've received your inquiry for custom cookies. Here's a summary:</p>
      
      <h3>Selected Products:</h3>
      <p>${productList.replace(/\n/g, "<br>")}</p>
      
      ${body.companyName ? `<p><strong>Company:</strong> ${body.companyName}</p>` : ""}
      ${body.message ? `<p><strong>Your message:</strong><br>${body.message}</p>` : ""}
      
      <p>Someone from our team will reach out to you shortly at <strong>${body.email}</strong>.</p>
      
      <p>Best regards,<br>Sugar Cubed Creation Team</p>
    `;

        await sendEmail({
            to: body.email,
            subject: "Corporate Inquiry Confirmation - Sugar Cubed Creation",
            html: customerEmailHtml,
        });

        // Send notification email to admin
        const adminEmailHtml = `
      <h1>New Corporate Inquiry</h1>
      <p><strong>From:</strong> ${body.fullName} (${body.email})</p>
      ${body.companyName ? `<p><strong>Company:</strong> ${body.companyName}</p>` : ""}
      
      <h3>Selected Products:</h3>
      <p>${productList.replace(/\n/g, "<br>")}</p>
      
      ${body.message ? `<h3>Message:</h3><p>${body.message}</p>` : ""}
      
      <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/admin/inquiries">View in Admin Panel</a></p>
    `;

        const adminEmail = process.env.ADMIN_EMAIL || "admin@sugarcubed.com";
        await sendEmail({
            to: adminEmail,
            subject: `New Corporate Inquiry from ${body.fullName}`,
            html: adminEmailHtml,
        });

        return NextResponse.json({
            success: true,
            inquiryId: inquiry.id,
        });

    } catch (error) {
        console.error("Error creating corporate inquiry:", error);
        return NextResponse.json(
            { error: "Failed to submit inquiry" },
            { status: 500 }
        );
    }
}

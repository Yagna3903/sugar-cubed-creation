import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { status } = await request.json();

        const updated = await prisma.corporateInquiry.update({
            where: { id: params.id },
            data: { status },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating inquiry status:", error);
        return NextResponse.json(
            { error: "Failed to update status" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.corporateInquiry.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting inquiry:", error);
        return NextResponse.json(
            { error: "Failed to delete inquiry" },
            { status: 500 }
        );
    }
}

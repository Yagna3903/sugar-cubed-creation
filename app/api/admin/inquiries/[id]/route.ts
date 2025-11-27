import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

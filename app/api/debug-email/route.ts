import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const to = searchParams.get("to");

    if (!to) {
        return NextResponse.json({ error: "Missing 'to' query param" }, { status: 400 });
    }

    // Check env vars visibility
    const envCheck = {
        SMTP_HOST: process.env.SMTP_HOST ? "Set" : "Missing",
        SMTP_USER: process.env.SMTP_USER ? "Set" : "Missing",
        SMTP_PASS: process.env.SMTP_PASS ? "Set" : "Missing",
        SMTP_PORT: process.env.SMTP_PORT || "587 (Default)",
        EMAIL_FROM: process.env.EMAIL_FROM || "Default",
    };

    try {
        const result = await sendEmail({
            to,
            subject: "Debug Test Email",
            html: "<h1>It works!</h1><p>Your SMTP configuration is valid.</p>",
        });

        return NextResponse.json({
            success: result.success,
            envCheck,
            resultData: result.data || null,
            error: result.error ? String(result.error) : null,
        });
    } catch (err: any) {
        return NextResponse.json({
            success: false,
            envCheck,
            error: err.message,
            stack: err.stack,
        }, { status: 500 });
    }
}

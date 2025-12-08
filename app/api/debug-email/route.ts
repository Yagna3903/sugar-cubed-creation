import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const to = searchParams.get("to");

    // Masking helper
    const mask = (s?: string) => s ? `${s.slice(0, 2)}***${s.slice(-2)} (Length: ${s.length})` : "MISSING";

    const envCheck = {
        SMTP_HOST: process.env.SMTP_HOST || "MISSING",
        SMTP_PORT: process.env.SMTP_PORT || "MISSING",
        SMTP_USER: mask(process.env.SMTP_USER),
        SMTP_PASS: mask(process.env.SMTP_PASS),
        EMAIL_FROM: process.env.EMAIL_FROM || "MISSING",
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "MISSING",
    };

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    let connectionStatus = "Not attempted";
    let sendStatus = "Not attempted";
    let errorDetail = null;

    try {
        // 1. Verify Connection
        await transporter.verify();
        connectionStatus = "SUCCESS: Connected to SMTP Server";

        // 2. Try Sending (if 'to' param provided)
        if (to) {
            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to,
                subject: "Debug Test Email - Sugar Cubed Creations",
                html: `
          <h1>It Works!</h1>
          <p>Your email system is functioning correctly.</p>
          <pre>${JSON.stringify(envCheck, null, 2)}</pre>
        `,
            });
            sendStatus = "SUCCESS: Email sent to " + to;
        } else {
            sendStatus = "SKIPPED: No 'to' parameter provided (add ?to=your@email.com)";
        }

        return NextResponse.json({
            success: true,
            diagnostics: {
                envCheck,
                connectionStatus,
                sendStatus,
            }
        });

    } catch (err: any) {
        return NextResponse.json({
            success: false,
            error: err.message,
            code: err.code,
            command: err.command,
            diagnostics: {
                envCheck,
                connectionStatus: "FAILED",
                errorDetail: err.message
            }
        }, { status: 500 });
    }
}

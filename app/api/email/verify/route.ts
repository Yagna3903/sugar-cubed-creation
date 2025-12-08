import { NextResponse } from "next/server";
import { verifyEmailDeliverable } from "@/lib/server/email-verifier";

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({ email: undefined }));
  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const result = await verifyEmailDeliverable(email.trim());
    return NextResponse.json(result, {
      status: result.deliverable ? 200 : 422,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Email verification failed" },
      { status: 502 }
    );
  }
}

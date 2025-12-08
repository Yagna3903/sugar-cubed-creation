import { NextResponse } from "next/server";
import { verifyEmailDeliverable } from "@/lib/server/email-verifier";

export async function POST(request: Request) {
  const { email } = await request.json().catch(() => ({ email: "" }));

  if (!email || typeof email !== "string") {
    return NextResponse.json(
      { success: false, error: "Email is required" },
      { status: 400 }
    );
  }

  const result = await verifyEmailDeliverable(email);
  if (!result.deliverable) {
    return NextResponse.json(
      {
        success: false,
        deliverable: false,
        error:
          result.reason ||
          "We could not confirm that address. Please try another email.",
        suggestion: result.suggestion,
      },
      { status: 422 }
    );
  }

  return NextResponse.json({ success: true, deliverable: true });
}

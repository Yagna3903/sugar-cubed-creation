import { z } from "zod";
import validate from "deep-email-validator";

export type EmailVerificationResult = {
  deliverable: boolean;
  reason?: string | null;
  suggestion?: string | null;
};

type ValidatorResult = {
  valid: boolean;
  reason?: string | null;
  validators: {
    smtp?: { valid?: boolean | null; reason?: string | null };
    [key: string]:
      | { valid?: boolean | null; reason?: string | null }
      | undefined;
  };
};

const emailSchema = z.string().trim().min(1).email();

const resolveVerificationSender = () => {
  return (
    process.env.SMTP_VERIFICATION_SENDER ||
    process.env.EMAIL_FROM ||
    process.env.SMTP_USER ||
    "postmaster@sugarcubedcreation.com"
  );
};

const isSoftSmtpFailure = (result: ValidatorResult) => {
  if (result.reason !== "smtp") return false;
  const smtp = result.validators.smtp;
  if (!smtp) return false;

  const text = (smtp.reason || "").toLowerCase();
  if (!text) return true;

  const fatalPatterns = [
    "does not exist",
    "no such user",
    "unknown user",
    "unknown recipient",
    "mailbox unavailable",
    "user not found",
    "invalid mailbox",
    "relay access denied",
    "mailbox not found",
  ];

  if (fatalPatterns.some((pattern) => text.includes(pattern))) {
    return false;
  }

  return true;
};

export async function verifyEmailDeliverable(
  emailInput: string
): Promise<EmailVerificationResult> {
  const parsed = emailSchema.safeParse(emailInput);
  if (!parsed.success) {
    return {
      deliverable: false,
      reason: "Invalid email syntax",
      suggestion: "Please double-check the spelling.",
    };
  }

  const email = parsed.data.toLowerCase();

  try {
    const result = (await validate({
      email,
      sender: resolveVerificationSender(),
      validateRegex: true,
      validateTypo: true,
      validateDisposable: true,
      validateMx: true,
      validateSMTP: true,
    })) as ValidatorResult;

    if (!result.valid && isSoftSmtpFailure(result)) {
      return {
        deliverable: true,
        reason: null,
        suggestion:
          result.validators.smtp?.reason ||
          "SMTP verification skipped due to provider restrictions.",
      };
    }

    return {
      deliverable: result.valid,
      reason: result.reason || undefined,
      suggestion: result.validators.smtp?.reason || result.reason || undefined,
    };
  } catch (error) {
    console.error("Failed to verify email delivery:", error);
    return {
      deliverable: true,
      reason: null,
      suggestion: "We could not verify your email due to a network error.",
    };
  }
}

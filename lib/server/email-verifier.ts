import validate from "deep-email-validator";

type ValidatorKey = "regex" | "typo" | "disposable" | "mx" | "smtp";

type DeepEmailValidationResult = {
  valid: boolean;
  reason?: ValidatorKey;
  validators?: Partial<
    Record<ValidatorKey, { valid: boolean; reason?: string }>
  >;
};

const SMTP_VERIFICATION_SENDER =
  process.env.SMTP_VERIFICATION_SENDER ??
  extractEmailAddress(process.env.EMAIL_FROM) ??
  process.env.SMTP_USER ??
  "verify@sugarcubedcreation.com";

export type EmailVerificationResult = {
  deliverable: boolean;
  reason?: string | null;
  suggestion?: string | null;
  didSkip?: boolean;
};

export async function verifyEmailDeliverable(
  email: string
): Promise<EmailVerificationResult> {
  const normalizedEmail = email.trim();

  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    return { deliverable: false, reason: "invalid-format" };
  }

  const result = (await validate({
    email: normalizedEmail,
    sender: SMTP_VERIFICATION_SENDER,
    validateRegex: true,
    validateTypo: true,
    validateDisposable: true,
    validateMx: true,
    validateSMTP: true,
  })) as DeepEmailValidationResult;

  if (!result.valid) {
    return {
      deliverable: false,
      reason: deriveReason(result),
      suggestion: deriveSuggestion(result),
    };
  }

  return { deliverable: true };
}

function deriveReason(result: DeepEmailValidationResult): string | null {
  const reasonKey = result.reason;
  if (!reasonKey) {
    return null;
  }
  const details = result.validators?.[reasonKey];
  return details?.reason ?? reasonKey;
}

function deriveSuggestion(result: DeepEmailValidationResult): string | null {
  const typoReason = result.validators?.typo?.reason;
  if (!typoReason) {
    return null;
  }
  const match = typoReason.match(/suggested email:\s*(.+)$/i);
  return match?.[1]?.trim() ?? null;
}

function extractEmailAddress(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }
  const match = value.match(/<([^>]+)>/);
  if (match) {
    return match[1];
  }
  return value.includes("@") ? value : undefined;
}

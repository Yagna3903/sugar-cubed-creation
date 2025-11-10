import { beforeEach, vi } from "vitest";

process.env.SQUARE_ACCESS_TOKEN = "test-token";
process.env.SQUARE_LOCATION_ID = "LOC_123";
process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID = "LOC_123";
process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID = "APP_123";
process.env.SQUARE_API_BASE_URL = "https://connect.squareupsandbox.com";
process.env.SQUARE_API_VERSION = "2025-08-20";
process.env.SQUARE_WEBHOOK_SIGNATURE_KEY = "super-secret";
process.env.WEBHOOK_PUBLIC_URL = "https://example.com";

beforeEach(() => {
  vi.restoreAllMocks();
  global.fetch = vi.fn();
});

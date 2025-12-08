type LogLevel = "info" | "warn" | "error";

type LogPayload = {
  event: string;
  level: LogLevel;
  timestamp: string;
  context?: Record<string, unknown>;
};

const OBSERVABILITY_WEBHOOK_URL = process.env.OBSERVABILITY_WEBHOOK_URL;
const ALERT_LEVELS: LogLevel[] = ["warn", "error"];

function emit(
  level: LogLevel,
  event: string,
  context?: Record<string, unknown>
) {
  const payload: LogPayload = {
    event,
    level,
    timestamp: new Date().toISOString(),
    context,
  };
  const line = JSON.stringify(payload);

  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }

  if (
    OBSERVABILITY_WEBHOOK_URL &&
    ALERT_LEVELS.includes(level) &&
    typeof fetch === "function"
  ) {
    void fetch(OBSERVABILITY_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: line,
    }).catch((err) => {
      console.error(
        JSON.stringify({
          event: "logger.webhook.failed",
          level: "error",
          timestamp: new Date().toISOString(),
          context: {
            message: err instanceof Error ? err.message : String(err),
          },
        })
      );
    });
  }
}

export function logPaymentEvent(
  event: string,
  context?: Record<string, unknown>
) {
  emit("info", event, context);
}

export function logPaymentWarning(
  event: string,
  context?: Record<string, unknown>
) {
  emit("warn", event, context);
}

export function logPaymentError(
  event: string,
  context?: Record<string, unknown>
) {
  emit("error", event, context);
}

export function logEvent(event: string, context?: Record<string, unknown>) {
  emit("info", event, context);
}

export function logWarning(event: string, context?: Record<string, unknown>) {
  emit("warn", event, context);
}

export function logError(event: string, context?: Record<string, unknown>) {
  emit("error", event, context);
}

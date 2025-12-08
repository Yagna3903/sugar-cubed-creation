const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const ALERT_THRESHOLD = 5;

type Counter = {
  count: number;
  expiresAt: number;
};

const counters = new Map<string, Counter>();

export function incrementFailureCounter(key: string) {
  const now = Date.now();
  const current = counters.get(key);
  if (!current || current.expiresAt <= now) {
    const fresh = { count: 1, expiresAt: now + WINDOW_MS };
    counters.set(key, fresh);
    return { count: fresh.count, thresholdHit: fresh.count >= ALERT_THRESHOLD };
  }
  current.count += 1;
  counters.set(key, current);
  return {
    count: current.count,
    thresholdHit: current.count >= ALERT_THRESHOLD,
  };
}

export function resetFailureCounter(key: string) {
  counters.delete(key);
}

export const FAILURE_ALERT_THRESHOLD = ALERT_THRESHOLD;
export const FAILURE_WINDOW_MS = WINDOW_MS;

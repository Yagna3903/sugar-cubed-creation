"use client";

import { useEffect, useState } from "react";

export default function SendReceiptClient({ orderId }: { orderId: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    (async () => {
      try {
        setStatus("sending");
        const res = await fetch("/api/orders/mark-paid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        if (!res.ok) throw new Error("Failed to mark order as paid");
        if (!cancelled) setStatus("done");
      } catch (e) {
        console.error(e);
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  // Non-visual component; intentionally renders nothing
  return null;
}

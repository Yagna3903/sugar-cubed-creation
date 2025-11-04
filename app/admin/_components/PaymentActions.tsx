"use client";

import React, { useState } from "react";

type Props = {
  providerPaymentId: string;
  status: string;
  amountCents: number;
};

export default function PaymentActions({
  providerPaymentId,
  status,
  amountCents,
}: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const canCapture = ["approved", "authorized"].includes(status);
  const canCancel = ["approved", "authorized", "pending"].includes(status);
  const canRefund = ["completed", "captured", "succeeded", "paid"].includes(
    status
  );

  async function callApi(url: string, body?: any) {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok)
      throw new Error(
        data?.error ? JSON.stringify(data.error) : resp.statusText
      );
    return data;
  }

  async function onCapture() {
    setBusy("capture");
    setMessage(null);
    try {
      await callApi(
        `/api/admin/payments/${encodeURIComponent(providerPaymentId)}/capture`,
        { action: "capture" }
      );
      setMessage("Captured successfully. Refresh the page to see updates.");
    } catch (e: any) {
      setMessage(`Capture failed: ${e?.message ?? e}`);
    } finally {
      setBusy(null);
    }
  }

  async function onCancel() {
    setBusy("cancel");
    setMessage(null);
    try {
      await callApi(
        `/api/admin/payments/${encodeURIComponent(providerPaymentId)}/capture`,
        { action: "cancel" }
      );
      setMessage("Authorization canceled. Refresh the page to see updates.");
    } catch (e: any) {
      setMessage(`Cancel failed: ${e?.message ?? e}`);
    } finally {
      setBusy(null);
    }
  }

  async function onRefund() {
    setBusy("refund");
    setMessage(null);
    try {
      await callApi(
        `/api/admin/payments/${encodeURIComponent(providerPaymentId)}/refund`,
        {
          amountCents,
          reason: "Admin initiated full refund",
        }
      );
      setMessage("Refund initiated. Refresh the page to see updates.");
    } catch (e: any) {
      setMessage(`Refund failed: ${e?.message ?? e}`);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {canCapture && (
        <button
          onClick={onCapture}
          disabled={busy !== null}
          className="px-2 py-1 rounded bg-emerald-600 text-white disabled:opacity-50"
        >
          {busy === "capture" ? "Capturing..." : "Capture"}
        </button>
      )}
      {canCancel && (
        <button
          onClick={onCancel}
          disabled={busy !== null}
          className="px-2 py-1 rounded bg-zinc-700 text-white disabled:opacity-50"
        >
          {busy === "cancel" ? "Canceling..." : "Cancel Auth"}
        </button>
      )}
      {canRefund && (
        <button
          onClick={onRefund}
          disabled={busy !== null}
          className="px-2 py-1 rounded bg-rose-600 text-white disabled:opacity-50"
        >
          {busy === "refund" ? "Refunding..." : "Refund"}
        </button>
      )}
      {message && <div className="text-xs text-zinc-600">{message}</div>}
    </div>
  );
}

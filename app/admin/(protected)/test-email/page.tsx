"use client";

import { useState } from "react";

export default function TestEmailPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    async function sendTestEmail(e: React.FormEvent) {
        e.preventDefault();
        setStatus("sending");
        setMessage("");

        try {
            const res = await fetch("/api/admin/test-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to send");

            setStatus("success");
            setMessage("Email sent successfully! Check your inbox.");
        } catch (err: any) {
            setStatus("error");
            setMessage(err.message);
        }
    }

    return (
        <div className="max-w-md mx-auto py-12">
            <h1 className="text-2xl font-bold mb-6">Test Email Configuration</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <form onSubmit={sendTestEmail} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Send Test Email To:</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="you@example.com"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Note: If using Resend free tier, you can only send to your verified email.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={status === "sending"}
                        className="w-full bg-brand-brown text-white py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                    >
                        {status === "sending" ? "Sending..." : "Send Test Email"}
                    </button>

                    {message && (
                        <div
                            className={`p-3 rounded-lg text-sm ${status === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                                }`}
                        >
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

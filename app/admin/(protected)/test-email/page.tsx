"use client";

import { useState } from "react";
import Link from "next/link";

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
        <div className="max-w-7xl mx-auto p-8">
            {/* Back Button */}
            <div className="mb-8">
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-full text-sm font-medium text-brand-brown hover:bg-zinc-50 hover:border-brand-brown/20 transition-all shadow-sm group"
                >
                    <svg
                        className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </Link>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="font-display font-bold text-3xl text-brand-brown mb-2">Test Email Configuration</h1>
                    <p className="text-zinc-500">Send a test email to verify your SMTP settings and template design.</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-soft border border-brand-brown/5">
                    <form onSubmit={sendTestEmail} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-brand-brown mb-2">Send Test Email To</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-zinc-200 rounded-xl focus:ring-brand-brown focus:border-brand-brown transition-colors placeholder-zinc-400"
                                    placeholder="you@example.com"
                                />
                            </div>

                        </div>

                        <button
                            type="submit"
                            disabled={status === "sending"}
                            className="w-full flex items-center justify-center gap-2 bg-brand-brown text-white py-3.5 rounded-xl font-medium shadow-soft hover:shadow-medium hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-soft"
                        >
                            {status === "sending" ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    Send Test Email
                                </>
                            )}
                        </button>

                        {message && (
                            <div
                                className={`p-4 rounded-xl text-sm flex items-start gap-3 ${status === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                                    }`}
                            >
                                {status === "success" ? (
                                    <svg className="w-5 h-5 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                <span className="font-medium pt-0.5">{message}</span>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

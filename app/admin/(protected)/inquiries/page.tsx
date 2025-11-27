"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BackLink from "@/app/admin/_components/BackLink";
import EmptyState from "@/app/admin/_components/EmptyState";
import { products as staticProducts } from "@/lib/data";

interface SelectedProduct {
    id: string;
    name: string;
    imageUrl: string;
    slug: string;
}

interface CorporateInquiry {
    id: string;
    fullName: string;
    companyName: string | null;
    email: string;
    selectedProducts: SelectedProduct[];
    message: string | null;
    status: "new" | "contacted" | "completed";
    createdAt: string;
}

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState<CorporateInquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchInquiries();
    }, []);

    async function fetchInquiries() {
        try {
            const res = await fetch("/api/admin/inquiries");
            const data = await res.json();

            // Enrich inquiry data with image URLs from static products
            const enrichedData = data.map((inq: any) => ({
                ...inq,
                selectedProducts: inq.selectedProducts.map((sp: any) => {
                    const matchingProduct = staticProducts.find(p => p.id === sp.id);
                    return {
                        ...sp,
                        imageUrl: matchingProduct?.image || "/images/placeholder.jpg",
                    };
                }),
            }));

            setInquiries(enrichedData);
        } catch (error) {
            console.error("Failed to fetch inquiries:", error);
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id: string, status: "new" | "contacted" | "completed") {
        try {
            const res = await fetch(`/api/admin/inquiries/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                setInquiries(inquiries.map(inq =>
                    inq.id === id ? { ...inq, status } : inq
                ));
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    }

    async function deleteInquiry(id: string) {
        if (!confirm("Are you sure you want to delete this inquiry?")) return;

        try {
            const res = await fetch(`/api/admin/inquiries/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setInquiries(inquiries.filter(inq => inq.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete inquiry:", error);
        }
    }

    const filteredInquiries = inquiries.filter(inq => {
        const matchesStatus = filterStatus === "all" || inq.status === filterStatus;
        const matchesSearch = !searchTerm ||
            inq.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const statusColors = {
        new: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
        contacted: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" },
        completed: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-brand-cream/30 via-white to-brand-pink/20">
                <main className="mx-auto max-w-7xl px-6 py-8">
                    <div className="mb-6">
                        <BackLink href="/admin">Back to Dashboard</BackLink>
                    </div>
                    <div className="text-center py-12">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-brown border-r-transparent" />
                        <p className="mt-4 text-zinc-600">Loading inquiries...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-cream/30 via-white to-brand-pink/20">
            <main className="mx-auto max-w-7xl px-6 py-8">
                <div className="mb-6">
                    <BackLink href="/admin">Back to Dashboard</BackLink>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-brown to-brand-brown/80 flex items-center justify-center text-white text-xl">
                            💼
                        </div>
                        <h1 className="text-3xl font-bold text-zinc-900">Corporate Inquiries</h1>
                    </div>
                    <p className="text-zinc-600">Manage custom corporate cookie requests</p>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search by name, company, or email..."
                        className="flex-1 rounded-xl border border-zinc-300 px-4 py-2.5 focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/20 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className="flex gap-2">
                        {["all", "new", "contacted", "completed"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2.5 rounded-xl font-medium transition-all capitalize ${filterStatus === status
                                    ? "bg-brand-brown text-white shadow-md"
                                    : "bg-white border border-zinc-200 text-zinc-700 hover:border-brand-brown/40"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Inquiries list */}
                {filteredInquiries.length === 0 ? (
                    <EmptyState
                        title="No inquiries found"
                        description="No corporate inquiries match your current filters."
                        icon="💼"
                    />
                ) : (
                    <div className="space-y-4">
                        {filteredInquiries.map((inquiry) => (
                            <div key={inquiry.id} className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Info section */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-zinc-900">{inquiry.fullName}</h3>
                                                {inquiry.companyName && (
                                                    <p className="text-sm text-zinc-600">{inquiry.companyName}</p>
                                                )}
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[inquiry.status].bg} ${statusColors[inquiry.status].text} ${statusColors[inquiry.status].border}`}
                                            >
                                                {inquiry.status}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <a href={`mailto:${inquiry.email}`} className="hover:text-brand-brown">{inquiry.email}</a>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>

                                        {inquiry.message && (
                                            <div className="mt-3 p-3 bg-zinc-50 rounded-lg">
                                                <p className="text-sm font-medium text-zinc-700 mb-1">Message:</p>
                                                <p className="text-sm text-zinc-600">{inquiry.message}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Selected products */}
                                    <div className="lg:w-80">
                                        <p className="text-sm font-semibold text-zinc-700 mb-3">Selected Cookies:</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {inquiry.selectedProducts.map((product) => (
                                                <div key={product.id} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200">
                                                    <Image
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="150px"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                                                        <p className="text-white text-xs font-medium line-clamp-2">{product.name}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-4 pt-4 border-t border-zinc-200 flex flex-wrap gap-2">
                                    <select
                                        value={inquiry.status}
                                        onChange={(e) => updateStatus(inquiry.id, e.target.value as any)}
                                        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/20 transition-all outline-none"
                                    >
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="completed">Completed</option>
                                    </select>

                                    <button
                                        onClick={() => deleteInquiry(inquiry.id)}
                                        className="px-4 py-1.5 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

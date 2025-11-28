"use client";

import { format } from "date-fns";
import type { Offer } from "@prisma/client";
import Link from "next/link";

const colorSchemes = [
    { value: "brand-brown", label: "Warm Brown (Default)" },
    { value: "brand-pink", label: "Soft Pink" },
    { value: "green", label: "Earthy Green" },
    { value: "blue", label: "Sky Blue" },
    { value: "purple", label: "Lavender Purple" },
    { value: "christmas", label: "🎄 Christmas (Red & Green)" },
    { value: "halloween", label: "🎃 Halloween (Orange & Purple)" },
];

export default function OfferForm({
    offer,
}: {
    offer?: Offer;
}) {
    const isEdit = !!offer;

    // Format dates for input fields
    const formatDateForInput = (date: Date) => {
        return format(date, "yyyy-MM-dd'T'HH:mm");
    };

    return (
        <div className="max-w-2xl space-y-6">
            {/* Title */}
            <div>
                <label className="block text-sm font-semibold mb-2">
                    Offer Title *
                </label>
                <input
                    type="text"
                    name="title"
                    defaultValue={offer?.title}
                    required
                    placeholder="e.g., Weekend Batch Special"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-brown focus:border-brand-brown"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-semibold mb-2">
                    Description *
                </label>
                <textarea
                    name="description"
                    defaultValue={offer?.description}
                    required
                    rows={3}
                    placeholder="Detailed description of the offer..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-brown focus:border-brand-brown"
                />
            </div>

            {/* Discount Text */}
            <div>
                <label className="block text-sm font-semibold mb-2">
                    Discount Text *
                </label>
                <input
                    type="text"
                    name="discountText"
                    defaultValue={offer?.discountText}
                    required
                    placeholder="e.g., 15% OFF or Buy 2, Get 10% OFF"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-brown focus:border-brand-brown"
                />
            </div>

            {/* Badge (optional) */}
            <div>
                <label className="block text-sm font-semibold mb-2">
                    Badge (Optional)
                </label>
                <input
                    type="text"
                    name="badge"
                    defaultValue={offer?.badge || ""}
                    placeholder="e.g., Limited Time, Weekly"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-brown focus:border-brand-brown"
                />
            </div>

            {/* Color Scheme */}
            <div>
                <label className="block text-sm font-semibold mb-2">
                    Color Scheme
                </label>
                <select
                    name="colorScheme"
                    defaultValue={offer?.colorScheme || "brand-brown"}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-brown focus:border-brand-brown"
                >
                    {colorSchemes.map((scheme) => (
                        <option key={scheme.value} value={scheme.value}>
                            {scheme.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* CTA Text & Link */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Button Text
                    </label>
                    <input
                        type="text"
                        name="ctaText"
                        defaultValue={offer?.ctaText || "Shop Now"}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-brown focus:border-brand-brown"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Button Link
                    </label>
                    <input
                        type="text"
                        name="ctaLink"
                        defaultValue={offer?.ctaLink || "/shop"}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-brown focus:border-brand-brown"
                    />
                </div>
            </div>

            {/* Valid From/Until */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Valid From *
                    </label>
                    <input
                        type="datetime-local"
                        name="validFrom"
                        defaultValue={offer ? formatDateForInput(offer.validFrom) : ""}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-brown focus:border-brand-brown"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Valid Until *
                    </label>
                    <input
                        type="datetime-local"
                        name="validUntil"
                        defaultValue={offer ? formatDateForInput(offer.validUntil) : ""}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-brown focus:border-brand-brown"
                    />
                </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="active"
                    id="active"
                    defaultChecked={offer?.active ?? true}
                    className="w-4 h-4 text-brand-brown focus:ring-brand-brown border-gray-300 rounded"
                />
                <label htmlFor="active" className="text-sm font-medium">
                    Active (show on offers page)
                </label>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4 border-t">
                <button
                    type="submit"
                    className="px-6 py-2 bg-brand-brown text-white rounded-lg hover:bg-brand-brown/90 transition font-semibold"
                >
                    {isEdit ? "Update Offer" : "Create Offer"}
                </button>
                <Link
                    href="/admin/offers"
                    className="px-6 py-2 bg-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-300 transition font-semibold inline-block text-center"
                >
                    Cancel
                </Link>
            </div>
        </div>
    );
}

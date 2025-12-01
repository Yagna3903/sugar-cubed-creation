"use client";

import { format } from "date-fns";
import type { Offer } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { BackButton } from "@/components/ui/back-button";

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
    const [discountType, setDiscountType] = useState(offer?.discountType || "percentage");
    const [selectedColor, setSelectedColor] = useState(offer?.colorScheme || "brand-brown");

    // CTA Link State
    const [linkType, setLinkType] = useState(
        ["/shop", "/contact", "/"].includes(offer?.ctaLink || "/shop")
            ? (offer?.ctaLink || "/shop")
            : "custom"
    );
    const [linkValue, setLinkValue] = useState(offer?.ctaLink || "/shop");

    // Format dates for input fields
    const formatDateForInput = (date: Date) => {
        return format(date, "yyyy-MM-dd'T'HH:mm");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-32">
            {/* 1. Basic Information */}
            <section
                className="bg-white rounded-3xl shadow-soft border border-zinc-100 overflow-hidden animate-slide-up"
                style={{ animationDelay: "0ms" }}
            >
                <div className="bg-gradient-to-r from-brand-cream to-white px-5 py-4 md:px-8 md:py-6 border-b border-brand-brown/5 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-brand-brown/10 flex items-center justify-center text-brand-brown shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                    </div>
                    <div>
                        <h3 className="font-display font-bold text-lg text-zinc-900">Basic Information</h3>
                        <p className="text-sm text-zinc-500">Essential details about the promotion</p>
                    </div>
                </div>
                <div className="p-4 md:p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-2">
                            Offer Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            defaultValue={offer?.title}
                            required
                            placeholder="e.g., Summer Sale"
                            className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/5 outline-none transition-all duration-300 placeholder:text-zinc-400"
                        />
                        <p className="text-xs text-zinc-400 mt-2">Internal name for this offer.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            defaultValue={offer?.description}
                            required
                            rows={3}
                            placeholder="Describe the offer details..."
                            className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/5 outline-none transition-all duration-300 placeholder:text-zinc-400 resize-none"
                        />
                    </div>
                </div>
            </section>

            {/* 2. Promo Code & Discount */}
            <section
                className="bg-white rounded-3xl shadow-soft border border-zinc-100 overflow-hidden animate-slide-up"
                style={{ animationDelay: "100ms" }}
            >
                <div className="bg-gradient-to-r from-brand-cream to-white px-5 py-4 md:px-8 md:py-6 border-b border-brand-brown/5 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-brand-brown/10 flex items-center justify-center text-brand-brown shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0l-2.33 1.26a.53.53 0 0 0-.22.68l2.65 4.96a2 2 0 0 1-.3 2.26L2.9 16.76a.53.53 0 0 0 .22.69l2.33 1.26a1.93 1.93 0 0 0 1.81 0l12.36-6.6a1.93 1.93 0 0 0 1.29-1.81V9.53a1.93 1.93 0 0 0-1.29-1.81z" /><path d="M12 12v6" /></svg>
                    </div>
                    <div>
                        <h3 className="font-display font-bold text-lg text-zinc-900">Promo Code & Discount</h3>
                        <p className="text-sm text-zinc-500">Define how the discount works</p>
                    </div>
                </div>
                <div className="p-4 md:p-8 space-y-6 md:space-y-8">
                    <div className="grid md:grid-cols-2 gap-4 md:gap-8">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">
                                Promo Code <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-zinc-400 group-focus-within:text-brand-brown transition-colors">#</span>
                                </div>
                                <input
                                    type="text"
                                    name="promoCode"
                                    defaultValue={offer?.promoCode || ""}
                                    required
                                    placeholder="SUMMER2025"
                                    className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/5 outline-none transition-all duration-300 placeholder:text-zinc-400 uppercase font-mono tracking-wider"
                                />
                            </div>
                            <p className="text-xs text-zinc-400 mt-2">Customers enter this code at checkout.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">
                                Discount Type
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1 bg-zinc-100 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setDiscountType("percentage")}
                                    className={`py-2.5 px-2 md:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${discountType === "percentage"
                                        ? "bg-white text-brand-brown shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-700"
                                        }`}
                                >
                                    Percentage
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDiscountType("fixed")}
                                    className={`py-2.5 px-2 md:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${discountType === "fixed"
                                        ? "bg-white text-brand-brown shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-700"
                                        }`}
                                >
                                    Fixed Amount
                                </button>
                            </div>
                            <input type="hidden" name="discountType" value={discountType} />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">
                                Discount Value <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-zinc-400 group-focus-within:text-brand-brown transition-colors">
                                        {discountType === "percentage" ? "%" : "$"}
                                    </span>
                                </div>
                                <input
                                    type="number"
                                    name="discountValue"
                                    defaultValue={offer?.discountValue}
                                    required
                                    min="0"
                                    placeholder={discountType === "percentage" ? "20" : "10.00"}
                                    className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/5 outline-none transition-all duration-300 placeholder:text-zinc-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">
                                Minimum Purchase ($)
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-zinc-400 group-focus-within:text-brand-brown transition-colors">$</span>
                                </div>
                                <input
                                    type="number"
                                    name="minPurchase"
                                    defaultValue={offer?.minPurchase ? offer.minPurchase / 100 : 0}
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/5 outline-none transition-all duration-300 placeholder:text-zinc-400"
                                />
                            </div>
                            <p className="text-xs text-zinc-400 mt-2">Enter amount in Dollars. 0 for no minimum.</p>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">
                                Discount Description <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="discountText"
                                defaultValue={offer?.discountText}
                                required
                                placeholder="e.g., Get 20% off your entire order"
                                className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/5 outline-none transition-all duration-300 placeholder:text-zinc-400"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Display Settings */}
            <section
                className="bg-white rounded-3xl shadow-soft border border-zinc-100 overflow-hidden animate-slide-up"
                style={{ animationDelay: "200ms" }}
            >
                <div className="bg-gradient-to-r from-brand-cream to-white px-5 py-4 md:px-8 md:py-6 border-b border-brand-brown/5 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-brand-brown/10 flex items-center justify-center text-brand-brown shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></svg>
                    </div>
                    <div>
                        <h3 className="font-display font-bold text-lg text-zinc-900">Display Settings</h3>
                        <p className="text-sm text-zinc-500">Customize the look and feel</p>
                    </div>
                </div>
                <div className="p-4 md:p-8 space-y-6 md:space-y-8">
                    <div className="grid md:grid-cols-2 gap-4 md:gap-8">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">
                                Discount Badge Text <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="badge"
                                defaultValue={offer?.discountText}
                                required
                                placeholder="e.g., Up to 20% OFF"
                                className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/5 outline-none transition-all duration-300 placeholder:text-zinc-400"
                            />
                            <p className="text-xs text-zinc-400 mt-2">Short text shown on the offer card.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">
                                Top Badge (Optional)
                            </label>
                            <input
                                type="text"
                                name="topBadge"
                                defaultValue={offer?.badge || ""}
                                placeholder="e.g., Limited Time"
                                className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/5 outline-none transition-all duration-300 placeholder:text-zinc-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-4">
                            Color Theme
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {colorSchemes.map((scheme) => {
                                let bgClass = "bg-zinc-200";
                                switch (scheme.value) {
                                    case "brand-brown": bgClass = "bg-gradient-to-r from-brand-brown to-amber-700"; break;
                                    case "brand-pink": bgClass = "bg-gradient-to-r from-brand-pink-dark to-rose-400"; break;
                                    case "green": bgClass = "bg-gradient-to-r from-emerald-500 to-green-600"; break;
                                    case "blue": bgClass = "bg-gradient-to-r from-sky-500 to-blue-600"; break;
                                    case "purple": bgClass = "bg-gradient-to-r from-purple-500 to-violet-600"; break;
                                    case "christmas": bgClass = "bg-gradient-to-r from-red-600 to-green-600"; break;
                                    case "halloween": bgClass = "bg-gradient-to-r from-orange-500 to-purple-600"; break;
                                }

                                return (
                                    <button
                                        key={scheme.value}
                                        type="button"
                                        onClick={() => setSelectedColor(scheme.value)}
                                        className={`relative group p-4 rounded-2xl border-2 transition-all duration-300 text-left ${selectedColor === scheme.value
                                            ? "border-brand-brown bg-brand-brown/5 ring-1 ring-brand-brown/20"
                                            : "border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-sm"
                                            }`}
                                    >
                                        <div className={`w-full h-12 rounded-lg mb-3 ${bgClass} shadow-sm opacity-90`}></div>
                                        <span className={`block text-sm font-medium ${selectedColor === scheme.value ? "text-brand-brown" : "text-zinc-600"}`}>
                                            {scheme.label}
                                        </span>
                                        {selectedColor === scheme.value && (
                                            <div className="absolute top-3 right-3 text-brand-brown">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <input type="hidden" name="colorScheme" value={selectedColor} />
                    </div>

                    <div className="border-t border-zinc-100 pt-6 md:pt-8">
                        <h4 className="font-bold text-zinc-900 mb-4 md:mb-6">Button Settings</h4>
                        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
                            <div>
                                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                                    Button Label
                                </label>
                                <input
                                    type="text"
                                    name="ctaText"
                                    defaultValue={offer?.ctaText || "Shop Now"}
                                    required
                                    placeholder="e.g., Shop Now"
                                    className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/5 outline-none transition-all duration-300 placeholder:text-zinc-400"
                                />
                                <p className="text-xs text-zinc-400 mt-2">The text that appears on the button.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                                    Destination Page
                                </label>
                                <div className="space-y-3">
                                    <select
                                        value={linkType}
                                        onChange={(e) => {
                                            const newVal = e.target.value;
                                            setLinkType(newVal);
                                            if (newVal !== "custom") {
                                                setLinkValue(newVal);
                                            } else {
                                                setLinkValue("");
                                            }
                                        }}
                                        className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/5 outline-none transition-all duration-300 bg-transparent"
                                    >
                                        <option value="/shop">Shop All Products (/shop)</option>
                                        <option value="/contact">Contact Us (/contact)</option>
                                        <option value="/">Home Page (/)</option>
                                        <option value="custom">Custom URL...</option>
                                    </select>

                                    <input
                                        type="text"
                                        name="ctaLink"
                                        value={linkValue}
                                        onChange={(e) => setLinkValue(e.target.value)}
                                        required
                                        placeholder="e.g., /product/cookie-box"
                                        className={`w-full px-4 py-2.5 md:py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/5 outline-none transition-all duration-300 placeholder:text-zinc-400 ${linkType !== "custom" ? "hidden" : "block"}`}
                                    />
                                </div>
                                <p className="text-xs text-zinc-400 mt-2">Where the customer goes when they click.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Validity & Status */}
            <section
                className="bg-white rounded-3xl shadow-soft border border-zinc-100 overflow-hidden animate-slide-up"
                style={{ animationDelay: "300ms" }}
            >
                <div className="bg-gradient-to-r from-brand-cream to-white px-5 py-4 md:px-8 md:py-6 border-b border-brand-brown/5 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-brand-brown/10 flex items-center justify-center text-brand-brown shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </div>
                    <div>
                        <h3 className="font-display font-bold text-lg text-zinc-900">Validity & Status</h3>
                        <p className="text-sm text-zinc-500">Set the duration and visibility</p>
                    </div>
                </div>
                <div className="p-4 md:p-8 space-y-6 md:space-y-8">
                    <div className="grid md:grid-cols-2 gap-4 md:gap-8">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">
                                Valid From <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="validFrom"
                                defaultValue={formatDateForInput(offer?.validFrom || new Date())}
                                required
                                className="w-full min-w-0 max-w-full px-4 py-2.5 md:py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/5 outline-none transition-all duration-300 text-xs sm:text-sm text-zinc-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">
                                Valid Until <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="validUntil"
                                defaultValue={formatDateForInput(offer?.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))}
                                required
                                className="w-full min-w-0 max-w-full px-4 py-2.5 md:py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-brand-brown focus:ring-4 focus:ring-brand-brown/5 outline-none transition-all duration-300 text-xs sm:text-sm text-zinc-600"
                            />
                        </div>
                    </div>

                    <div className="bg-zinc-50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-zinc-100">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-brown shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-zinc-900">Active Status</h4>
                                <p className="text-sm text-zinc-500">If unchecked, this offer will be hidden.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer self-end sm:self-auto">
                            <input type="checkbox" name="active" defaultChecked={offer?.active ?? true} className="sr-only peer" />
                            <div className="w-14 h-7 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-brown/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-brown"></div>
                        </label>
                    </div>
                </div>
            </section>

            {/* Sticky Save Button for Mobile */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-zinc-200 md:relative md:bg-transparent md:border-t-0 md:p-0 z-50">
                <div className="max-w-4xl mx-auto">
                    <button
                        type="submit"
                        className="w-full bg-brand-brown text-white font-bold py-4 rounded-xl shadow-strong hover:bg-brand-brown-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                        {isEdit ? "Update Offer" : "Create Offer"}
                    </button>
                </div>
            </div>
        </div>
    );
}

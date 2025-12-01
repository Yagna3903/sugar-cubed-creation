"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCheckboxCard from "@/components/product-checkbox-card";
import { BackButton } from "@/components/ui/back-button";

import { IconChefHat } from "@/components/ui/bakery-icons";

interface Product {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  badges: string[];
  customIcon?: React.ReactNode;
}

export default function CorporateInquiryPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());

  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    email: "",
    message: "",
  });

  // Fetch products available for corporate from API
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products/corporate");
        const data = await res.json();

        // Add "Custom" option
        const customOption: Product = {
          id: "custom-request",
          slug: "custom-request",
          name: "Custom / Other Request",
          imageUrl: "",
          badges: ["custom"],
          customIcon: <IconChefHat className="w-24 h-24 text-brand-brown/60" strokeWidth={1} />
        };

        setProducts([...data, customOption]);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    }
    loadProducts();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleProduct = (productId: string) => {
    const newSelection = new Set(selectedProductIds);
    if (newSelection.has(productId)) {
      newSelection.delete(productId);
    } else {
      newSelection.add(productId);
    }
    setSelectedProductIds(newSelection);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedProductIds.size === 0) {
      setError("Please select at least one cookie type");
      return;
    }

    setSubmitting(true);
    setError(null);

    const selectedProducts = products
      .filter((p) => selectedProductIds.has(p.id))
      .map((p) => ({
        id: p.id,
        name: p.name,
        imageUrl: p.imageUrl,
        slug: p.slug,
      }));

    try {
      const response = await fetch("/api/corporate-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          companyName: form.companyName,
          email: form.email,
          selectedProducts,
          message: form.message,
        }),
      });

      if (response.ok) {
        setSent(true);
      } else {
        const data = await response.json();
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Error sending form. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-cream/50 via-white to-brand-pink/30 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-zinc-200/50 p-6 sm:p-10 text-center">
          <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4 sm:mb-6">
            <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-brand-brown mb-3 sm:mb-4">
            Thank You!
          </h1>
          <p className="text-zinc-600 mb-6 sm:mb-8 text-sm sm:text-base">
            Your corporate inquiry has been submitted successfully. A confirmation email has been sent to{" "}
            <span className="font-semibold text-brand-brown">{form.email}</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-brown text-white px-6 py-3 font-semibold hover:bg-brand-brown/90 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-zinc-200 bg-white text-zinc-700 px-6 py-3 font-medium hover:border-brand-brown/30 hover:bg-brand-cream/30 transition-all"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream/50 via-white to-brand-pink/30 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton href="/">Back to Home</BackButton>
        </div>

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-brown to-brand-brown/80 text-white text-2xl sm:text-3xl shadow-lg mb-4 sm:mb-6">
            🍪
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-brown mb-2 sm:mb-3">
            Corporate Inquiry
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto">
            Custom printed logo cookies                  Let&apos;s create something sweet together! Fill out the form below and we&apos;ll get back to you within 24 hours.         </p>
        </div>

        <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xl border border-zinc-200/50 p-6 sm:p-8 space-y-6 sm:space-y-8">
          {/* Error message */}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-start gap-2">
              <span className="text-lg flex-shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-5 sm:space-y-6">
            <h2 className="text-xl font-bold text-zinc-900">Contact Information</h2>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-zinc-700">Full Name *</span>
                <input
                  className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 sm:py-3 focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/20 transition-all outline-none text-sm sm:text-base"
                  name="fullName"
                  value={form.fullName}
                  onChange={onChange}
                  required
                  placeholder="John Doe"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-zinc-700">Company Name</span>
                <input
                  className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 sm:py-3 focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/20 transition-all outline-none text-sm sm:text-base"
                  name="companyName"
                  value={form.companyName}
                  onChange={onChange}
                  placeholder="Acme Inc."
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-zinc-700">Email Address *</span>
              <input
                type="email"
                className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 sm:py-3 focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/20 transition-all outline-none text-sm sm:text-base"
                name="email"
                value={form.email}
                onChange={onChange}
                required
                placeholder="john@company.com"
              />
            </label>
          </div>

          {/* Cookie Selection */}
          <div className="space-y-4 sm:space-y-5">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-1">
                Select Cookies *
              </h2>
              <p className="text-sm text-zinc-600">
                Choose one or more cookie types for your corporate order
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {products.map((product) => (
                <ProductCheckboxCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  imageUrl={product.imageUrl}
                  badges={product.badges}
                  selected={selectedProductIds.has(product.id)}
                  onToggle={toggleProduct}
                  customIcon={product.customIcon}
                />
              ))}
            </div>

            {selectedProductIds.size > 0 && (
              <p className="text-sm text-green-600 font-medium">
                ✓ {selectedProductIds.size} cookie type{selectedProductIds.size > 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          {/* Message */}
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-zinc-700">Additional Message (Optional)</span>
            <textarea
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/20 transition-all outline-none resize-none text-sm sm:text-base"
              name="message"
              value={form.message}
              onChange={onChange}
              rows={4}
              placeholder="Tell us about your event, quantity needed, or any special requirements..."
            />
          </label>

          {/* Info note */}
          <div className="rounded-xl bg-brand-cream/30 border border-brand-brown/20 p-4 text-xs sm:text-sm text-zinc-700">
            <strong>Note:</strong> Custom cookies are printed on a food-safe printer (not hand-piped). Standard flavor is vanilla; corporate cookies also available in chocolate chip. Minimum order quantities may apply.
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting || selectedProductIds.size === 0}
            className="w-full rounded-xl bg-gradient-to-r from-brand-brown to-brand-brown/90 px-6 py-3.5 sm:py-4 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Inquiry"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

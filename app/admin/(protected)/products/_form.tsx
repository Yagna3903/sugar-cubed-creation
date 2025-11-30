"use client";

import { useState, useTransition } from "react";
import ImageUpload from "@/app/admin/_components/ImageUpload";
import {
  IconCheck,
  IconBox,
  IconCurrencyDollar,
  IconPhoto,
  IconTag,
  IconSettings,
  IconAlignLeft,
  IconX
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

type ProductFormProps = {
  mode: "new" | "edit";
  action: (formData: FormData) => Promise<void>;
  initial?: {
    id: string;
    name: string;
    slug: string;
    priceCents: number;
    description: string;
    badges: string[];
    active: boolean;
    availableForCorporate?: boolean;
    stock: number;
    maxPerOrder: number;
    imageUrl: string;
  };
};

const AVAILABLE_BADGES = [
  "Seasonal",
  "Custom Printed",
  "Corporate",
  "Best Sellers",
  "New"
];

export default function ProductForm({ initial, action, mode }: ProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const [showToast, setShowToast] = useState(false);
  const [selectedBadges, setSelectedBadges] = useState<string[]>(initial?.badges || []);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await action(formData);
        if (mode === "edit") {
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      } catch (error) {
        console.error("Failed to save product", error);
        alert("Failed to save product. Please check your input.");
      }
    });
  }

  const toggleBadge = (badge: string) => {
    const slugifiedBadge = badge.toLowerCase().replace(/\s+/g, "-");
    if (selectedBadges.includes(slugifiedBadge)) {
      setSelectedBadges(selectedBadges.filter(b => b !== slugifiedBadge));
    } else {
      setSelectedBadges([...selectedBadges, slugifiedBadge]);
    }
  };

  // Shared input class for consistency
  const inputClass = "w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3 focus:bg-white focus:border-brand-brown focus:ring-1 focus:ring-brand-brown focus:outline-none transition-all shadow-sm";

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-zinc-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50">
          <div className="bg-green-500 rounded-full p-1">
            <IconCheck size={14} className="text-white" />
          </div>
          <span className="font-medium">Changes saved successfully</span>
        </div>
      )}

      <form action={handleSubmit} className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* General Info Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-brown/5">
              <div className="flex items-center gap-2 mb-6 text-brand-brown">
                <IconAlignLeft size={20} />
                <h2 className="font-bold text-lg">General Information</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Product Name</label>
                  <input
                    name="name"
                    defaultValue={initial?.name ?? ""}
                    required
                    className={inputClass}
                    placeholder="e.g. Chocolate Chunk Cookie"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    defaultValue={initial?.description ?? ""}
                    rows={6}
                    className={`${inputClass} resize-none`}
                    placeholder="Describe your delicious product..."
                  />
                </div>
              </div>
            </div>

            {/* Media Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-brown/5">
              <div className="flex items-center gap-2 mb-6 text-brand-brown">
                <IconPhoto size={20} />
                <h2 className="font-bold text-lg">Media</h2>
              </div>
              <ImageUpload
                name="image"
                defaultValue={initial?.imageUrl || ""}
                label="Product Image"
              />
            </div>

            {/* Inventory Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-brown/5">
              <div className="flex items-center gap-2 mb-6 text-brand-brown">
                <IconBox size={20} />
                <h2 className="font-bold text-lg">Inventory</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Stock Level</label>
                  <input
                    type="number"
                    name="stock"
                    defaultValue={initial?.stock ?? 0}
                    min={0}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Max Per Order</label>
                  <input
                    type="number"
                    name="maxPerOrder"
                    defaultValue={initial?.maxPerOrder ?? 12}
                    min={1}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">

            {/* Status Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-brown/5">
              <div className="flex items-center gap-2 mb-6 text-brand-brown">
                <IconSettings size={20} />
                <h2 className="font-bold text-lg">Status</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-200 hover:border-brand-brown/30 transition-colors cursor-pointer" onClick={() => document.getElementById('active')?.click()}>
                  <label htmlFor="active" className="text-sm font-medium text-zinc-700 cursor-pointer select-none flex-1">Active in Store</label>
                  <input
                    type="checkbox"
                    name="active"
                    id="active"
                    defaultChecked={initial?.active ?? true}
                    className="rounded border-zinc-300 text-brand-brown focus:ring-brand-brown w-5 h-5 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-200 hover:border-brand-brown/30 transition-colors cursor-pointer" onClick={() => document.getElementById('corporate')?.click()}>
                  <label htmlFor="corporate" className="text-sm font-medium text-zinc-700 cursor-pointer select-none flex-1">Corporate Available</label>
                  <input
                    type="checkbox"
                    name="availableForCorporate"
                    id="corporate"
                    defaultChecked={initial?.availableForCorporate ?? false}
                    className="rounded border-zinc-300 text-brand-brown focus:ring-brand-brown w-5 h-5 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-brown/5">
              <div className="flex items-center gap-2 mb-6 text-brand-brown">
                <IconCurrencyDollar size={20} />
                <h2 className="font-bold text-lg">Pricing</h2>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">Price (CAD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-zinc-500 font-medium">$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    defaultValue={
                      initial?.priceCents != null ? (initial.priceCents / 100).toFixed(2) : ""
                    }
                    required
                    className={`${inputClass} pl-8 font-medium`}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Organization Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-brown/5">
              <div className="flex items-center gap-2 mb-6 text-brand-brown">
                <IconTag size={20} />
                <h2 className="font-bold text-lg">Organization</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">URL Slug</label>
                  <input
                    name="slug"
                    defaultValue={initial?.slug ?? ""}
                    placeholder="classic-chocolate-cookie"
                    required
                    className={`${inputClass} text-sm`}
                  />
                  <p className="mt-2 text-xs text-zinc-400">
                    Used in the product URL. Letters, numbers, and dashes only.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Badges</label>
                  <input type="hidden" name="badges" value={selectedBadges.join(", ")} />

                  <div className="flex flex-wrap gap-2 mb-3">
                    {AVAILABLE_BADGES.map(badge => {
                      const slug = badge.toLowerCase().replace(/\s+/g, "-");
                      const isSelected = selectedBadges.includes(slug);
                      return (
                        <button
                          key={slug}
                          type="button"
                          onClick={() => toggleBadge(badge)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${isSelected
                              ? "bg-brand-brown text-white border-brand-brown shadow-sm"
                              : "bg-white text-zinc-600 border-zinc-200 hover:border-brand-brown/50 hover:text-brand-brown"
                            }`}
                        >
                          {badge}
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Badges Display */}
                  {selectedBadges.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedBadges.map(slug => (
                        <span key={slug} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-brown/10 text-brand-brown text-xs font-medium border border-brand-brown/10">
                          {slug}
                          <button
                            type="button"
                            onClick={() => setSelectedBadges(selectedBadges.filter(b => b !== slug))}
                            className="hover:text-red-500 transition-colors"
                          >
                            <IconX size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-brand-brown text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-brown/90 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-brand-brown/20 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {mode === "new" ? "Creating..." : "Saving..."}
                  </>
                ) : (
                  mode === "new" ? "Create Product" : "Save Changes"
                )}
              </button>
            </div>

          </div>
        </div>
      </form>
    </>
  );
}

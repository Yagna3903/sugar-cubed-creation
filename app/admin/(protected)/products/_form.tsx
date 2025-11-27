"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Image from "next/image";

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

export default function ProductForm({ initial, action, mode }: ProductFormProps) {
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await action(formData);
    } finally {
      setBusy(false);
    }
  }

  const defaultBadges =
    initial?.badges && initial.badges.length > 0
      ? initial.badges.join(", ")
      : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          name="name"
          defaultValue={initial?.name ?? ""}
          required
          className="mt-1 w-full rounded-xl border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Slug</label>
        <input
          name="slug"
          defaultValue={initial?.slug ?? ""}
          placeholder="classic-vanilla-sugar"
          required
          className="mt-1 w-full rounded-xl border px-3 py-2"
        />
        <p className="mt-1 text-xs text-zinc-500">
          Letters, numbers, and dashes only. Used in URLs.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium">Price (CAD)</label>
        <input
          type="number"
          step="0.01"
          name="price"
          defaultValue={
            initial?.priceCents != null ? initial.priceCents / 100 : ""
          }
          required
          className="mt-1 w-full rounded-xl border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          defaultValue={initial?.description ?? ""}
          rows={3}
          className="mt-1 w-full rounded-xl border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          Badges (comma separated)
        </label>
        <input
          name="badges"
          placeholder="seasonal, best-seller"
          defaultValue={defaultBadges}
          className="mt-1 w-full rounded-xl border px-3 py-2"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Stock</label>
          <input
            type="number"
            name="stock"
            defaultValue={initial?.stock ?? 0}
            min={0}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Max per order</label>
          <input
            type="number"
            name="maxPerOrder"
            defaultValue={initial?.maxPerOrder ?? 12}
            min={1}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="active"
          defaultChecked={initial?.active ?? true}
          className="rounded"
        />
        <label className="text-sm">Active (visible in store)</label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="availableForCorporate"
          defaultChecked={initial?.availableForCorporate ?? false}
          className="rounded"
        />
        <label className="text-sm">Available for Corporate Inquiries</label>
      </div>

      <div>
        <label className="block text-sm font-medium">Image</label>
        <input type="file" name="image" className="mt-1" accept="image/*" />
        {initial?.imageUrl && (
          <div className="mt-2 h-24 w-24 relative rounded-lg overflow-hidden border">
            <Image
              src={initial.imageUrl}
              alt="Preview"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={busy}
        className="rounded-xl bg-brand-brown px-4 py-2 text-white disabled:opacity-70"
      >
        {busy ? "Saving…" : mode === "new" ? "Create product" : "Save changes"}
      </button>
    </form>
  );
}

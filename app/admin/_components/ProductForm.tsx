"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Image from "next/image";

type ProductFormProps = {
  initialData?: {
    id?: string;
    name: string;
    price: number;
    description?: string;
    stock: number;
    orderLimit?: number;
    imageUrl?: string;
  };
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel?: string;
};

export default function ProductForm({
  initialData,
  onSubmit,
  submitLabel = "Save product",
}: ProductFormProps) {
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setBusy(true);
    await onSubmit(formData);
    setBusy(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          defaultValue={initialData?.name}
          className="mt-1 w-full rounded-xl border px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Price ($)</label>
        <input
          type="number"
          step="0.01"
          name="price"
          defaultValue={initialData?.price}
          className="mt-1 w-full rounded-xl border px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          defaultValue={initialData?.description}
          className="mt-1 w-full rounded-xl border px-3 py-2"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Stock</label>
          <input
            type="number"
            name="stock"
            defaultValue={initialData?.stock ?? 0}
            className="mt-1 w-full rounded-xl border px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Order limit</label>
          <input
            type="number"
            name="orderLimit"
            defaultValue={initialData?.orderLimit ?? 0}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
          <p className="text-xs text-zinc-500">0 = no limit</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Image</label>
        <input type="file" name="image" accept="image/*" />
        {initialData?.imageUrl && (
          <div className="mt-2 h-20 w-20 relative rounded-lg overflow-hidden border">
            <Image
              src={initialData.imageUrl}
              alt="Current"
              fill
              className="object-cover rounded"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-xl bg-brand-brown px-4 py-2 text-white disabled:opacity-70"
      >
        {busy ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

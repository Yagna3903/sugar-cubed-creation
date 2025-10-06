"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductForm({
  initial,
  action,
  mode,
}: {
  initial?: any;
  action: (formData: FormData) => void;
  mode: "new" | "edit";
}) {
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    await action(formData);
    setBusy(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          name="name"
          defaultValue={initial?.name}
          required
          className="mt-1 w-full rounded-xl border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Slug</label>
        <input
          name="slug"
          defaultValue={initial?.slug}
          required
          className="mt-1 w-full rounded-xl border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Price (in dollars)</label>
        <input
          type="number"
          step="0.01"
          name="price"
          defaultValue={initial?.priceCents ? initial.priceCents / 100 : ""}
          required
          className="mt-1 w-full rounded-xl border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          defaultValue={initial?.description}
          rows={3}
          className="mt-1 w-full rounded-xl border px-3 py-2"
        />
      </div>

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

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="active"
          defaultChecked={initial?.active}
          className="rounded"
        />
        <label className="text-sm">Active (visible in store)</label>
      </div>

      <div>
        <label className="block text-sm font-medium">Image</label>
        <input type="file" name="image" className="mt-1" />
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

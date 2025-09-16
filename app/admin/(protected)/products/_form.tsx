// app/admin/(protected)/products/_form.tsx
"use client";

import { useFormStatus } from "react-dom";

type Props = {
  mode: "create" | "edit";
  action: (formData: FormData) => Promise<any>;
  initial?: {
    id: string;
    name: string;
    slug: string;
    priceCents: number;
    description?: string | null;
    badges: string[];
    active: boolean;
    stock?: number | null;
    maxPerOrder?: number | null;
    imageUrl?: string | null;
  };
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="rounded-xl bg-brand-brown px-5 py-2 text-white disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

export default function ProductForm({ mode, action, initial }: Props) {
  return (
    <form action={action} className="grid gap-5 max-w-2xl">
      <div className="grid gap-2">
        <label className="text-sm font-medium">Name</label>
        <input name="name" defaultValue={initial?.name} className="rounded-xl border px-3 py-2" required />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Slug</label>
        <input name="slug" defaultValue={initial?.slug} className="rounded-xl border px-3 py-2" required />
        <p className="text-xs text-zinc-500">Letters, numbers, dashes only. Used in URLs.</p>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Price (CAD)</label>
        <input
          name="price"
          defaultValue={initial ? (initial.priceCents / 100).toFixed(2) : ""}
          className="rounded-xl border px-3 py-2"
          placeholder="4.25"
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          defaultValue={initial?.description ?? ""}
          className="rounded-xl border px-3 py-2"
          rows={3}
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Badges (comma separated)</label>
        <input
          name="badges"
          defaultValue={initial?.badges?.join(", ") || ""}
          className="rounded-xl border px-3 py-2"
          placeholder="seasonal, best-seller"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={initial?.active ?? true} />
          Active
        </label>

        <div className="grid gap-1">
          <label className="text-sm">Stock</label>
          <input
            name="stock"
            type="number"
            min={0}
            defaultValue={initial?.stock ?? 0}
            className="w-28 rounded-xl border px-3 py-2"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm">Max per order</label>
          <input
            name="maxPerOrder"
            type="number"
            min={1}
            defaultValue={initial?.maxPerOrder ?? 12}
            className="w-28 rounded-xl border px-3 py-2"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Image</label>
        <input type="file" name="image" accept="image/*" />
        {initial?.imageUrl && (
          <img
            src={initial.imageUrl}
            alt={initial.name}
            className="mt-2 h-28 w-28 rounded-xl object-cover border"
          />
        )}
      </div>

      <div className="pt-2">
        <SubmitButton label={mode === "create" ? "Create product" : "Save changes"} />
      </div>
    </form>
  );
}

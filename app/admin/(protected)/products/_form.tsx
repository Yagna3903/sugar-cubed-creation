"use client";

import { useFormStatus } from "react-dom";
import Image from "next/image";

type Props = {
  mode: "create" | "edit";
  action: (formData: FormData) => Promise<void>;
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
      {/* ... unchanged fields ... */}

      <div className="grid gap-2">
        <label className="text-sm font-medium">Image</label>
        <input type="file" name="image" accept="image/*" />
        {initial?.imageUrl && (
          <Image
            src={initial.imageUrl}
            alt={initial.name}
            width={112}
            height={112}
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

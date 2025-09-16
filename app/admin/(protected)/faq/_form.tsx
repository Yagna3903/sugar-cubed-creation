"use client";

import { useFormStatus } from "react-dom";

type Props = {
  mode: "create" | "edit";
  action: (formData: FormData) => Promise<any>;
  initial?: {
    id: string;
    question: string;
    answer: string;
    active: boolean;
    sort?: number | null;
  };
};

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="rounded-xl bg-brand-brown px-5 py-2 text-white disabled:opacity-60" disabled={pending}>
      {pending ? "Saving…" : label}
    </button>
  );
}

export default function FaqForm({ mode, action, initial }: Props) {
  return (
    <form action={action} className="grid max-w-2xl gap-5">
      <div className="grid gap-2">
        <label className="text-sm font-medium">Question</label>
        <input
          name="question"
          defaultValue={initial?.question}
          className="rounded-xl border px-3 py-2"
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Answer</label>
        <textarea
          name="answer"
          defaultValue={initial?.answer}
          rows={5}
          className="rounded-xl border px-3 py-2"
          required
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={initial?.active ?? true} /> Active
        </label>
        <div className="grid gap-1">
          <label className="text-sm">Sort (optional)</label>
          <input
            type="number"
            name="sort"
            className="w-28 rounded-xl border px-3 py-2"
            defaultValue={initial?.sort ?? ""}
          />
        </div>
      </div>

      <div className="pt-2">
        <Submit label={mode === "create" ? "Create entry" : "Save changes"} />
      </div>
    </form>
  );
}

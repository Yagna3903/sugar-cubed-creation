"use client";
export const dynamic = "force-dynamic";

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
    <button
      className="btn-primary w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-brand-brown/20"
      disabled={pending}
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

export default function FaqForm({ mode, action, initial }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-brand-brown/5 shadow-soft p-6 md:p-8 max-w-3xl">
      <form action={action} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-brand-brown ml-1">Question</label>
          <input
            name="question"
            defaultValue={initial?.question}
            className="w-full rounded-xl border-2 border-zinc-100 bg-zinc-50/50 px-4 py-3 font-medium text-zinc-800 transition-all focus:border-brand-brown focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-brown/5 placeholder:text-zinc-400"
            placeholder="e.g. Do you ship nationwide?"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-brand-brown ml-1">Answer</label>
          <textarea
            name="answer"
            defaultValue={initial?.answer}
            rows={6}
            className="w-full rounded-xl border-2 border-zinc-100 bg-zinc-50/50 px-4 py-3 font-medium text-zinc-800 transition-all focus:border-brand-brown focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-brown/5 resize-y placeholder:text-zinc-400 leading-relaxed"
            placeholder="Provide a helpful answer..."
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-2">
          <div className="flex items-center gap-3 bg-zinc-50 p-3 rounded-xl border border-zinc-100 hover:border-brand-brown/20 transition-colors cursor-pointer group">
            <input
              type="checkbox"
              name="active"
              id="active"
              defaultChecked={initial?.active ?? true}
              className="w-5 h-5 rounded text-brand-brown focus:ring-brand-brown border-zinc-300 cursor-pointer"
            />
            <label htmlFor="active" className="text-sm font-medium text-zinc-700 cursor-pointer select-none group-hover:text-brand-brown transition-colors">
              Active (visible on site)
            </label>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-zinc-600 whitespace-nowrap">Sort Order:</label>
            <input
              type="number"
              name="sort"
              className="w-24 rounded-xl border-2 border-zinc-100 bg-zinc-50/50 px-3 py-2 text-center font-mono font-medium focus:border-brand-brown focus:outline-none transition-all"
              defaultValue={initial?.sort ?? ""}
              placeholder="0"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-brand-brown/5 flex justify-end">
          <Submit label={mode === "create" ? "Create Entry" : "Save Changes"} />
        </div>
      </form>
    </div>
  );
}

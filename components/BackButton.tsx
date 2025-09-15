"use client";
import { useRouter } from "next/navigation";

export default function BackButton({
  fallbackHref = "/shop",
  label = "Back",
}: {
  fallbackHref?: string;
  label?: string;
}) {
  const router = useRouter();
  return (
    <button
      onClick={() =>
        history.length > 1 ? router.back() : router.push(fallbackHref)
      }
      className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50"
      aria-label={label}
    >
      <span aria-hidden>←</span>
      {label}
    </button>
  );
}

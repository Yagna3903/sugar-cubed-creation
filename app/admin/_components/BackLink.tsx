"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
  href?: string;
  children?: ReactNode;
  className?: string;
};

export default function BackLink({ href, children = "Back to Dashboard", className }: Props) {
  const router = useRouter();

  const base =
    "inline-flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-full text-sm font-medium text-brand-brown hover:bg-zinc-50 hover:border-brand-brown/20 transition-all shadow-sm group";

  const icon = (
    <svg
      className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );

  if (href) {
    return (
      <Link href={href} className={`${base} ${className ?? ""}`}>
        {icon} {children}
      </Link>
    );
  }
  return (
    <button onClick={() => router.back()} className={`${base} ${className ?? ""}`}>
      {icon} {children}
    </button>
  );
}

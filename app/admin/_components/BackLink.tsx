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

export default function BackLink({ href, children = "Back", className }: Props) {
  const router = useRouter();

  const base =
    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm " +
    "bg-white hover:bg-zinc-50 text-brand-brown transition";

  if (href) {
    return (
      <Link href={href} className={`${base} ${className ?? ""}`}>
        <span aria-hidden>←</span> {children}
      </Link>
    );
  }
  return (
    <button onClick={() => router.back()} className={`${base} ${className ?? ""}`}>
      <span aria-hidden>←</span> {children}
    </button>
  );
}

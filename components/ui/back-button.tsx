"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
    href?: string;
    children?: ReactNode;
    className?: string;
};

export function BackButton({ href, children = "Back", className }: Props) {
    const router = useRouter();

    const base =
        "inline-flex items-center gap-2 rounded-full border border-brand-brown/10 bg-white/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-brand-brown hover:bg-white hover:shadow-soft transition-all duration-300";

    if (href) {
        return (
            <Link href={href} className={cn(base, className)}>
                <span aria-hidden className="text-lg leading-none pb-0.5">←</span> {children}
            </Link>
        );
    }
    return (
        <button onClick={() => router.back()} className={cn(base, className)}>
            <span aria-hidden className="text-lg leading-none pb-0.5">←</span> {children}
        </button>
    );
}

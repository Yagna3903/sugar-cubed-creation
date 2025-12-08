// app/admin/_components/StatusBadge.tsx
"use client";

import { ReactNode } from "react";

type StatusType =
    | "pending"
    | "paid"
    | "fulfilled"
    | "cancelled"
    | "refunded"
    | "archived"
    | "active";

interface StatusBadgeProps {
    status: StatusType;
    children?: ReactNode;
    showIcon?: boolean;
    pulse?: boolean;
}

const statusConfig: Record<
    StatusType,
    { bg: string; text: string; icon: string }
> = {
    pending: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        icon: "•",
    },
    paid: {
        bg: "bg-green-50",
        text: "text-green-700",
        icon: "✓",
    },
    fulfilled: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: "🚚",
    },
    cancelled: {
        bg: "bg-red-100",
        text: "text-red-700",
        icon: "✗",
    },
    refunded: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        icon: "↩",
    },
    archived: {
        bg: "bg-zinc-200",
        text: "text-zinc-700",
        icon: "📦",
    },
    active: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: "✓",
    },
};

export default function StatusBadge({
    status,
    children,
    showIcon = true,
    pulse = false,
}: StatusBadgeProps) {
    const config = statusConfig[status] || {
        bg: "bg-zinc-100",
        text: "text-zinc-700",
        icon: "•",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.text} ${pulse ? "animate-pulse" : ""
                }`}
        >
            {showIcon && <span className="text-[10px]">{config.icon}</span>}
            {children || status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

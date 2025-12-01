// app/admin/_components/StatsCard.tsx
"use client";

import { ReactNode } from "react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    subtitle?: string;
    href?: string;
    loading?: boolean;
}

export default function StatsCard({
    title,
    value,
    icon,
    trend,
    subtitle,
    loading = false,
}: StatsCardProps) {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-zinc-100">
                <div className="animate-pulse">
                    <div className="h-4 bg-zinc-200 rounded w-1/2 mb-3"></div>
                    <div className="h-8 bg-zinc-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-zinc-200 rounded w-1/3"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-soft border border-white/50 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-brand-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Gradient accent on hover */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-brand-pink via-brand-brown to-brand-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm font-medium text-zinc-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-zinc-900 font-display">
                        {value}
                    </p>
                </div>
                {icon && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-cream to-brand-pink/50 text-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-sm group-hover:shadow-md">
                        {icon}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3">
                {trend && (
                    <div
                        className={`flex items-center gap-1 text-sm font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        <span>{trend.isPositive ? "↑" : "↓"}</span>
                        <span>{Math.abs(trend.value)}%</span>
                    </div>
                )}
                {subtitle && (
                    <p className="text-xs text-zinc-500">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}

// app/admin/_components/EmptyState.tsx

import Link from "next/link";

interface EmptyStateProps {
    icon?: string;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
}

export default function EmptyState({
    icon = "📦",
    title,
    description,
    actionLabel,
    actionHref,
}: EmptyStateProps) {
    return (
        <div className="bg-white rounded-3xl p-16 text-center shadow-soft border border-zinc-100 animate-fadeIn">
            <div className="max-w-md mx-auto">
                {/* Icon */}
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-brand-cream to-brand-pink/50 flex items-center justify-center text-5xl animate-bounceIn">
                    {icon}
                </div>

                {/* Text */}
                <h3 className="font-display text-2xl font-bold text-zinc-900 mb-3">
                    {title}
                </h3>
                <p className="text-zinc-600 mb-8">{description}</p>

                {/* Action */}
                {actionLabel && actionHref && (
                    <Link
                        href={actionHref}
                        className="inline-block bg-brand-brown text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-brown/90 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        {actionLabel}
                    </Link>
                )}
            </div>
        </div>
    );
}

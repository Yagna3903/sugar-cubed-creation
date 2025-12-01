"use client";

import { useState } from "react";
import { IconCopy, IconCheck } from "@tabler/icons-react";

export function PromoCodeDisplay({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="w-full bg-white/50 rounded-xl p-3 mb-5 border border-white/40 flex items-center justify-between group/code hover:bg-white/80 transition-all cursor-pointer"
            title="Click to copy"
        >
            <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Use Code:
            </div>
            <div className="font-mono font-bold text-lg tracking-widest text-zinc-800">
                {code}
            </div>
            <div className="text-zinc-400 group-hover/code:text-brand-brown transition-colors">
                {copied ? <IconCheck size={18} className="text-green-600" /> : <IconCopy size={18} />}
            </div>
        </button>
    );
}

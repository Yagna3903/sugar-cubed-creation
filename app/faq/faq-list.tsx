"use client";

import { useState } from "react";
import { IconSparkle } from "@/components/ui/bakery-icons";

type FaqItem = {
    id: string;
    question: string;
    answer: string;
};

export function FaqList({ faqs }: { faqs: FaqItem[] }) {
    const [openId, setOpenId] = useState<string | null>(null);

    const toggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="space-y-4">
            {faqs.map((f, index) => {
                const isOpen = openId === f.id;
                return (
                    <div
                        key={f.id}
                        className="group relative animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Glass Card Background */}
                        <div className={`absolute inset-0 bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm transition-all duration-300 ${isOpen ? 'shadow-lg bg-white/80 scale-[1.02]' : 'group-hover:bg-white/70'}`} />

                        <div className="relative z-10">
                            <button
                                onClick={() => toggle(f.id)}
                                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 outline-none"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-brand-brown text-white' : 'bg-brand-brown/5 text-brand-brown group-hover:bg-brand-brown/10'}`}>
                                        <span className="font-display font-bold text-sm">Q</span>
                                    </div>
                                    <span className={`font-display font-bold text-lg transition-colors ${isOpen ? 'text-brand-brown' : 'text-zinc-800'}`}>
                                        {f.question}
                                    </span>
                                </div>

                                <div className={`w-8 h-8 rounded-full border border-brand-brown/10 flex items-center justify-center transition-all duration-300 ${isOpen ? 'rotate-180 bg-brand-brown text-white border-brand-brown' : 'bg-white text-zinc-400 group-hover:text-brand-brown'}`}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="px-6 pb-6 pt-0 pl-[4.5rem]">
                                    <p className="text-zinc-600 leading-relaxed whitespace-pre-line">
                                        {f.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

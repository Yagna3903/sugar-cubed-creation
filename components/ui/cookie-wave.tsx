"use client";

import { IconCookie, IconWhisk, IconRollingPin, IconSparkle, IconWheat, IconChefHat } from "./bakery-icons";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CookieWaveProps {
    className?: string;
}

// Ordered sequence: Ingredients -> Mixing -> Rolling -> Baking -> Magic -> Cookie
const prepSequence = [
    { Icon: IconWheat, size: "w-6 h-6", label: "Ingredients" },
    { Icon: IconWhisk, size: "w-7 h-7", label: "Mixing" },
    { Icon: IconRollingPin, size: "w-8 h-8", label: "Rolling" },
    { Icon: IconChefHat, size: "w-9 h-9", label: "Baking" },
    { Icon: IconSparkle, size: "w-5 h-5", label: "Magic" },
    { Icon: IconCookie, size: "w-10 h-10", label: "Enjoy!" },
];

// Repeat the sequence to ensure enough width for the animation loop
const bakeryElements = [...prepSequence, ...prepSequence];

export function CookieWave({ className }: CookieWaveProps) {
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Get position relative to viewport
            const rect = document.body.getBoundingClientRect();
            setMouseX(e.clientX);
            setMouseY(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className={cn("relative w-full h-48 overflow-hidden flex items-center", className)}>
            {/* Gradient Overlay for seamless blending */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-cream/50 to-brand-cream pointer-events-none z-0" />

            {/* Scrolling container */}
            <div className="flex items-center animate-scroll-wave absolute left-0 z-10">
                {/* First set */}
                {bakeryElements.map((item, i) => {
                    const { Icon, size } = item;
                    // Gentler sine wave
                    const yOffset = Math.sin(i * 0.8) * 20;
                    const rotation = Math.sin(i * 0.5) * 15;

                    return (
                        <div
                            key={i}
                            className="shrink-0 px-8 md:px-12" // Increased spacing for distinct steps
                        >
                            <div
                                className={cn(
                                    "text-brand-brown/30 transition-all duration-300 ease-out hover:text-brand-brown hover:scale-125 cursor-pointer will-change-transform flex flex-col items-center gap-2 group",
                                    size
                                )}
                                style={{
                                    transform: `translateY(${yOffset}px) rotate(${rotation}deg)`,
                                }}
                                onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const centerX = rect.left + rect.width / 2;
                                    const centerY = rect.top + rect.height / 2;
                                    const deltaX = (mouseX - centerX) * 0.3;
                                    const deltaY = (mouseY - centerY) * 0.3;
                                    e.currentTarget.style.transform = `translateY(${yOffset}px) rotate(${rotation}deg) translateX(${deltaX}px) translateY(${deltaY}px)`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = `translateY(${yOffset}px) rotate(${rotation}deg)`;
                                }}
                            >
                                <Icon className={cn("w-full h-full animate-float-gentle")} />

                                {/* Optional: Tooltip/Label on hover to reinforce the "process" idea */}
                                <span className="absolute -bottom-6 text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white/80 px-2 py-0.5 rounded-full text-brand-brown pointer-events-none">
                                    {item.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
                {/* Duplicate for seamless loop */}
                {bakeryElements.map((item, i) => {
                    const { Icon, size } = item;
                    const yOffset = Math.sin(i * 0.8) * 20;
                    const rotation = Math.sin(i * 0.5) * 15;

                    return (
                        <div
                            key={`dup-${i}`}
                            className="shrink-0 px-8 md:px-12" // Increased spacing for distinct steps
                        >
                            <div
                                className={cn(
                                    "text-brand-brown/30 transition-all duration-300 ease-out hover:text-brand-brown hover:scale-125 cursor-pointer will-change-transform flex flex-col items-center gap-2 group",
                                    size
                                )}
                                style={{
                                    transform: `translateY(${yOffset}px) rotate(${rotation}deg)`,
                                }}
                                onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const centerX = rect.left + rect.width / 2;
                                    const centerY = rect.top + rect.height / 2;
                                    const deltaX = (mouseX - centerX) * 0.3;
                                    const deltaY = (mouseY - centerY) * 0.3;
                                    e.currentTarget.style.transform = `translateY(${yOffset}px) rotate(${rotation}deg) translateX(${deltaX}px) translateY(${deltaY}px)`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = `translateY(${yOffset}px) rotate(${rotation}deg)`;
                                }}
                            >
                                <Icon className={cn("w-full h-full animate-float-gentle")} />
                                <span className="absolute -bottom-6 text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white/80 px-2 py-0.5 rounded-full text-brand-brown pointer-events-none">
                                    {item.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

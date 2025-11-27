"use client";

import { IconCookie, IconWhisk, IconRollingPin, IconSparkle, IconWheat } from "./bakery-icons";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CookieWaveProps {
    className?: string;
}

// Different icons and sizes for variety
const bakeryElements = [
    { Icon: IconCookie, size: "w-6 h-6" },
    { Icon: IconCookie, size: "w-10 h-10" },
    { Icon: IconWhisk, size: "w-7 h-7" },
    { Icon: IconCookie, size: "w-8 h-8" },
    { Icon: IconSparkle, size: "w-5 h-5" },
    { Icon: IconCookie, size: "w-9 h-9" },
    { Icon: IconRollingPin, size: "w-8 h-8" },
    { Icon: IconCookie, size: "w-7 h-7" },
    { Icon: IconWheat, size: "w-6 h-6" },
    { Icon: IconCookie, size: "w-11 h-11" },
    { Icon: IconSparkle, size: "w-4 h-4" },
    { Icon: IconCookie, size: "w-8 h-8" },
];

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
            {/* Scrolling container */}
            <div className="flex items-center animate-scroll-wave absolute left-0">
                {/* First set */}
                {bakeryElements.map((item, i) => {
                    const { Icon, size } = item;
                    // Gentler sine wave
                    const yOffset = Math.sin(i * 0.8) * 20;
                    const rotation = Math.sin(i * 0.5) * 15;

                    return (
                        <div
                            key={i}
                            className="shrink-0 px-6 md:px-10" // Use padding instead of gap for perfect loop
                        >
                            <div
                                className={cn(
                                    "text-brand-brown/20 transition-all duration-300 ease-out hover:text-brand-brown/50 hover:scale-125 cursor-pointer will-change-transform",
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
                            className="shrink-0 px-6 md:px-10" // Use padding instead of gap for perfect loop
                        >
                            <div
                                className={cn(
                                    "text-brand-brown/20 transition-all duration-300 ease-out hover:text-brand-brown/50 hover:scale-125 cursor-pointer will-change-transform",
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
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

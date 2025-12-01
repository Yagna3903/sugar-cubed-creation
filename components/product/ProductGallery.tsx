"use client";

import { useState } from "react";
import Image from "next/image";
import { IconRollingPin, IconGift } from "@/components/ui/bakery-icons";

interface ProductGalleryProps {
    images: string[];
    name: string;
    isOutOfStock: boolean;
}

export default function ProductGallery({ images, name, isOutOfStock }: ProductGalleryProps) {
    // Ensure we have at least one image
    const displayImages = images.length > 0 ? images : ["/images/Main-Cookie.png"];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleImageChange = (index: number) => {
        if (index === selectedIndex) return;
        setIsAnimating(true);
        setTimeout(() => {
            setSelectedIndex(index);
            setIsAnimating(false);
        }, 300); // Match transition duration
    };

    const nextImage = () => {
        const next = (selectedIndex + 1) % displayImages.length;
        handleImageChange(next);
    };

    const prevImage = () => {
        const prev = (selectedIndex - 1 + displayImages.length) % displayImages.length;
        handleImageChange(prev);
    };

    return (
        <div className="animate-scale-in sticky top-6">
            {/* Floating decoration around image */}
            <div className="absolute -top-8 -left-8 text-brand-brown/10 animate-float-slow pointer-events-none">
                <IconRollingPin className="w-16 h-16 rotate-45" />
            </div>
            <div className="absolute -bottom-6 -right-6 text-brand-pink-dark/15 animate-bounce-gentle pointer-events-none">
                <IconGift className="w-12 h-12" />
            </div>

            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-white to-brand-cream/30 shadow-strong group transform-gpu transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
                <div className={`relative w-full h-full transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                    <Image
                        src={displayImages[selectedIndex]}
                        alt={name}
                        fill
                        priority
                        className="object-cover p-8 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                    />
                </div>

                {/* Shimmer overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-shimmer pointer-events-none" />

                {/* Navigation Arrows */}
                {displayImages.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 z-10"
                            aria-label="Previous image"
                        >
                            <svg className="w-6 h-6 text-brand-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 z-10"
                            aria-label="Next image"
                        >
                            <svg className="w-6 h-6 text-brand-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Stock Badge */}
                {isOutOfStock && (
                    <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse">
                        Out of Stock
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                    {displayImages.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => handleImageChange(index)}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedIndex === index
                                ? "border-brand-brown ring-2 ring-brand-brown/20 opacity-100"
                                : "border-transparent opacity-60 hover:opacity-100 hover:border-brand-brown/50"
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${name} view ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

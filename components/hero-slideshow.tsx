"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function HeroSlideshow({ images }: { images: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000); // Change slide every 4 seconds

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="relative w-full h-full">
            {images.map((src, index) => (
                <div
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    <Image
                        src={src}
                        alt={`Hero slide ${index + 1}`}
                        fill
                        priority={index === 0}
                        className="object-contain p-8 transition-transform duration-[4000ms] ease-linear scale-100 hover:scale-105"
                    />
                </div>
            ))}
        </div>
    );
}

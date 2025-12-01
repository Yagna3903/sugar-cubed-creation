"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { IconX, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface ImageGalleryProps {
    images: string[];
    title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setIsOpen(true);
        // Prevent scrolling when lightbox is open
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setIsOpen(false);
        document.body.style.overflow = "unset";
    };

    const nextImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, nextImage, prevImage]);

    if (!images || images.length === 0) return null;

    return (
        <>
            {/* Grid View */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => openLightbox(index)}
                        className="relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group w-full"
                    >
                        <Image
                            src={img}
                            alt={`${title} - Photo ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                            <div className="bg-white/90 p-3 rounded-full opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                                <svg className="w-6 h-6 text-brand-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Lightbox Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200"
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all z-50"
                    >
                        <IconX size={32} />
                    </button>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevImage}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-50"
                    >
                        <IconChevronLeft size={40} />
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-50"
                    >
                        <IconChevronRight size={40} />
                    </button>

                    {/* Main Image */}
                    <div
                        className="relative w-full h-full max-w-6xl max-h-[85vh] mx-4 md:mx-20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={images[currentIndex]}
                            alt={`${title} - Photo ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                            priority
                        />

                        {/* Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-1 rounded-full text-sm font-medium backdrop-blur-md">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

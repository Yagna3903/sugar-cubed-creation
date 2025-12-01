"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { uploadImage } from "../actions/upload";
import { IconX, IconUpload, IconPhoto } from "@tabler/icons-react";

interface ImageUploadProps {
    name: string;
    defaultValue?: string | string[];
    label?: string;
    multiple?: boolean;
}

export default function ImageUpload({ name, defaultValue, label = "Image", multiple = false }: ImageUploadProps) {
    // Normalize initial value to array
    const initialImages = Array.isArray(defaultValue)
        ? defaultValue
        : defaultValue
            ? [defaultValue]
            : [];

    const [images, setImages] = useState<string[]>(initialImages);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync internal state if defaultValue changes (e.g. after form reset)
    useEffect(() => {
        const newImages = Array.isArray(defaultValue)
            ? defaultValue
            : defaultValue
                ? [defaultValue]
                : [];
        setImages(newImages);
    }, [defaultValue]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        try {
            const newUrls: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append("file", file);
                const { url } = await uploadImage(formData);
                newUrls.push(url);
            }

            if (multiple) {
                setImages((prev) => [...prev, ...newUrls]);
            } else {
                setImages([newUrls[0]]); // Replace if single mode
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
            // Reset input so same file can be selected again if needed
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-bold text-brand-brown">{label}</label>

            {/* Hidden inputs for form submission */}
            {multiple ? (
                images.map((url, index) => (
                    <input key={index} type="hidden" name={name} value={url} />
                ))
            ) : (
                <input type="hidden" name={name} value={images[0] || ""} />
            )}

            {/* Image Grid */}
            <div className={`grid gap-4 ${multiple ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1"}`}>
                {images.map((url, index) => (
                    <div key={index} className="relative group aspect-square rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm">
                        <Image
                            src={url}
                            alt={`Uploaded ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full shadow-sm hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <IconX size={16} />
                        </button>
                    </div>
                ))}

                {/* Upload Button */}
                {(multiple || images.length === 0) && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative aspect-square rounded-xl border-2 border-dashed border-zinc-300 hover:border-brand-brown/50 hover:bg-brand-brown/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-zinc-400 hover:text-brand-brown ${uploading ? "opacity-50 pointer-events-none" : ""
                            }`}
                    >
                        {uploading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-brown"></div>
                        ) : (
                            <>
                                <IconPhoto size={32} stroke={1.5} />
                                <span className="text-xs font-medium">
                                    {multiple ? "Add Photos" : "Upload Photo"}
                                </span>
                            </>
                        )}
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple={multiple}
                className="hidden"
            />
            <p className="text-xs text-zinc-500">
                Recommended: 1200x800px. Max 5MB.
            </p>
        </div>
    );
}

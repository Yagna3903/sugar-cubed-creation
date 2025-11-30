"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { uploadImage } from "../actions/upload";

interface ImageUploadProps {
    name: string;
    defaultValue?: string;
    label?: string;
}

export default function ImageUpload({ name, defaultValue, label = "Image" }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(defaultValue || null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show local preview immediately
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            const { url } = await uploadImage(formData);
            setPreview(url); // Update to remote URL
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload image");
            setPreview(defaultValue || null); // Revert on failure
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-bold text-brand-brown">{label}</label>

            {/* Hidden input to store the actual URL for the form submission */}
            <input type="hidden" name={name} value={preview || ""} />

            <div className="flex items-start gap-4">
                {/* Preview Area */}
                <div
                    className="relative w-32 h-32 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 flex-shrink-0 cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {preview ? (
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className={`object-cover transition-opacity ${uploading ? 'opacity-50' : 'opacity-100'}`}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 bg-black/50 px-2 py-1 rounded-full">
                            Change
                        </span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex-1">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="text-sm font-medium text-brand-brown hover:underline disabled:opacity-50"
                    >
                        {uploading ? "Uploading..." : "Upload Image"}
                    </button>
                    <p className="text-xs text-zinc-500 mt-1">
                        Recommended size: 1200x800px. Max 5MB.
                    </p>
                </div>
            </div>
        </div>
    );
}

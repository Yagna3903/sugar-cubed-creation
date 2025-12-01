"use client";

import { useState, useEffect, useTransition } from "react";
import ImageUpload from "@/app/admin/_components/ImageUpload";
import BackLink from "@/app/admin/_components/BackLink";
import { updateHeroContent, getHeroContent } from "./actions";
import { IconPhoto, IconCheck } from "@tabler/icons-react";

export default function HeroAdminPage() {
    const [isPending, startTransition] = useTransition();
    const [showToast, setShowToast] = useState(false);
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        getHeroContent().then((data) => {
            setImages(data.images);
        });
    }, []);

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            try {
                await updateHeroContent(formData);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            } catch (error) {
                console.error("Failed to save hero content", error);
                alert("Failed to save. Please try again.");
            }
        });
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-6 right-6 bg-zinc-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50">
                    <div className="bg-green-500 rounded-full p-1">
                        <IconCheck size={14} className="text-white" />
                    </div>
                    <span className="font-medium">Hero updated successfully</span>
                </div>
            )}

            <div className="mb-6">
                <BackLink href="/admin">Back to Dashboard</BackLink>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-brand-brown mb-2">Hero Section</h1>
                <p className="text-zinc-600">
                    Manage the main image(s) on the homepage. Upload multiple images to create a slideshow.
                </p>
            </div>

            <form action={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-brand-brown/5">
                <div className="flex items-center gap-2 mb-6 text-brand-brown">
                    <IconPhoto size={24} />
                    <h2 className="font-bold text-xl">Hero Images</h2>
                </div>

                <div className="mb-8">
                    <ImageUpload
                        name="images"
                        defaultValue={images}
                        label="Upload Hero Images"
                        multiple
                    />
                    <p className="mt-4 text-sm text-zinc-500 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                        <strong>Tip:</strong> If you upload only 1 image, it will be static. If you upload 2 or more,
                        it will automatically play as a slideshow with fade transitions.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-brand-brown text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-brown/90 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-brand-brown/20 flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </button>
            </form>
        </div>
    );
}

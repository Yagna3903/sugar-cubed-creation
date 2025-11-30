"use client";

import { useState, useTransition } from "react";
import { updateSiteContent } from "./actions";
import ImageUpload from "@/app/admin/_components/ImageUpload";
import { IconCheck } from "@tabler/icons-react";

interface StoryData {
    title: string;
    subtitle: string;
    body: string;
    imageUrl: string;
}

export default function StoryForm({ initialData }: { initialData: StoryData }) {
    const [isPending, startTransition] = useTransition();
    const [showToast, setShowToast] = useState(false);

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const newContent = {
                title: formData.get("title"),
                subtitle: formData.get("subtitle"),
                body: formData.get("body"),
                imageUrl: formData.get("imageUrl"),
            };
            await updateSiteContent("our-story", newContent);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        });
    };

    return (
        <>
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-6 right-6 bg-zinc-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50">
                    <div className="bg-green-500 rounded-full p-1">
                        <IconCheck size={14} className="text-white" />
                    </div>
                    <span className="font-medium">Changes saved successfully</span>
                </div>
            )}

            <form action={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-brand-brown mb-2">Title</label>
                    <input
                        name="title"
                        defaultValue={initialData.title}
                        className="w-full rounded-xl border px-4 py-2 focus:border-brand-brown focus:ring-1 focus:ring-brand-brown focus:outline-none"
                        placeholder="e.g. Our Story"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-brand-brown mb-2">Subtitle</label>
                    <input
                        name="subtitle"
                        defaultValue={initialData.subtitle}
                        className="w-full rounded-xl border px-4 py-2 focus:border-brand-brown focus:ring-1 focus:ring-brand-brown focus:outline-none"
                        placeholder="e.g. How it all started"
                    />
                </div>

                <ImageUpload name="imageUrl" defaultValue={initialData.imageUrl} label="Cover Image" />

                <div>
                    <label className="block text-sm font-bold text-brand-brown mb-2">Content</label>
                    <textarea
                        name="body"
                        defaultValue={initialData.body}
                        rows={10}
                        className="w-full rounded-xl border px-4 py-2 focus:border-brand-brown focus:ring-1 focus:ring-brand-brown focus:outline-none"
                        placeholder="Write your story here..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-brand-brown text-white py-3 rounded-xl font-medium hover:bg-brand-brown/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </button>
            </form>
        </>
    );
}

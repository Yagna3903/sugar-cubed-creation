"use client";

import { useState, useTransition } from "react";
import { createBlogPost, updateBlogPost } from "./actions";
import ImageUpload from "@/app/admin/_components/ImageUpload";
import DynamicContentEditor from "@/app/admin/_components/DynamicContentEditor";
import { IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface PostData {
    id?: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    coverImage?: string;
    published: boolean;
}

export default function PostForm({ initialData }: { initialData?: PostData }) {
    const [isPending, startTransition] = useTransition();
    const [showToast, setShowToast] = useState(false);
    const router = useRouter();
    const isEditing = !!initialData?.id;

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            if (isEditing && initialData?.id) {
                const result = await updateBlogPost(initialData.id, formData);
                if (result?.error) {
                    alert("Error saving post"); // Simple error handling for now
                } else {
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                }
            } else {
                await createBlogPost(formData);
                // createBlogPost redirects, so no need for toast here usually
            }
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
                        defaultValue={initialData?.title}
                        required
                        className="w-full rounded-xl border px-4 py-2 focus:border-brand-brown focus:ring-1 focus:ring-brand-brown focus:outline-none"
                        placeholder="e.g. The Secret to Perfect Cookies"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-brand-brown mb-2">Slug</label>
                    <input
                        name="slug"
                        defaultValue={initialData?.slug}
                        required
                        className="w-full rounded-xl border px-4 py-2 focus:border-brand-brown focus:ring-1 focus:ring-brand-brown focus:outline-none"
                        placeholder="e.g. secret-to-perfect-cookies"
                    />
                </div>

                <ImageUpload name="coverImage" defaultValue={initialData?.coverImage || ""} label="Cover Image" />

                <div>
                    <label className="block text-sm font-bold text-brand-brown mb-2">Excerpt</label>
                    <textarea
                        name="excerpt"
                        defaultValue={initialData?.excerpt}
                        rows={3}
                        className="w-full rounded-xl border px-4 py-2 focus:border-brand-brown focus:ring-1 focus:ring-brand-brown focus:outline-none"
                        placeholder="Short summary for the blog list..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-brand-brown mb-2">Content</label>
                    <DynamicContentEditor name="content" initialContent={initialData?.content || ""} />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="published"
                        id="published"
                        defaultChecked={initialData?.published}
                        className="rounded border-gray-300 text-brand-brown focus:ring-brand-brown"
                    />
                    <label htmlFor="published" className="text-sm font-medium text-zinc-700">
                        Published
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-brand-brown text-white py-3 rounded-xl font-medium hover:bg-brand-brown/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {isEditing ? "Saving..." : "Creating..."}
                        </>
                    ) : (
                        isEditing ? "Save Changes" : "Create Post"
                    )}
                </button>
            </form>
        </>
    );
}

"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/server/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const BlogPostSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    excerpt: z.string().optional(),
    content: z.string().min(1, "Content is required"),
    coverImage: z.string().optional(),
    images: z.array(z.string()).optional().default([]),
    published: z.coerce.boolean(),
});

export async function createBlogPost(formData: FormData) {
    await requireAdmin();

    const raw = Object.fromEntries(formData.entries());
    const images = formData.getAll("images") as string[];
    const parsed = BlogPostSchema.safeParse({ ...raw, images });

    if (!parsed.success) {
        return { error: parsed.error.flatten() };
    }

    const { published, ...data } = parsed.data;

    await prisma.blogPost.create({
        data: {
            ...data,
            published,
            publishedAt: published ? new Date() : null,
        },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    redirect("/admin/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
    await requireAdmin();

    const raw = Object.fromEntries(formData.entries());
    const images = formData.getAll("images") as string[];
    const parsed = BlogPostSchema.safeParse({ ...raw, images });

    if (!parsed.success) {
        return { error: parsed.error.flatten() };
    }

    const { published, ...data } = parsed.data;

    await prisma.blogPost.update({
        where: { id },
        data: {
            ...data,
            published,
            publishedAt: published ? new Date() : null, // Updates date on publish
        },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${data.slug}`);
    return { success: true };
}

export async function deleteBlogPost(id: string) {
    await requireAdmin();
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
}

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import BackLink from "@/app/admin/_components/BackLink";
import PostForm from "../PostForm";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
    const post = await prisma.blogPost.findUnique({
        where: { id: params.id },
    });

    if (!post) return notFound();

    return (
        <div className="mx-auto max-w-3xl">
            <BackLink href="/admin/blog">Back to Blog</BackLink>
            <div className="mt-6">
                <h1 className="text-2xl font-bold text-brand-brown">Edit Post</h1>
            </div>

            <div className="mt-8 bg-white p-6 rounded-3xl shadow-soft border border-brand-brown/5">
                <PostForm initialData={post as any} />
            </div>
        </div>
    );
}

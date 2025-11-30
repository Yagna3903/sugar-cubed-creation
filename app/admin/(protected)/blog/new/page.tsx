import BackLink from "@/app/admin/_components/BackLink";
import PostForm from "../PostForm";

export default function NewBlogPostPage() {
    return (
        <div className="mx-auto max-w-3xl">
            <BackLink href="/admin/blog">Back to Blog</BackLink>
            <div className="mt-6">
                <h1 className="text-2xl font-bold text-brand-brown">New Blog Post</h1>
            </div>

            <div className="mt-8 bg-white p-6 rounded-3xl shadow-soft border border-brand-brown/5">
                <PostForm />
            </div>
        </div>
    );
}

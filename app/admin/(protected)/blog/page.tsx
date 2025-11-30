import Link from "next/link";
import { prisma } from "@/lib/db";
import BackLink from "@/app/admin/_components/BackLink";
import { deleteBlogPost } from "./actions";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
    const posts = await prisma.blogPost.findMany({
        orderBy: { createdAt: "desc" },
    });
    console.log("Admin Blog Page found posts:", posts.length);

    return (
        <div className="mx-auto max-w-5xl">
            <BackLink href="/admin">Back to Dashboard</BackLink>

            <div className="mt-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-brand-brown">Blog Posts</h1>
                    <p className="text-zinc-500">Manage your blog content.</p>
                </div>
                <Link
                    href="/admin/blog/new"
                    className="rounded-xl bg-brand-brown px-4 py-2 text-sm font-medium text-white hover:bg-brand-brown/90"
                >
                    + New Post
                </Link>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-brand-brown/5 bg-white shadow-soft">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 text-zinc-500">
                        <tr>
                            <th className="px-6 py-4 font-medium">Title</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {posts.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                                    No posts yet. Create your first one!
                                </td>
                            </tr>
                        ) : (
                            posts.map((post) => (
                                <tr key={post.id} className="group hover:bg-zinc-50/50">
                                    <td className="px-6 py-4 font-medium text-brand-brown">
                                        {post.title}
                                        <div className="text-xs text-zinc-400 font-normal">/{post.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {post.published ? (
                                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                Published
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10">
                                                Draft
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Link
                                                href={`/admin/blog/${post.id}`}
                                                className="text-brand-brown hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <form action={deleteBlogPost.bind(null, post.id)}>
                                                <button className="text-red-600 hover:underline">Delete</button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

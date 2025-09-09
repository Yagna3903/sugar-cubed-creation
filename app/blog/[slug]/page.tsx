import { posts } from "@/lib/data"
import { notFound } from "next/navigation"
export default function PostPage({ params }: { params: { slug: string } }) {
  const post = posts.find(p => p.slug === params.slug)
  if (!post) return notFound()
  return (
    <article className="mx-auto max-w-3xl px-6 py-10 prose">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="text-sm opacity-70">{new Date(post.date).toLocaleDateString()}</div>
      <p className="mt-6">{post.excerpt}</p>
    </article>
  )
}

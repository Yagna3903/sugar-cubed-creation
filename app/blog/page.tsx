import Link from "next/link"
import { posts } from "@/lib/data"
export default function BlogPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Blog</h1>
      <ul className="mt-6 space-y-6">
        {posts.map(p => (
          <li key={p.slug} className="rounded-2xl bg-white p-6 shadow-soft">
            <Link href={`/blog/${p.slug}`} className="text-xl font-semibold underline">{p.title}</Link>
            <div className="text-sm opacity-70 mt-1">{new Date(p.date).toLocaleDateString()}</div>
            <p className="mt-2 opacity-80">{p.excerpt}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

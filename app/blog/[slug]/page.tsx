import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { IconCookie } from "@/components/ui/bakery-icons";
import { prisma } from "@/lib/db";
import ImageGallery from "@/components/ImageGallery";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} — Sugar Cubed Creations`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post || !post.published) return notFound();

  return (
    <article className="min-h-screen bg-white pb-20">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-brand-brown/10 flex items-center justify-center">
            <IconCookie className="w-24 h-24 text-brand-brown/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Navigation Overlay */}
        <nav className="absolute top-0 left-0 w-full p-6 z-10">
          <div className="mx-auto max-w-7xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-black/30"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </nav>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 pb-12">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 text-brand-cream bg-brand-brown/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6 shadow-lg">
              <IconCookie className="w-4 h-4" />
              Blog Post
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg leading-tight">
              {post.title}
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl drop-shadow-md">
              {post.excerpt}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-t-3xl p-8 md:p-12 shadow-xl border-t border-zinc-100">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-brown text-white flex items-center justify-center font-bold text-sm">
                SC
              </div>
              <div>
                <p className="font-bold text-zinc-900 text-sm">Sugar Cubed Team</p>
                <p className="text-xs text-zinc-500">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Draft"}
                </p>
              </div>
            </div>
          </div>

          <div
            className="prose prose-lg prose-brown max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-zinc-600 prose-p:leading-relaxed prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Gallery Section */}
          {post.images && post.images.length > 0 && (
            <div className="mt-16 pt-16 border-t border-zinc-100">
              <h3 className="font-display text-2xl font-bold text-brand-brown mb-8 text-center">
                More Photos
              </h3>
              <div className="mt-16 pt-16 border-t border-zinc-100">
                <h3 className="font-display text-2xl font-bold text-brand-brown mb-8 text-center">
                  More Photos
                </h3>
                <ImageGallery images={post.images} title={post.title} />
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

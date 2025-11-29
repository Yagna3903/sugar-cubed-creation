import Link from "next/link";
import Image from "next/image";
import { posts } from "@/lib/data";
import { IconSparkle } from "@/components/ui/bakery-icons";
import { BackButton } from "@/components/ui/back-button";

export const metadata = {
  title: "Blog — Sugar Cubed Creation",
  description: "Baking tips, stories, and sweet news from our kitchen.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-cream/30 via-white to-brand-pink/10">
      {/* Navigation */}
      <nav className="px-6 py-6">
        <div className="mx-auto max-w-7xl">
          <BackButton href="/">Home</BackButton>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-brown/10 text-brand-brown px-5 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <IconSparkle className="w-4 h-4" />
            From the Kitchen
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
            Sweet <span className="text-gradient">Stories</span>
          </h1>
          <p className="text-xl text-zinc-600 animate-fade-in delay-100">
            Behind the scenes, baking tips, and the stories that make our cookies special.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((p, index) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              </div>

              {/* Content */}
              <div className="flex-1 p-8 flex flex-col">
                <h2 className="font-display text-2xl font-bold text-zinc-900 mb-3 group-hover:text-brand-brown transition-colors">
                  {p.title}
                </h2>
                <p className="text-zinc-600 mb-6 line-clamp-3 flex-1">
                  {p.excerpt}
                </p>

                <span className="inline-flex items-center gap-2 text-brand-brown font-bold text-sm group/btn">
                  Read Article
                  <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

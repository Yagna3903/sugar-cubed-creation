import Link from "next/link";

export default function OurStoryPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-brand-brown transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold">My Story</h1>
      <p className="mt-4 opacity-80">
        Born from a tiny kitchen and a big love for cookies. Replace with your
        client&apos;s real story.
      </p>
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-soft">
        <div className="aspect-video rounded-xl bg-black/5" />
        <p className="mt-4 text-sm opacity-70">Video placeholder</p>
      </div>
    </section>
  );
}

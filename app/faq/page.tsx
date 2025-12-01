// app/faq/page.tsx
import { prisma } from "@/lib/db";
import { BackButton } from "@/components/ui/back-button";
import { IconCookie, IconGift, IconWhisk, IconSparkle } from "@/components/ui/bakery-icons";
import Link from "next/link";
import { FaqList } from "./faq-list";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "FAQs — Sugar Cubed Creations",
  description:
    "Answers about flavours, printed custom cookies, lead times, pickup/shipping and orders.",
};

export default async function FaqPublicPage() {
  const faqs = await prisma.fAQ.findMany({
    where: { active: true },
    orderBy: [{ sort: "asc" }, { createdAt: "desc" }],
    select: { id: true, question: true, answer: true },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-cream/30 via-white to-brand-pink/10 relative overflow-hidden">
      {/* Floating Background Decorations */}
      <div className="absolute top-20 right-10 text-brand-brown/[0.08] animate-drift pointer-events-none">
        <IconCookie className="w-40 h-40" />
      </div>
      <div className="absolute bottom-40 left-10 text-brand-brown/[0.09] animate-drift-reverse pointer-events-none">
        <IconGift className="w-32 h-32" />
      </div>
      <div className="absolute top-1/2 left-1/4 text-brand-pink-dark/[0.10] animate-drift-slow pointer-events-none">
        <IconWhisk className="w-24 h-24" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-6">
        <BackButton href="/">Home</BackButton>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 px-6 text-center">
        <div className="relative mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-brand-brown/10 text-brand-brown px-5 py-2 rounded-full text-sm font-medium mb-5 animate-fade-in">
            <IconSparkle className="w-4 h-4" />
            Got Questions?
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold mb-5 animate-slide-up text-brand-brown">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>

          <p className="text-lg text-zinc-600 max-w-xl mx-auto mb-6 animate-fade-in">
            Everything you need to know about our cookies, shipping, and custom orders.
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="mx-auto max-w-3xl px-6 pb-20 relative z-10">
        {faqs.length === 0 ? (
          <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/40 shadow-sm">
            <IconSparkle className="w-16 h-16 mx-auto mb-4 text-brand-brown/30" />
            <h2 className="font-display text-2xl font-bold mb-2 text-brand-brown">No FAQs yet</h2>
            <p className="text-zinc-600 mb-6">Check back soon or contact us directly!</p>
            <Link href="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>
        ) : (
          <FaqList faqs={faqs} />
        )}

        {/* Bottom CTA */}
        <div className="mt-16 relative rounded-3xl p-10 overflow-hidden shadow-xl animate-scale-in">
          {/* Vibrant Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-brown via-brand-brown/90 to-brand-brown" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

          {/* Decorative Circles */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-pink/10 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative text-center text-white">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Still have questions?
            </h2>
            <p className="text-white/80 mb-8 text-lg max-w-xl mx-auto">
              Can't find what you're looking for? We're here to help!
            </p>
            <a
              href="mailto:Sugarcubedcreations@gmail.com"
              className="group inline-flex items-center gap-2 bg-white text-brand-brown px-6 py-3 rounded-xl font-bold hover:bg-brand-cream transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>Email Support</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

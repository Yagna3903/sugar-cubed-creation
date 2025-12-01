// app/faq/page.tsx
import { prisma } from "@/lib/db";
import { BackButton } from "@/components/ui/back-button";

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

  type FaqRow = (typeof faqs)[number];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f: FaqRow) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <BackButton href="/">Back to Home</BackButton>
      </div>
      <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
      <p className="mt-2 text-sm opacity-70">
        Quick answers about flavours, printed cookies, orders, and more.
      </p>

      {faqs.length === 0 ? (
        <p className="mt-8 text-zinc-600">
          No FAQs yet. Check back soon—or{" "}
          <a href="/contact" className="underline">
            contact us
          </a>
          .
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {faqs.map((f: FaqRow) => (
            <details
              key={f.id}
              className="group rounded-2xl border bg-white p-4 [&_p]:leading-relaxed"
            >
              <summary className="cursor-pointer select-none text-lg font-medium">
                {f.question}
              </summary>
              <p className="mt-2 text-[15px] opacity-80 whitespace-pre-line">
                {f.answer}
              </p>
            </details>
          ))}
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}

import FAQClient from "./faq-client";
import { FAQS, generateFaqJsonLd } from "./data";

export const metadata = {
  title: "FAQs — Sugar Cubed Creation",
  description:
    "Answers about flavours, printed custom cookies, lead times, pickup/shipping and orders.",
};

export default function FAQPage() {
  const jsonLd = generateFaqJsonLd(FAQS);

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
      <p className="mt-2 text-sm opacity-70">
        Quick answers about flavours, printed cookies, orders, and more.
      </p>

      <FAQClient faqs={FAQS} />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}

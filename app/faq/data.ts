export type QA = { q: string; a: string };

export const FAQS: QA[] = [
  { q: "Do you offer vegan or gluten-free cookies?", a: "We do not offer vegan cookies at this time. Our standard lineup is not gluten-free." },
  { q: "What flavours are available?", a: "Our standard flavour is vanilla. For holiday drops we sometimes offer one special flavour for a specific cookie. Corporate logo cookies are available in vanilla and chocolate chip." },
  { q: "How do printed custom cookies work?", a: "All custom cookies are printed on a food-safe printer (not hand-piped). Send a high-quality PNG/SVG/JPG; vector or 300 DPI is best for crisp results. We’ll size and center it for the cookie." },
  { q: "Lead time — when should I order?", a: "For small orders, please place your order 5–7 days in advance. For larger or corporate orders, 10–14 days is recommended." },
  { q: "Do you ship? Can I pick up?", a: "Pickup is preferred for local customers. Shipping availability depends on the order and season. Contact us and we’ll confirm options." },
  { q: "Allergens", a: "Cookies may contain wheat, dairy, eggs, and may be produced in a kitchen that handles nuts." },
  { q: "Order confirmation & status", a: "After checkout, a confirmation email is sent to the owner. Your order is approved or denied by the owner and you’ll be notified by email either way." },
];

export function generateFaqJsonLd(faqs: QA[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

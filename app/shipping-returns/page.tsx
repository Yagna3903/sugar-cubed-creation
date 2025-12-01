// app/shipping-returns/page.tsx
export const metadata = {
  title: "Pickup & Returns — Sugar Cubed Creations",
  description:
    "Processing times, pickup details, and our returns policy for perishable cookies.",
};

const Info = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl border bg-white p-5">
    <h2 className="text-xl font-semibold">{title}</h2>
    <div className="mt-3 text-[15px] leading-relaxed opacity-90">
      {children}
    </div>
  </section>
);

import { BackButton } from "@/components/ui/back-button";

export default function ShippingReturnsPage() {
  // JSON-LD for return policy (no returns on perishables) + shipping times
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Store Policy — Sugar Cubed Creations",
    mainEntity: [
      {
        "@type": "MerchantReturnPolicy",
        name: "Perishable Goods Return Policy",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Exceptions",
            value:
              "Replacement or refund provided for damaged or incorrect items if reported with photos within 24 hours of pickup.",
          },
        ],
      },
      {
        "@type": "ShippingDeliveryTime",
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: 2,
          maxValue: 7,
          unitCode: "DAY",
        },
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 5,
          maxValue: 14,
          unitCode: "DAY",
        },
      },
    ],
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <BackButton href="/">Back to Home</BackButton>
      </div>
      <h1 className="text-3xl font-bold">Pickup & Returns Policy</h1>
      <p className="mt-2 text-sm opacity-70">
        Here&apos;s how we prepare your cookie orders and our pickup process.
      </p>

      <div className="mt-8 grid gap-4">
        <Info title="Processing times">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Retail orders: <strong>5–7 days</strong> to prepare.
            </li>
            <li>
              Corporate / large orders: <strong>10–14 days</strong>.
            </li>
            <li>Holiday releases may sell out and timelines can vary.</li>
          </ul>
        </Info>

        <Info title="Pickup">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              All orders are pickup only. The pickup address will be
              provided after your order is approved.
            </li>
          </ul>
        </Info>

        <Info title="Order confirmation & status">
          <p>
            After checkout, an <strong>email is sent to the owner</strong>. The
            owner will <strong>approve or deny</strong> the order. You’ll be
            notified of the status by email.
          </p>
        </Info>

        <Info title="Cancellations">
          <p>
            Cancellations are accepted within{" "}
            <strong>24 hours of approval</strong> or before production begins.
            Once baking/printing starts, the order cannot be cancelled.
          </p>
        </Info>

        <Info title="Returns & refunds">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>No returns</strong> on perishable items.
            </li>
            <li>
              For damaged or incorrect items, email photos within{" "}
              <strong>24 hours</strong> of pickup and we will arrange a
              replacement or refund.
            </li>
          </ul>
        </Info>

        <Info title="Flavours & allergens">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Standard flavour: <strong>vanilla</strong>. Holiday drops may
              include one seasonal flavour for a specific cookie.
            </li>
            <li>
              Corporate logo cookies: <strong>vanilla</strong> and{" "}
              <strong>chocolate chip</strong>.
            </li>
            <li>
              <strong>No vegan</strong> options at this time.
            </li>
            <li>
              Contains <strong>wheat, dairy, eggs</strong>; produced in a
              kitchen that may handle <strong>nuts</strong>.
            </li>
          </ul>
        </Info>

        <Info title="Questions">
          <p>
            Email{" "}
            <a className="underline" href="mailto:hello@cookie.co">
              hello@cookie.co
            </a>{" "}
            or call (+1) 123-456-7890.
          </p>
        </Info>
      </div>

      {/* SEO structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}

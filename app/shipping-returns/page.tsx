// app/shipping-returns/page.tsx
export const metadata = {
  title: "Store Policy — Sugar Cubed Creation",
  description:
    "Processing times, pickup & shipping details, tracking, and our returns policy for perishable cookies.",
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

export default function ShippingReturnsPage() {
  // JSON-LD for return policy (no returns on perishables) + shipping times
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Store Policy — Sugar Cubed Creation",
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
              "Replacement or refund provided for damaged or incorrect items if reported with photos within 24 hours of delivery or pickup.",
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
      <h1 className="text-3xl font-bold">Shipping &amp; Returns</h1>
      <p className="mt-2 text-sm opacity-70">
        Here’s how we prepare, ship, and support your cookie orders.
      </p>

      <div className="mt-8 grid gap-4">
        <Info title="Payment Policy">
          <ul className="list-disc pl-5 space-y-1">
            <li>Payment is required upfront to secure your order.</li>
            <li>
              This allows us to source any custom cutters, sprinkles, and
              packaging necessary for your cookies.
            </li>
            <li>
              Your payment also confirms your pick-up date, ensuring a smooth
              process for both parties.
            </li>
          </ul>
        </Info>

        <Info title="Order Forfeiture">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Please note that orders not picked up at the scheduled time will
              be forfeited, as our cookies are best enjoyed fresh.
            </li>
            <li>
              In the event of a no-show, we will donate your order to a family
              in need. If you need to reschedule, kindly contact us at least 2
              days before your scheduled pickup.{" "}
            </li>
          </ul>
        </Info>

        <Info title="Refund Policy">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              With such a tight turn around,refund cannot be offered once the
              payment is made. On the bright side, you’ll still receive your
              cookies!
            </li>
          </ul>
        </Info>

        <Info title="Delivery Options">
          <ul className="list-disc pl-5 space-y-1">
            {" "}
            <li>
              While orders are typically for pick-up, delivery may be available
              for an additional fee. If you're in the area, we’d be happy to
              discuss arrangements.
            </li>
          </ul>
        </Info>

        <Info title="Pickup Dates & Times">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Pickup and delivery times are agreed upon at the time of ordering
              to ensure smooth scheduling for all customers.
            </li>
            <li>
              {" "}
              We offer bulk pickup dates for added convenience—don't forget to
              mark your calendar!
            </li>
          </ul>
        </Info>

        <Info title="Order Changes">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              We understand that plans change! You can modify your order until 1
              week before your order.
            </li>
            <li>
              {" "}
              After that, changes may be considered with an additional fee.
            </li>
          </ul>
        </Info>

        <Info title=" Rush Orders">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              We will do our best to accommodate last-minute orders, though a
              rush fee of $20 applies for orders requested with fewer than 5
              business days’ notice.
            </li>
          </ul>
        </Info>

        <Info title="Price Adjustments">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Prices are subject to change based on fluctuating ingredient
              costs.
            </li>
            <li>
              {" "}
              While we strive to provide high-quality cookies at competitive
              prices, we cannot guarantee past pricing.
            </li>
          </ul>
        </Info>

        <Info title="Photography">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              We occasionally photograph our creations for promotional purposes.
            </li>
            <li>
              {" "}
              If you prefer that your cookies not be photographed, please notify
              us when placing your order.
            </li>
          </ul>
        </Info>
        <Info title="Photo Accuracy">
          <ul className="list-disc pl-5 space-y-1">
            <li>Colours and lighting in photos may differ slightly.</li>
          </ul>
        </Info>

        <Info title="Questions">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Email{" "}
              <a className="underline" href="mailto:hello@cookie.co">
                hello@cookie.co
              </a>{" "}
            </li>
          </ul>
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

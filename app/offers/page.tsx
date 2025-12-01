import Link from "next/link";
import { IconSparkle, IconCookie, IconGift, IconWhisk } from "@/components/ui/bakery-icons";
import { BackButton } from "@/components/ui/back-button";
import { getActiveOffers } from "@/lib/server/offers";
import { PromoCodeDisplay } from "@/components/promo-code-display";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Special Offers — Sugar Cubed Creations",
  description: "Sweet deals and limited-time promotions on our artisan cookies",
};

// Color scheme mapping for modern, bakery-appropriate aesthetics
const colorSchemes: Record<string, { bg: string; text: string; badge: string; accent: string }> = {
  "brand-brown": {
    bg: "from-amber-50/80 via-orange-50/60 to-amber-50/80",
    text: "text-brand-brown",
    badge: "bg-gradient-to-r from-brand-brown to-amber-800 text-white",
    accent: "from-brand-brown to-amber-700",
  },
  "brand-pink": {
    bg: "from-rose-100 via-pink-100 to-rose-100",
    text: "text-brand-pink-dark",
    badge: "bg-gradient-to-r from-brand-pink-dark to-rose-700 text-white",
    accent: "from-brand-pink-dark to-rose-600",
  },
  green: {
    bg: "from-emerald-50/80 via-green-50/60 to-emerald-50/80",
    text: "text-emerald-800",
    badge: "bg-gradient-to-r from-emerald-700 to-green-800 text-white",
    accent: "from-emerald-600 to-green-700",
  },
  blue: {
    bg: "from-sky-50/80 via-blue-50/60 to-sky-50/80",
    text: "text-sky-900",
    badge: "bg-gradient-to-r from-sky-700 to-blue-800 text-white",
    accent: "from-sky-600 to-blue-700",
  },
  purple: {
    bg: "from-purple-50/80 via-violet-50/60 to-purple-50/80",
    text: "text-purple-900",
    badge: "bg-gradient-to-r from-purple-700 to-violet-800 text-white",
    accent: "from-purple-600 to-violet-700",
  },
  christmas: {
    bg: "from-red-50 via-green-50 to-red-50",
    text: "text-red-900",
    badge: "bg-gradient-to-r from-red-700 to-green-700 text-white",
    accent: "from-red-600 to-green-600",
  },
  halloween: {
    bg: "from-orange-100 via-purple-50 to-orange-100",
    text: "text-orange-900",
    badge: "bg-gradient-to-r from-orange-700 to-purple-800 text-white",
    accent: "from-orange-600 to-purple-700",
  },
};

export default async function OffersPage() {
  const offers = await getActiveOffers();

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-cream/30 via-white to-brand-pink/10 relative overflow-hidden">
      {/* Floating Background Decorations - Very Subtle */}
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
      <section className="relative py-16 px-6">
        <div className="relative mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 bg-brand-brown/10 text-brand-brown px-5 py-2 rounded-full text-sm font-medium mb-5 animate-fade-in">
            <IconSparkle className="w-4 h-4" />
            Limited Time Deals
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold mb-5 animate-slide-up">
            Sweet <span className="text-gradient">Offers</span>
          </h1>

          <p className="text-lg text-zinc-600 max-w-2xl mx-auto mb-6 animate-fade-in">
            Delicious savings on our handcrafted cookies. All orders are pickup only.
          </p>

          <Link
            href="/shop"
            className="btn-primary inline-flex items-center gap-2 animate-scale-in"
          >
            <span>Browse Cookies</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-20 relative z-10">
        {offers.length === 0 ? (
          <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-3xl border">
            <IconSparkle className="w-16 h-16 mx-auto mb-4 text-brand-brown/30" />
            <h2 className="font-display text-2xl font-bold mb-2">No active offers right now</h2>
            <p className="text-zinc-600 mb-6">Check back soon for sweet deals!</p>
            <Link href="/shop" className="btn-secondary">
              Shop All Cookies
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, index) => {
              const colors = colorSchemes[offer.colorScheme] || colorSchemes["brand-brown"];

              return (
                <div
                  key={offer.id}
                  className="group relative rounded-3xl overflow-hidden animate-fade-in hover:-translate-y-2 transition-all duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg}`} />

                  {/* Glassmorphism Card */}
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all">
                    {/* Badge */}
                    {offer.badge && (
                      <div className="mb-4 inline-block">
                        <span className={`${colors.badge} px-4 py-1.5 rounded-full text-xs font-bold shadow-lg uppercase tracking-wide`}>
                          {offer.badge}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className={`font-display text-2xl font-bold mb-3 ${colors.text} group-hover:scale-[1.02] transition-transform`}>
                      {offer.title}
                    </h3>

                    {/* Description */}
                    <p className="text-zinc-700 mb-5 leading-relaxed text-sm">
                      {offer.description}
                    </p>

                    {/* Discount Badge - Larger & More Prominent */}
                    <div className={`relative inline-flex items-center gap-2 bg-gradient-to-r ${colors.accent} text-white px-6 py-3 rounded-2xl font-black text-xl mb-5 shadow-2xl group-hover:scale-110 transition-transform overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
                      <IconSparkle className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">{offer.discountText}</span>
                    </div>

                    {/* Expiry Info */}
                    <div className="flex items-center gap-2 text-xs text-zinc-600 mb-6 bg-zinc-100/50 rounded-lg px-3 py-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        Valid until <strong className={colors.text}>{new Date(offer.validUntil).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</strong>
                      </span>
                    </div>

                    {/* Promo Code Display */}
                    {offer.promoCode && (
                      <PromoCodeDisplay code={offer.promoCode} />
                    )}

                    {/* CTA Button */}
                    <Link
                      href={offer.ctaLink}
                      className={`group/btn relative block w-full text-center py-3.5 rounded-xl bg-gradient-to-r ${colors.accent} text-white font-bold text-sm shadow-lg hover:shadow-2xl transition-all overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:animate-shimmer" />
                      <span className="relative z-10 inline-flex items-center gap-2">
                        {offer.ctaText}
                        <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </Link>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${colors.accent} opacity-0 group-hover:opacity-20 blur-xl transition-opacity -z-10`} />
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 relative rounded-3xl p-12 overflow-hidden shadow-2xl">
          {/* Vibrant Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-brown via-brand-pink to-brand-brown" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />

          {/* Content */}
          <div className="relative text-center text-white">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Looking for something custom?
            </h2>
            <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
              We offer personalized pricing for bulk orders and special events. Get in touch for a custom quote!
            </p>
            <Link
              href="/corporate-inquiry"
              className="group inline-flex items-center gap-3 bg-white text-brand-brown px-8 py-4 rounded-xl font-bold hover:bg-brand-cream transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <IconGift className="w-6 h-6" />
              <span>Get Custom Quote</span>
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

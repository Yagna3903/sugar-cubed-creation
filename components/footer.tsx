import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold mb-3">About</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/our-story">Our story</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Help</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/shipping-returns"> Store Policy</Link>
            </li>

            <li>
              <Link href="/faq">FAQs</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <div className="mt-3 flex flex-col gap-2">
            <a
              href="mailto:hello@cookie.co?subject=Cookie%20order%20inquiry&body=Hi%20Sugar%20Cubed%20Creation%2C%0A%0A"
              className="mt-1 inline-flex items-center gap-2 text-sm underline hover:text-brand-brown"
              aria-label="Email hello@cookie.co (opens your mail app)"
            >
              {/* envelope icon */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="2" />
              </svg>
              hello@cookie.co
            </a>
          </div>
          <a
            href="https://www.instagram.com/sugarcubedcreationscanada/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm underline hover:text-brand-brown"
            aria-label="Open Instagram: @sugarcubedcreationscanada "
          >
            {/* tiny IG icon */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="12"
                cy="12"
                r="4.5"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
            </svg>
            Instagram
          </a>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Receive new promotions</h3>
          <form className="flex gap-2" action="#">
            <input
              className="flex-1 rounded-xl border px-3 py-2"
              placeholder="Your email"
            />
            <button
              className="rounded-xl bg-brand-brown text-white px-4"
              formAction="#"
            >
              Subscribe
            </button>
          </form>

          {/* Admin login button */}
          <div className="mt-6">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full bg-brand-brown text-white px-4 py-2 text-sm shadow-soft transition hover:-translate-y-[1px]"
              aria-label="Admin login"
            >
              {/* tiny lock icon */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M7 10V7a5 5 0 0 1 10 0v3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Admin login
            </Link>
            <p className="mt-2 text-xs opacity-60">
              Staff access to manage inventory & products.
            </p>
          </div>
        </div>
      </div>

      <div className="py-6 text-center text-sm opacity-70">
        © {new Date().getFullYear()} Sugar Cubed Creation · Privacy · Terms ·
        Sitemap
      </div>
    </footer>
  );
}

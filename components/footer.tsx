"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return (
      <footer className="mt-auto border-t border-brand-brown/10 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Admin Brand */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-brown/5 rounded-lg">
                <svg className="w-5 h-5 text-brand-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display font-bold text-brand-brown text-sm">Admin Portal</h3>
                <p className="text-xs text-zinc-500">Sugar Cubed Creations</p>
              </div>
            </div>

            {/* Quick Links */}
            <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600">
              <Link href="/admin" className="hover:text-brand-brown transition-colors">Dashboard</Link>
              <Link href="/admin/orders" className="hover:text-brand-brown transition-colors">Orders</Link>
              <Link href="/admin/products" className="hover:text-brand-brown transition-colors">Products</Link>
              <Link href="/" className="hover:text-brand-brown transition-colors flex items-center gap-1">
                <span>View Store</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </nav>

            {/* System Status */}
            <div className="flex items-center gap-2 text-xs text-zinc-500 bg-brand-brown/5 px-3 py-1.5 rounded-full border border-brand-brown/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              System Operational
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="pt-24 border-t border-brand-brown/5 bg-gradient-to-b from-white to-brand-cream/20">
      <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display font-bold text-lg text-brand-brown mb-6">About</h3>
          <ul className="space-y-4 text-sm text-zinc-600">
            <li>
              <Link href="/our-story" className="hover:text-brand-brown transition-colors">Our story</Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-brand-brown transition-colors">Blog</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-bold text-lg text-brand-brown mb-6">Help</h3>
          <ul className="space-y-4 text-sm text-zinc-600">
            <li>
              <Link href="/shipping-returns" className="hover:text-brand-brown transition-colors">Store Policy</Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-brand-brown transition-colors">FAQs</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-bold text-lg text-brand-brown mb-6">Contact</h3>
          <div className="flex flex-col gap-4 text-sm text-zinc-600">
            <a
              href="mailto:Sugarcubedcreations@gmail.com?subject=Cookie%20order%20inquiry&body=Hi%20Sugar%20Cubed%20Creations%2C%0A%0A"
              className="inline-flex items-center gap-2 hover:text-brand-brown transition-colors"
              aria-label="Email hello@cookie.co"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" />
                <path d="M4 7l8 6 8-6" strokeWidth="2" />
              </svg>
              hello@cookie.co
            </a>
            <a
              href="https://www.instagram.com/sugarcubedcreationscanada/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-brand-brown transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="2" />
                <circle cx="12" cy="12" r="4.5" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
              </svg>
              Instagram
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display font-bold text-lg text-brand-brown mb-6">Admin</h3>
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-brown text-white px-5 py-2.5 text-sm font-medium shadow-soft hover:shadow-medium hover:-translate-y-0.5 transition-all duration-200"
              aria-label="Admin login"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin Login
            </Link>
            <p className="mt-3 text-xs text-zinc-500 leading-relaxed">
              Staff access to manage inventory & products.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-brown/5 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Sugar Cubed Creations
      </div>
    </footer>
  );
}

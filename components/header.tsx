"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const dynamic = "force-dynamic";


const NavLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`px-2 py-1 rounded ${active ? "bg-brand-pink/60" : ""}`}
    >
      {children}
    </Link>
  );
};

export function Header() {
  const count = useCart((s) => s.items.reduce((a, i) => a + i.qty, 0));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-xl">
          Sugar Cubed Creation
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4">
          <NavLink href="/shop">Shop</NavLink>
          <NavLink href="/offers">Offers</NavLink>
          <NavLink href="/our-story">Our Story</NavLink>
          <NavLink href="/blog">Blog</NavLink>
        </nav>

        <div className="flex items-center gap-4">
          {/* Cart Link */}
          <Link href="/cart" className="relative">
            <span>Cart</span>
            {count > 0 && (
              <span className="absolute -top-2 -right-3 text-xs bg-brand-brown text-white rounded-full px-2">
                {count}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-brand-cream rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur animate-fade-in">
          <nav className="px-6 py-4 flex flex-col gap-3">
            <NavLink href="/shop" onClick={() => setMobileMenuOpen(false)}>
              Shop
            </NavLink>
            <NavLink href="/offers" onClick={() => setMobileMenuOpen(false)}>
              Offers
            </NavLink>
            <NavLink href="/our-story" onClick={() => setMobileMenuOpen(false)}>
              Our Story
            </NavLink>
            <NavLink href="/blog" onClick={() => setMobileMenuOpen(false)}>
              Blog
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

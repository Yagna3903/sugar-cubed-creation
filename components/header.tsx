"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { usePathname } from "next/navigation";

export const dynamic = "force-dynamic";

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`px-2 py-1 rounded ${active ? "bg-brand-pink/60" : ""}`}
    >
      {children}
    </Link>
  );
};

export function Header() {
  const count = useCart((s) => s.items.reduce((a, i) => a + i.qty, 0));
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        {/* <Link href="/" className="font-extrabold text-xl">
          Sugar Cubed Creation
        </Link> */}

        <Link href="/" className="flex items-center">
          <img
            src="/images/logo-wood.png"
            alt="Sugar Cubed Creations"
            className="h-36 md:h-48 w-auto object-scale-down"
          />
        </Link>

        <nav className="hidden md:flex gap-4">
          <NavLink href="/shop">Shop</NavLink>

          <NavLink href="/our-story">Our Story</NavLink>
          <NavLink href="/blog">Blog</NavLink>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold
                   bg-sugar-500 text-pink shadow-soft hover:bg-sugar-600 active:bg-sugar-700
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sugar-400/60"
          >
            <span>Cart</span>
            {count > 0 && (
              <span className="ml-1 rounded-full bg-white/95 px-2 py-0.5 text-xxs font-bold text-sugar-700 shadow-sm">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

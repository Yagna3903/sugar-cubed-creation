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
        <Link href="/" className="font-extrabold text-xl">
          Sugar Cubed Creation
        </Link>
        <nav className="hidden md:flex gap-4">
          <NavLink href="/shop">Shop</NavLink>
          <NavLink href="/offers">Offers</NavLink>
          <NavLink href="/our-story">Our Story</NavLink>
          <NavLink href="/blog">Blog</NavLink>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <span>Cart</span>
            {count > 0 && (
              <span className="absolute -top-2 -right-3 text-xs bg-brand-brown text-white rounded-full px-2">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

import { Product, BlogPost, Promo } from "./types";

// Use public image paths. Anything in /public is served from the root.
export const products: Product[] = [
  {
    id: "h1",
    slug: "holiday-vanilla-sugar",
    name: "Holiday Sugar Cookie — Vanilla",
    price: 4.25,
    image: "/images/holiday-vanilla-sugar.jpg",
    badges: ["seasonal", "best-seller"],
    description: "Holiday-themed sugar cookie. Standard flavour: vanilla.",
  },
  {
    id: "h2",
    slug: "holiday-special-gingerbread",
    name: "Holiday Special — Gingerbread ",
    price: 4.75,
    image: "/images/holiday-special-gingerbread.jpg",
    badges: ["seasonal", "new"],
    description:
      "Special holiday flavour available only for this cookie (one special per season).",
  },
  {
    id: "p1",
    slug: "printed-vanilla",
    name: "Printed Cookies — Vanilla",
    price: 5.0,
    image: "/images/printed-vanilla.jpg",
    badges: ["printed", "corporate", "best-seller"],
    description:
      "Printed on a food-safe printer (not hand-piped). Perfect for custom designs and events.",
  },
  {
    id: "p2",
    slug: "printed-choc-chip",
    name: "Printed Cookies — Chocolate Chip",
    price: 5.25,
    image: "/images/printed-choc-chip.jpg",
    badges: ["printed", "corporate"],
    description:
      "Printed (not hand-piped). Ideal for corporate logo cookies in chocolate chip.",
  },
  {
    id: "v1",
    slug: "classic-vanilla-sugar",
    name: "Classic Vanilla Sugar Cookie",
    price: 4.0,
    image: "/images/classic-vanilla-sugar.jpg",
    badges: ["best-seller"],
    description: "Our standard flavour is vanilla—simple and delicious.",
  },
];

export const promos: Promo[] = [
  {
    title: "Holiday Themed",
    blurb: "Limited-time festive flavors.",
    cta: "Explore",
    href: "/offers",
    image: "/images/holiday-vanilla-sugar.jpg",
  },
];

export const posts: BlogPost[] = [
  {
    slug: "new-ovens",
    title: "How we bake the perfect crust",
    excerpt: "We share our trick for chewy edges and soft centers.",
    date: "2025-08-12",
  },
  {
    slug: "sourcing-cocoa",
    title: "Sourcing Ethical Cocoa",
    excerpt: "Why we partner with small farms.",
    date: "2025-07-30",
  },
];

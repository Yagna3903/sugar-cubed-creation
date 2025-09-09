import { Product, BlogPost, Promo } from "./types";

const img = (label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'>
      <defs>
        <linearGradient id='g' x1='0' x2='1'>
          <stop offset='0%' stop-color='#F6D5E1'/>
          <stop offset='100%' stop-color='#FFF8F2'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <circle cx='400' cy='400' r='300' fill='#ffffff' stroke='#5C3A21' stroke-width='8' />
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='46' font-family='Arial' fill='#5C3A21'>${label}</text>
    </svg>`
  )}`;

export const products: Product[] = [
  {
    id: "h1",
    slug: "holiday-vanilla-sugar",
    name: "Holiday Sugar Cookie — Vanilla",
    price: 4.25,
    image: img(".Holiday Vanilla"),
    badges: ["seasonal", "best-seller"],
    description: "Holiday-themed sugar cookie. Standard flavour: vanilla.",
  },
  {
    id: "h2",
    slug: "holiday-special-gingerbread",
    name: "Holiday Special — Gingerbread ",
    price: 4.75,
    image: img(".Gingerbread"),
    badges: ["seasonal", "new"],
    description:
      "Special holiday flavour available only for this cookie (one special per season).",
  },
  {
    id: "p1",
    slug: "printed-vanilla",
    name: "Printed Cookies — Vanilla",
    price: 5.0,
    image: img(".Printed Vanilla"),
    badges: ["printed", "corporate", "best-seller"],
    description:
      "Printed on a food-safe printer (not hand-piped). Perfect for custom designs and events.",
  },
  {
    id: "p2",
    slug: "printed-choc-chip",
    name: "Printed Cookies — Chocolate Chip",
    price: 5.25,
    image: img(".Printed Choc Chip"),
    badges: ["printed", "corporate"],
    description:
      "Printed (not hand-piped). Ideal for corporate logo cookies in chocolate chip.",
  },
  {
    id: "v1",
    slug: "classic-vanilla-sugar",
    name: "Classic Vanilla Sugar Cookie",
    price: 4.0,
    image: img(".Vanilla"),
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
    image: img("Holiday"),
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

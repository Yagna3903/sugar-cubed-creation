import { Product, BlogPost, Promo } from "./types";

// Use public image paths. Anything in /public is served from the root.
export const products: Product[] = [
  {
    id: "h1",
    slug: "holiday-vanilla-sugar",
    name: "Holiday Sugar Cookie — Vanilla",
    price: 4.25,
    image: "/images/holiday-vanilla-sugar.jpg",
    images: ["/images/holiday-vanilla-sugar.jpg"],
    badges: ["seasonal", "best-seller"],
    description: "Holiday-themed sugar cookie. Standard flavour: vanilla.",
  },
  {
    id: "h2",
    slug: "holiday-special-gingerbread",
    name: "Holiday Special — Gingerbread ",
    price: 4.75,
    image: "/images/holiday-special-gingerbread.jpg",
    images: ["/images/holiday-special-gingerbread.jpg"],
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
    images: ["/images/printed-vanilla.jpg"],
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
    images: ["/images/printed-choc-chip.jpg"],
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
    images: ["/images/classic-vanilla-sugar.jpg"],
    badges: ["best-seller"],
    description: "Our standard flavour is vanilla—simple and delicious.",
  },
  {
    id: "classic-chocolate-cookie",
    slug: "chocolate-chunk-cookie",
    name: "Chocolate Chunk Cookie",
    price: 4.5,
    image: "/images/printed-choc-chip.jpg", // Using chocolate chip image as placeholder
    images: ["/images/printed-choc-chip.jpg"],
    badges: ["best-seller"],
    description: "Rich chocolate chunks in every bite.",
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
    slug: "secret-to-chewy-cookies",
    title: "The Secret to Our Perfectly Chewy Cookies",
    excerpt: "It's not just about the ingredients—it's about the technique. Learn how we achieve that signature texture.",
    date: "2024-11-15",
    image: "/images/blog/chewy-cookies.png",
    content: `
      <p>There's a fine line between a good cookie and a great one. At Sugar Cubed Creations, we've spent years perfecting that line, landing squarely on the side of "unforgettably chewy."</p>
      
      <h3>The Butter Factor</h3>
      <p>It all starts with temperature. Most recipes call for room-temperature butter, but we've found that a specific cool-room temp allows for better aeration during the creaming process without melting too quickly in the oven.</p>

      <h3>Rest is Best</h3>
      <p>Patience is our secret ingredient. We rest our dough for at least 24 hours before baking. This allows the flour to fully hydrate and the flavors to meld, resulting in a deeper, more complex taste and that perfect chewiness you love.</p>

      <h3>The Bake</h3>
      <p>We bake at a slightly higher temperature for a shorter time. This sets the edges while keeping the center soft and gooey. It's a delicate dance, but one we're happy to do for every single batch.</p>
    `
  },
  {
    slug: "holiday-gift-guide-2024",
    title: "Holiday Gift Guide 2024: Sweet Treats for Everyone",
    excerpt: "From corporate clients to your favorite neighbor, find the perfect cookie box for everyone on your list.",
    date: "2024-11-20",
    image: "/images/blog/holiday-gifts.png",
    content: `
      <p>The holidays are fast approaching, and nothing says "I appreciate you" quite like a box of handcrafted cookies. Here's our guide to gifting sweetness this season.</p>

      <h3>For the Traditionalist</h3>
      <p>You can't go wrong with our <strong>Classic Vanilla Sugar Cookies</strong>. They're buttery, soft, and decorated with festive royal icing. Perfect for family gatherings or leaving out for Santa.</p>

      <h3>For the Chocolate Lover</h3>
      <p>Our <strong>Chocolate Chunk</strong> boxes are a crowd-pleaser. Loaded with premium semi-sweet chocolate pools, they are the ultimate comfort food for cold winter nights.</p>

      <h3>For Corporate Gifting</h3>
      <p>Did you know we offer custom logo cookies? Impress your clients and employees with a branded treat that tastes as good as it looks. Contact us early—our corporate slots fill up fast!</p>
    `
  },
  {
    slug: "why-we-use-real-butter",
    title: "Why We Use Real Butter (And Why It Matters)",
    excerpt: "No margarine, no shortening. Just pure, creamy, high-quality butter. Here's why we refuse to compromise.",
    date: "2024-10-05",
    image: "/images/blog/real-butter.png",
    content: `
      <p>In a world of shortcuts and substitutes, we stand firm on one thing: <strong>Butter is King.</strong></p>

      <h3>Flavour Profile</h3>
      <p>Real butter provides a rich, creamy flavour base that shortening simply cannot replicate. It carries the notes of vanilla and chocolate, amplifying them rather than muting them with a waxy aftertaste.</p>

      <h3>Melt-in-Your-Mouth Texture</h3>
      <p>Butter has a melting point that is just below body temperature. This means our cookies literally melt in your mouth, releasing their flavour instantly. Shortening, with its higher melting point, can leave a coating on your tongue.</p>

      <h3>Clean Ingredients</h3>
      <p>We believe in eating food, not science experiments. Our butter has two ingredients: cream and salt. Simple, natural, and delicious. That's the Sugar Cubed Creations promise.</p>
    `
  },
];

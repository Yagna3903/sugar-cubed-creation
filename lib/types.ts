export type Product = {
  id: string
  slug: string
  name: string
  price: number
  image: string
  images: string[]
  badges?: ("best-seller" | "new" | "seasonal" | "printed" | "corporate")[]
  description?: string
  stock?: number | null;        // ✅ allow null
  maxPerOrder?: number | null;
}
export type BlogPost = { slug: string; title: string; excerpt: string; date: string; image: string; content: string }
export type Promo = { title: string; blurb: string; cta: string; href: string; image: string }

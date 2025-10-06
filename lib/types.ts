export type Product = {
  id: string
  slug: string
  name: string
  price: number
  image: string
  badges?: ("best-seller" | "new" | "seasonal" | "printed" | "corporate")[]
  description?: string

  stock?: number;        // how many are available
  maxPerOrder?: number;
}
export type BlogPost = { slug: string; title: string; excerpt: string; date: string }
export type Promo = { title: string; blurb: string; cta: string; href: string; image: string }

// lib/server/validators.ts
import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Checkout (unchanged)                                              */
/* ------------------------------------------------------------------ */

export const OrderItemInput = z.object({
  id: z.string().min(1), // product id
  qty: z.number().int().min(1).max(99),
});

export const CustomerInput = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  address: z
    .object({
      line1: z.string().optional(),
      city: z.string().optional(),
      postal: z.string().optional(),
    })
    .optional(),
});

export const CreateOrderInput = z.object({
  customer: CustomerInput,
  items: z.array(OrderItemInput).min(1, "At least one item"),
});
export type CreateOrder = z.infer<typeof CreateOrderInput>;

/* ------------------------------------------------------------------ */
/*  Admin helpers                                                      */
/* ------------------------------------------------------------------ */

// Handles HTML checkbox values ("on"), "true"/"false", 1/0, and booleans.
const boolFromForm = z
  .union([z.boolean(), z.string(), z.number()])
  .transform((v) => {
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v !== 0;
    const s = (v as string).toLowerCase();
    return s === "on" || s === "true" || s === "1" || s === "yes";
  });

// Shared transforms
const badgesFromCommaList = z
  .string()
  .optional()
  .transform((s) =>
    (s ?? "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
  );

const imageUrlFromInput = z
  .string()
  .url()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : undefined));

/* ------------------------------------------------------------------ */
/*  Products – two compatible shapes                                  */
/*    1) ProductCreate/Update → price as string (actions do cents)    */
/*    2) UpsertProductInput     → price as number                     */
/* ------------------------------------------------------------------ */

// 1) Price as STRING (good when your action converts dollars → cents)
const ProductBaseStringPrice = z.object({
  slug: z.string().min(1, "Slug required"),
  name: z.string().min(1, "Name required"),
  description: z.string().trim().optional(),
  price: z.preprocess((v) => (typeof v === "string" ? v.trim() : v), z.string().min(1)),
  imageUrl: imageUrlFromInput,
  badges: badgesFromCommaList,
  active: boolFromForm.optional().default(true),
  stock: z
    .preprocess((v) => (v === "" || v == null ? undefined : v), z.coerce.number().int().min(0))
    .optional()
    .default(0),
  maxPerOrder: z
    .preprocess((v) => (v === "" || v == null ? undefined : v), z.coerce.number().int().min(1).max(50))
    .optional()
    .default(12),
});

export const ProductCreateInput = ProductBaseStringPrice;
export const ProductUpdateInput = ProductBaseStringPrice.partial().extend({
  id: z.string().min(1),
});
export type ProductCreate = z.infer<typeof ProductCreateInput>;
export type ProductUpdate = z.infer<typeof ProductUpdateInput>;

// 2) Price as NUMBER (good if your action already coerces/uses number)
export const UpsertProductInput = z.object({
  id: z.string().min(1).optional(), // optional on create
  slug: z.string().min(1, "Slug required"),
  name: z.string().min(1, "Name required"),
  description: z.string().trim().optional(),
  price: z.coerce.number().min(0, "Price must be ≥ 0"),
  imageUrl: imageUrlFromInput,
  badges: badgesFromCommaList,
  active: boolFromForm.optional().default(true),
  stock: z.coerce.number().int().min(0).default(0),
  maxPerOrder: z.coerce.number().int().min(1).max(50).default(12),
});
export type UpsertProduct = z.infer<typeof UpsertProductInput>;

/* ------------------------------------------------------------------ */
/*  Orders (admin)                                                     */
/* ------------------------------------------------------------------ */

export const UpdateOrderStatusInput = z.object({
  id: z.string().min(1),
  status: z.enum(["pending", "paid", "fulfilled", "cancelled"]),
});
export type UpdateOrderStatus = z.infer<typeof UpdateOrderStatusInput>;

/* ------------------------------------------------------------------ */
/*  FAQ (admin) – NEW                                                  */
/* ------------------------------------------------------------------ */

export const FaqBase = z.object({
  question: z.string().min(1, "Question required"),
  answer: z.string().min(1, "Answer required"),
  active: boolFromForm.optional().default(true),
  sort: z
    .preprocess((v) => (v === "" || v == null ? undefined : v), z.coerce.number().int())
    .optional(),
});

export const FaqCreateInput = FaqBase;
export const FaqUpdateInput = FaqBase.partial().extend({
  id: z.string().min(1),
});

export type FaqCreate = z.infer<typeof FaqCreateInput>;
export type FaqUpdate = z.infer<typeof FaqUpdateInput>;

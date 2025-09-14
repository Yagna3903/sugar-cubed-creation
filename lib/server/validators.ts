// lib/server/validators.ts
import { z } from "zod";

export const OrderItemInput = z.object({
  id: z.string().min(1),             // product id
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

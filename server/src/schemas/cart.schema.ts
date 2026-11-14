import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  variantId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  size: z.enum(["XS", "S", "M", "L", "XL", "XXL"]),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;

export const updateCartItemSchema = z.object({
  action: z.enum(["add", "remove"]),
});

export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;

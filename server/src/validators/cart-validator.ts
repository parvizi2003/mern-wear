import mongoose from "mongoose";
import { z } from "zod";

const objectId = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId",
  });

export const cartItemSchema = z.object({
  productId: objectId,
  variantId: objectId,
  size: z.enum(["XS", "S", "M", "L", "XL", "XXL"]),
});

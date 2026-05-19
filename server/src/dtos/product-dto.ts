import type { Document } from "mongoose";
import { productVariantDTO } from "./product-variant-dto";

export type ProductDoc = Document & {
  _id: any;
  name: string;
  slug: string;
  description?: string;
  price: number;
  category: any;
  variants?: any[];
};

export const productDTO = (product: ProductDoc) => {
  return {
    id: product._id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    category: product.category,
    variants: product.variants ? product.variants.map(productVariantDTO) : [],
  };
};

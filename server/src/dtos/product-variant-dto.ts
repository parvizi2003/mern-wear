import type { Document } from "mongoose";

export type ProductVariantDoc = Document & {
  _id: any;
  color: {
    name: string;
    code: string;
  };
  image: string;
  sizes: {
    size: string;
    stock: number;
  }[];
  skuPrefix?: string;
};

export const productVariantDTO = (variant: ProductVariantDoc) => {
  return {
    id: variant._id,
    color: variant.color,
    image: variant.image,
    sizes: variant.sizes,
    skuPrefix: variant.skuPrefix,
  };
};

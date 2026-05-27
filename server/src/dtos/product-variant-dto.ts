import type { Document, Types } from "mongoose";

export type ProductVariantDoc = Document & {
  _id: Types.ObjectId;
  color: {
    name: string;
    code: string;
  };
  image: string;
  sizes: {
    size: string;
    stock: number;
  }[];
};

export const productVariantDTO = (variant: ProductVariantDoc) => {
  return {
    id: variant._id.toString(),
    color: variant.color,
    image: variant.image,
    sizes: variant.sizes,
  };
};

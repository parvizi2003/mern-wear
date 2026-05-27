import { Document, Types } from "mongoose";
import {
  productVariantDTO,
  type ProductVariantDoc,
} from "./product-variant-dto";
import { CategoryDoc, categoryDTO } from "./category-dto";

export type ProductDoc = Document & {
  _id: Types.ObjectId;

  name: string;
  slug: string;
  description?: string;
  price: number;

  category: Types.ObjectId | CategoryDoc;

  variants?: Types.ObjectId[] | ProductVariantDoc[];
};

export const productDTO = (product: ProductDoc) => {
  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description || "",
    price: product.price,

    category:
      product.category instanceof Types.ObjectId
        ? product.category.toString()
        : categoryDTO(product.category),

    variants:
      product.variants?.map((variant) =>
        variant instanceof Types.ObjectId
          ? variant.toString()
          : productVariantDTO(variant),
      ) || [],
  };
};

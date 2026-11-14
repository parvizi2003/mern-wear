import type { Types } from "mongoose";

export interface PopulatedCategory {
  _id: Types.ObjectId;
  slug: string;
}

export interface PopulatedVariant {
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
}

export interface ProductVariantDto {
  id: string;
  color: {
    name: string;
    code: string;
  };
  image: string;
  sizes: {
    size: string;
    stock: number;
  }[];
}

export interface ProductDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  variants: ProductVariantDto[];
}

import type { Types } from "mongoose";

export interface PopulatedProduct {
  _id: Types.ObjectId;
  name: string;
  slug: string;
}

export interface PopulatedVariant {
  _id: Types.ObjectId;
  color: {
    name: string;
    code: string;
  };
  image: string;
}

export interface CartItemDto {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  image: string;
  variantId: string;
  color: {
    name: string;
    code: string;
  };
  size: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CartDto {
  items: CartItemDto[];
  itemsCount: number;
  total: number;
}

export interface AddToCartResponseDto {
  item: CartItemDto;
  itemsCount: number;
  total: number;
}

export interface UpdateCartItemResponseDto {
  item: {
    id: string;
    quantity: number | null;
  };

  itemsCount: number;
  total: number;
}

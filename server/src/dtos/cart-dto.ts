import { HydratedDocument, Types } from "mongoose";

export type CartItemDoc = HydratedDocument<{
  _id: Types.ObjectId;
  product: Types.ObjectId | null;
  variant: Types.ObjectId | null;
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  quantity: number;
  price: number;
}>;

export type CartDoc = HydratedDocument<{
  _id: Types.ObjectId;
  user: Types.ObjectId | null;
  sessionId: string | null;
  itemsCount: number;
  total: number;
  items?: CartItemDoc[];
}>;

export type CartItemDto = {
  id: string;
  product: string | null;
  variant: string | null;
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  quantity: number;
  price: number;
};

export type CartDto = {
  id: string;
  userId: string | null;
  itemsCount: number;
  total: number;
  items?: CartItemDto[];
};

export const cartItemDto = (item: CartItemDoc): CartItemDto => {
  return {
    id: item._id.toString(),
    product: item.product?.toString() ?? null,
    variant: item.variant?.toString() ?? null,
    size: item.size,
    quantity: item.quantity,
    price: item.price,
  };
};

export const cartDto = (cart: CartDoc): CartDto => {
  return {
    id: cart._id.toString(),
    userId: cart.user?.toString() ?? null,
    itemsCount: cart.itemsCount,
    total: cart.total,

    ...(cart.items && {
      items: cart.items.map(cartItemDto),
    }),
  };
};

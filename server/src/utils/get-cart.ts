import { Cart } from "../models/cart";

export const getCart = async (userId: string) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  return cart;
};

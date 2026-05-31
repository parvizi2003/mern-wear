import { Request } from "express";
import { CartRequest } from "../../types/cart-request";

export const getCartFromRequest = async (req: Request) => {
  const cartReq = req as CartRequest;
  const cart = cartReq.cart;

  if (!cart) {
    throw new Error("Cart not found");
  }

  return cart;
};

import { Request, Response, NextFunction } from "express";
import { Cart } from "../models/cart";
import { CartDoc } from "../dtos/cart-dto";

export const ensureCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;
  const sessionId = req.sessionId;

  let cart;

  if (userId) {
    cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId });
    }
  } else {
    cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = await Cart.create({ sessionId });
    }
  }

  req.cart = cart as CartDoc;
  next();
};

import type { Request, Response, NextFunction } from "express";
import { Cart } from "../models/cart.model.js";

export const ensureCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const filter = req.user
      ? { user: req.user.id }
      : { sessionId: req.sessionId };

    const cart = await Cart.findOneAndUpdate(
      filter,
      { $setOnInsert: filter },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    req.cart = cart;
    next();
  } catch (error) {
    next(error);
  }
};

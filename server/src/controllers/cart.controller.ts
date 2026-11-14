import type { Request, Response } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
} from "../services/cart.service.js";
import type { CartDocument } from "../models/cart.model.js";
import type {
  AddToCartInput,
  UpdateCartItemInput,
} from "../schemas/cart.schema.js";

export const get = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const sessionId = req.sessionId;

  const cart = await getCart(userId, sessionId);

  res.status(200).json(cart);
};

export const addProduct = async (
  data: AddToCartInput,
  req: Request,
  res: Response,
) => {
  const cart = req.cart as CartDocument;

  const response = await addToCart(cart, data);

  res.status(200).json(response);
};

export const updateProduct = async (
  data: UpdateCartItemInput,
  req: Request,
  res: Response,
) => {
  const cart = req.cart as CartDocument;
  const itemId = req.params.itemId as string;

  const response = await updateCartItem(cart, itemId, data);

  res.status(200).json(response);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const cart = req.cart as CartDocument;
  const itemId = req.params.itemId as string;

  const response = await deleteCartItem(cart, itemId);

  res.status(200).json(response);
};

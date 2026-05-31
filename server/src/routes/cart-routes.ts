import express from "express";

import {
  getCart,
  addItemToCart,
  decreaseItemQuantity,
  deleteCartItem,
  clearCart,
} from "../controllers/cart-controller";

const router = express.Router();

router.get("/", getCart);
router.post("/items", addItemToCart);
router.patch("/items/:itemId", decreaseItemQuantity);
router.delete("/items/:itemId", deleteCartItem);
router.delete("/", clearCart);

export default router;

import express from "express";

import {
  getCart,
  addItemToCart,
  decreaseItemQuantity,
  increaseItemQuantity,
  deleteCartItem,
  clearCart,
} from "../controllers/cart-controller";

const router = express.Router();

router.get("/", getCart);
router.post("/items", addItemToCart);
router.patch("/items/:itemId/decrease", decreaseItemQuantity);
router.patch("/items/:itemId/increase", increaseItemQuantity);
router.delete("/items/:itemId", deleteCartItem);
router.delete("/", clearCart);

export default router;

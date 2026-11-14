import { Router } from "express";
import {
  get,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/cart.controller.js";
import {
  addToCartSchema,
  updateCartItemSchema,
} from "../schemas/cart.schema.js";
import { validate } from "../types/types.js";
import { optionalAuth } from "../middlewares/optional-auth.middleware.js";
import { guest } from "../middlewares/guest.middleware.js";
import { ensureCart } from "../middlewares/ensure-cart.middleware.js";

const router = Router();

router.get("/", optionalAuth, guest, get);
router.post(
  "/items",
  optionalAuth,
  guest,
  ensureCart,
  validate(addToCartSchema, addProduct),
);
router.patch(
  "/items/:itemId",
  optionalAuth,
  guest,
  ensureCart,
  validate(updateCartItemSchema, updateProduct),
);
router.delete("/items/:itemId", optionalAuth, guest, ensureCart, deleteProduct);

export default router;

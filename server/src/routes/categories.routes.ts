import { Router } from "express";
import {
  create,
  getCategories,
  getCategoryProducts,
  remove,
  update,
} from "../controllers/categories.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin-only.middleware.js";
import { validate } from "../types/types.js";
import { categorySchema } from "../schemas/category.schema.js";
const router = Router();

router.get("/", getCategories);
router.get("/:slug", getCategoryProducts);
router.post("/", protect, adminOnly, validate(categorySchema, create));
router.patch("/:id", protect, adminOnly, validate(categorySchema, update));
router.delete("/:id", protect, adminOnly, remove);

export default router;

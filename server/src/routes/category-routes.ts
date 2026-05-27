import { Router } from "express";
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  deleteCategory,
  getCategoryProducts,
} from "../controllers/category-controller";

import { isAdmin } from "../middleware/is-admin";

const router = Router();

/* ---------------- CATEGORY ROUTES ---------------- */

router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);
router.get("/:slug/products", getCategoryProducts);
router.post("/create", isAdmin, createCategory);
router.delete("/:id", isAdmin, deleteCategory);

export default router;

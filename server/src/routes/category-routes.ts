import { Router } from "express";
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  deleteCategory,
} from "../controllers/category-controller";

import { isAdmin } from "../middleware/is-admin";

const router = Router();

/* ---------------- CATEGORY ROUTES ---------------- */

router.get("/", getCategories);
router.get("/:id", getCategoryBySlug);

router.post("/create", isAdmin, createCategory);
router.delete("/:id", isAdmin, deleteCategory);

export default router;

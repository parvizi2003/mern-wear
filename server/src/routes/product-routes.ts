import { Router } from "express";
import {
  getProductBySlug,
  deleteProduct,
  getProductsByCategory,
} from "../controllers/product-controller";

import { isAdmin } from "../middleware/is-admin";

const router = Router();

/* ---------------- PUBLIC ---------------- */

router.get("/:categorySlug", getProductsByCategory);
router.get("/slug/:slug", getProductBySlug);

/* ---------------- ADMIN ---------------- */

router.delete("/:id", isAdmin, deleteProduct);

export default router;

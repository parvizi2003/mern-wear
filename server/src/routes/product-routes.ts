import { Router } from "express";
import {
  getNewProducts,
  getProductBySlug,
  deleteProduct,
  getRelatedProducts,
} from "../controllers/product-controller";

import { isAdmin } from "../middleware/is-admin";
import { checkAuth } from "../middleware/check-auth";

const router = Router();

/* ---------------- PUBLIC ---------------- */

router.get("/new", getNewProducts);
router.get("/:slug", getProductBySlug);
router.get("/:slug/related", getRelatedProducts);

/* ---------------- ADMIN ---------------- */

router.delete("/:id", checkAuth, isAdmin, deleteProduct);

export default router;

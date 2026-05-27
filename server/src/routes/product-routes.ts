import { Router } from "express";
import {
  getNewProducts,
  getProductBySlug,
  deleteProduct,
  getRelatedProducts,
} from "../controllers/product-controller";

import { isAdmin } from "../middleware/is-admin";

const router = Router();

/* ---------------- PUBLIC ---------------- */

router.get("/new", getNewProducts);
router.get("/:slug", getProductBySlug);
router.get("/:slug/related", getRelatedProducts);

/* ---------------- ADMIN ---------------- */

router.delete("/:id", isAdmin, deleteProduct);

export default router;

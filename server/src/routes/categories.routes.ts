import { Router } from "express";
import {
  getCategories,
  getCategoryProducts,
} from "../controllers/categories.controller.js";
const router = Router();

router.get("/", getCategories);
router.get("/:slug", getCategoryProducts);

export default router;

import { Router } from "express";

import { getProductBySlug } from "../controllers/products.controller.js";
const router = Router();

router.get("/:slug", getProductBySlug);

export default router;

import { Router } from "express";
import { create, getUserOrders } from "../controllers/order-controller";
import { ensureCart } from "../middleware/ensure-cart";
import { checkAuth } from "../middleware/check-auth";

const router = Router();

router.get("/my-orders", checkAuth, ensureCart, getUserOrders);
router.post("/create", checkAuth, ensureCart, create);

export default router;

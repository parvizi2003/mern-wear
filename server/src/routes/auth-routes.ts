import express from "express";
import { register, login, logout, me } from "../controllers/auth-controller";
import { checkAuth } from "../middleware/check-auth";
import { ensureCart } from "../middleware/ensure-cart";

const router = express.Router();

router.post("/register", ensureCart, register);
router.post("/login", ensureCart, login);
router.post("/logout", logout);
router.get("/me", checkAuth, me);

export default router;

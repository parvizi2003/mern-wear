import express from "express";
import { register, login, logout, me } from "../controllers/auth-controller";
import { checkAuth } from "../middleware/check-auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", checkAuth, me);

export default router;

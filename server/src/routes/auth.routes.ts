import { Router } from "express";
import {
  getMe,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { validate } from "../types/types.js";
import { protect } from "../middlewares/auth.middleware.js";
import { guest } from "../middlewares/guest.middleware.js";

const router = Router();

router.post("/register", guest, validate(registerSchema, register));
router.post("/login", guest, validate(loginSchema, login));
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

export default router;

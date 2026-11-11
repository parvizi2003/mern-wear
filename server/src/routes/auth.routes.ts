import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { validate } from "../types/validated-request.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema, register));
router.post("/login", validate(loginSchema, login));
router.post("/logout", protect, logout);

export default router;

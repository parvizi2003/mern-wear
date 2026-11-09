import { Router } from "express";
import { healthCheck } from "../controllers/health.controller.js";

const router = Router();

router.get("/", healthCheck);

router.get("/error", (req, res, next) => {
  next(new Error("Test error"));
});

export default router;

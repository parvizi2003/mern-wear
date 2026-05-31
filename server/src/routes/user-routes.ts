import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
} from "../controllers/user-controller";

import { isAdmin } from "../middleware/is-admin";
import { checkAuth } from "../middleware/check-auth";

const router = Router();

router.get("/", checkAuth, isAdmin, getUsers);
router.get("/:id", checkAuth, isAdmin, getUserById);
router.post("/", checkAuth, isAdmin, createUser);
router.delete("/:id", checkAuth, isAdmin, deleteUser);

export default router;

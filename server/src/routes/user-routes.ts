import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
} from "../controllers/user-controller";

import { isAdmin } from "../middleware/is-admin";

const router = Router();

router.get("/", isAdmin, getUsers);
router.get("/:id", isAdmin, getUserById);
router.post("/", isAdmin, createUser);
router.delete("/:id", isAdmin, deleteUser);

export default router;

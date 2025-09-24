// src/routes/users.routes.js
import { Router } from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = Router();

// Todas las rutas de usuarios deben estar protegidas y ser de admin
router.get("/", verifyToken, verifyAdmin, getUsers);
router.get("/:id", verifyToken, verifyAdmin, getUser);
router.put("/:id", verifyToken, verifyAdmin, updateUser);
router.delete("/:id", verifyToken, verifyAdmin, deleteUser);

export default router;

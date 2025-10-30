import { Router } from "express";
import * as authController from "../controllers/authController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// Rotas públicas
router.post("/register", authController.register);
router.post("/login", authController.login);

// Rotas protegidas
router.get("/protected", authenticateToken, authController.protectedRoute);

export default router;

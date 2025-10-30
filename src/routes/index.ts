import { Router } from "express";
import authRoutes from "./authRoutes";
import chatRoutes from "./chatRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);

export default router;

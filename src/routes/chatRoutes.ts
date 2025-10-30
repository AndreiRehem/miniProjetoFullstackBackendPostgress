import { Router } from "express";
import { sendMessage, getHistory } from "../controllers/chatController";
import { authenticateToken } from "../middlewares/authMiddleware";
const router = Router();

router.post("/", authenticateToken, sendMessage);
router.get("/", authenticateToken, getHistory);

export default router;

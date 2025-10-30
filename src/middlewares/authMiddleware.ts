import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export interface AuthRequest extends Request {
  userId?: number; // ID numérico do usuário (PostgreSQL usa integer, não string)
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : undefined;

  if (!token) {
    console.warn("🚫 Tentativa de acesso sem token JWT.");
    return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    req.userId = decoded.id;

    console.log(`✅ Token válido. Acesso autorizado para userId: ${req.userId}.`);
    next();
  } catch (err) {
    console.error("❌ Token inválido ou expirado:", err);
    return res.status(403).json({ message: "Token inválido ou expirado." });
  }
};

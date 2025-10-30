import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : undefined;

  if (!token) {
    console.log('Log: Tentativa de acesso a rota protegida sem token.');
    return res
      .status(401)
      .json({ message: 'Acesso negado. Token não fornecido.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Log: Token inválido fornecido.');
      return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }

    req.userId = (decoded as { id: string }).id;
    console.log(`Log: Acesso autorizado para userId: ${req.userId}.`);
    next();
  });
};

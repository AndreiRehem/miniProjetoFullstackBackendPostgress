import { User } from "../models/User";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// 🔑 Gera token JWT
const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1d" });
};

// 👤 Registrar usuário
export const registerUser = async (name: string, email: string, password: string) => {
  // Verifica se já existe
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email já está em uso.");
  }

  // Cria novo usuário
  const user = await User.create({ name, email, password });
  console.log(`✅ Usuário ${user.email} registrado com sucesso.`);
  return user;
};

// 🔐 Login e geração de token
export const loginUser = async (email: string, password: string): Promise<string> => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("Credenciais inválidas.");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Credenciais inválidas.");
  }

  const token = generateToken(user.id);
  console.log(`🔓 Login bem-sucedido para o usuário ${user.email}.`);
  return token;
};

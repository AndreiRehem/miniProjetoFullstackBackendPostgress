import db from "../models";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();


const { User } = db;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1d" });
};

export const registerUser = async (name: string, email: string, password: string) => {
  if (!User) throw new Error("Modelo User não foi inicializado corretamente.");

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error("Email já está em uso.");

  const user = await User.create({ name, email, password });
  console.log(`✅ Usuário ${user.email} registrado com sucesso.`);
  return user;
};

export const loginUser = async (email: string, password: string): Promise<string> => {
  if (!User) throw new Error("Modelo User não foi inicializado corretamente.");

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Credenciais inválidas.");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Credenciais inválidas.");

  const token = generateToken(user.id);
  console.log(`🔓 Login bem-sucedido para o usuário ${user.email}.`);
  return token;
};

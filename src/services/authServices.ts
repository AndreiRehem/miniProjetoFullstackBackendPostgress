import { HydratedDocument } from 'mongoose'; // 💡 IMPORTANTE: Importar HydratedDocument
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Cria um novo usuário
export const registerUser = async (name: string, email: string, password: string): Promise<IUser> => {
    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Email já está em uso.');
    }

    // Tipamos o objeto 'user' como HydratedDocument<IUser> para melhor suporte ao _id
    const user: HydratedDocument<IUser> = new User({ name, email, password });
    await user.save();

    console.log(`Log: Usuário ${user.email} registrado com sucesso.`);
    // O retorno ainda é IUser, que HydratedDocument<IUser> é compatível
    return user;
};

// Gera o token JWT
const generateToken = (userId: string): string => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1d' });
};

// Autentica o usuário e retorna o token
export const loginUser = async (email: string, password: string): Promise<string> => {
    // Tipamos o retorno da busca como HydratedDocument<IUser> | null
    const user: HydratedDocument<IUser> | null = await User.findOne({ email }).select('+password');

    if (!user) {
        throw new Error('Credenciais inválidas.');
    }

    // Compara a senha (método definido no Model)
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new Error('Credenciais inválidas.');
    }

    // ✅ CORREÇÃO APLICADA: 'user._id' agora é reconhecido corretamente pelo TypeScript.
    const token = generateToken(user.id.toString());
    console.log(`Log: Login bem-sucedido para o usuário ${user.email}.`);
    return token;
};
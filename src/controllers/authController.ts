import { Request, Response } from 'express';
import * as authService from '../services/authServices';
import { AuthRequest } from '../middlewares/authMiddleware'; // Importa a interface estendida

// POST /register
export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    // TODO: Adicionar validação de formato de email/senha aqui ou em um middleware
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos (name, email, password) são obrigatórios.' });
    }

    try {
        const user = await authService.registerUser(name, email, password);
        // Retorna apenas dados públicos
        return res.status(201).json({ id: user._id, name: user.name, email: user.email });
    } catch (error) {
        const errorMessage = (error as Error).message;
        // Trata erro de email repetido (lançado pelo Service)
        if (errorMessage.includes('Email já está em uso')) {
            return res.status(409).json({ message: errorMessage }); // 409 Conflict
        }
        // Erro genérico do DB/Serviço
        return res.status(500).json({ message: 'Erro ao registrar usuário.', error: errorMessage });
    }
};

// POST /login
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try {
        const token = await authService.loginUser(email, password);
        return res.status(200).json({ token });
    } catch (error) {
        const errorMessage = (error as Error).message;
        // Trata erro de credenciais inválidas (lançado pelo Service)
        if (errorMessage.includes('Credenciais inválidas')) {
            return res.status(401).json({ message: errorMessage }); // 401 Unauthorized
        }
        return res.status(500).json({ message: 'Erro ao tentar fazer login.', error: errorMessage });
    }
};

// GET /protected (usando AuthRequest)
export const protectedRoute = (req: AuthRequest, res: Response) => {
    // O userId foi injetado pelo authMiddleware.
    return res.status(200).json({
        message: 'Acesso autorizado!',
        userId: req.userId,
        info: 'Esta rota é acessível apenas com um token JWT válido.'
    });
};
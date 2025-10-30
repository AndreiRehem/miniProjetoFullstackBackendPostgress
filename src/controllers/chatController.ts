import { Response } from "express";
import { sendMessageToChatbot, getChatHistory } from "../services/chat.service";
import { AuthRequest } from "../middlewares/authMiddleware";

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId; // vem do token JWT
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "O campo 'message' é obrigatório." });
    }
    
    const responseText = await sendMessageToChatbot(String(userId), message);
    res.status(200).json({ reply: responseText });
  } catch (err) {
    console.error("Erro ao enviar mensagem:", err);
    res.status(500).json({ error: "Erro ao processar a mensagem." });
  }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const history = await  getChatHistory(String(userId));
    res.status(200).json(history);
  } catch (err) {
    console.error("Erro ao buscar histórico:", err);
    res.status(500).json({ error: "Erro ao buscar histórico." });
  }
};

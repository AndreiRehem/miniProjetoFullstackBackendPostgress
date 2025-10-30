import { GoogleGenerativeAI } from "@google/generative-ai";
import { Conversation } from "../models/Conversation";
import { Message } from "../models/Message";
import * as dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY não está definida no .env");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const generationConfig = { temperature: 0.7, maxOutputTokens: 2048 };

// 🧠 Prompt base da IA
export const defaultPrompt = `
Você é **Codey.IA**, um assistente de programação didático e direto ao ponto.
Ajude com exemplos de código, boas práticas e explicações curtas e claras.
`;

export const sendMessageToChatbot = async (userId: string, message: string): Promise<string> => {
  // Busca ou cria uma conversa
  let conversation = await Conversation.findOne({ where: { userId } });
  if (!conversation) {
    conversation = await Conversation.create({
      userId,
      modelName: "gemini-2.5-flash",
    });
  }

  // Busca histórico anterior
  const previousMessages = await Message.findAll({
    where: { conversationId: conversation.id },
    order: [["timestamp", "ASC"]],
  });

  const history = [
    { role: "user", parts: [{ text: defaultPrompt }] },
    ...previousMessages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  try {
    const result = await model.generateContent({
      contents: history,
      generationConfig,
    });

    const responseText = result.response.text();

    // Salva novas mensagens no banco
    await Message.create({
      conversationId: conversation.id,
      role: "user",
      text: message,
      timestamp: new Date(),
    });

    await Message.create({
      conversationId: conversation.id,
      role: "model",
      text: responseText,
      timestamp: new Date(),
    });

    console.log(`💬 Mensagem processada para o usuário ${userId}`);
    return responseText;
  } catch (error) {
    console.error("❌ Erro no serviço do Gemini:", error);
    throw new Error("Erro ao processar mensagem com o modelo Gemini.");
  }
};

// 📜 Histórico do usuário
export const getChatHistory = async (userId: string) => {
  const conversation = await Conversation.findOne({ where: { userId } });
  if (!conversation) return [];

  const messages = await Message.findAll({
    where: { conversationId: conversation.id },
    order: [["timestamp", "ASC"]],
  });

  return messages.map((msg) => ({
    role: msg.role,
    text: msg.text,
    timestamp: msg.timestamp,
  }));
};

import express, { Application } from "express";
import * as dotenv from "dotenv";
import { connectDB } from "./database";
import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";

// 1️⃣ Carrega o arquivo .env
dotenv.config();

// 2️⃣ Define ambiente e variáveis conforme o modo
const isProduction = process.env.NODE_ENV === "production";

const PORT = process.env.PORT || 3000;

// 3️⃣ Loga o ambiente e o banco (sem expor credenciais)
console.log("===============================================");
console.log(`✅ Ambiente: ${isProduction ? "Produção" : "Desenvolvimento"}`);
console.log(`🐘 Banco de dados: PostgreSQL`);
console.log("===============================================");

// 4️⃣ Inicializa o app Express
const app: Application = express();

// 5️⃣ Middlewares globais
app.use(express.json());

// 6️⃣ Rotas principais
app.use("/", authRoutes);
app.use("/chat", chatRoutes);

// 7️⃣ Conecta ao banco PostgreSQL
(async () => {
  try {
    await connectDB();
    console.log("🚀 Banco de dados conectado com sucesso.");
  } catch (error) {
    console.error("❌ Falha ao conectar ao banco de dados:", error);
    process.exit(1);
  }

  // 8️⃣ Sobe o servidor
  app.listen(PORT, () => {
    console.log(`🌐 Servidor rodando em http://localhost:${PORT}`);
  });
})();

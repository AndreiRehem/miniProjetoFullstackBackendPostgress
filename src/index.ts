import express, { Application } from "express";
import * as dotenv from "dotenv";
import { connectDB } from "./database";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";

// 1️⃣ Carrega o arquivo .env
dotenv.config();

// 2️⃣ Define ambiente e variáveis conforme o modo
const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3002;

// 3️⃣ Loga o ambiente e o banco (sem expor credenciais)
console.log("===============================================");
console.log(`✅ Ambiente: ${isProduction ? "Produção" : "Desenvolvimento"}`);
console.log(`🐘 Banco de dados: PostgreSQL`);
console.log("===============================================");

// 4️⃣ Inicializa o app Express
const app: Application = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://mini-projeto-fullstack-frontend-postgress-lulgjpby2.vercel.app",
      "https://frontendpostgress.andreirehem.dev", // caso você tenha um domínio customizado também
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 5️⃣ Middlewares globais
app.use(express.json());

// 6️⃣ Rotas principais
app.use("/", authRoutes);
app.use("/chat", chatRoutes);

// 7️⃣ Conecta ao banco e sincroniza os modelos
(async () => {
  try {
    await connectDB();

    // 🔹 Importa os modelos e sincroniza com o banco
    const db = await import("./models");
    await db.default.sequelize.sync({ alter: true });
    console.log("📦 Tabelas sincronizadas com o banco de dados.");

    console.log("🚀 Banco de dados conectado com sucesso.");
  } catch (error) {
    console.error("❌ Falha ao conectar ou sincronizar com o banco de dados:", error);
    process.exit(1);
  }

  // 8️⃣ Sobe o servidor
  app.listen(PORT, () => {
    console.log(`🌐 Servidor rodando em http://localhost:${PORT}`);
  });
})();

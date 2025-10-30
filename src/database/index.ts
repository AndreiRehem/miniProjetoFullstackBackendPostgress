import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

let sequelize: Sequelize;

if (isProduction && process.env.DATABASE_URL) {
  // Produção (Render / Railway / Neon / Vercel)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
    logging: false,
  });
  console.log(">>> [SEQUELIZE] Usando ambiente: produção");
} else {
  // Desenvolvimento local (Docker ou máquina local)
  console.log(">>> [SEQUELIZE] Usando ambiente: development");
  sequelize = new Sequelize(
    process.env.POSTGRES_DATABASE as string,
    process.env.POSTGRES_USER as string,
    process.env.POSTGRES_PASSWORD as string,
    {
      host: process.env.POSTGRES_HOST || "localhost",
      port: Number(process.env.POSTGRES_PORT) || 5432,
      dialect: "postgres",
      logging: console.log,
    }
  );
}

export { sequelize };

// Função auxiliar para testar conexão
export const connectDB = async () => {
  try {
    console.log(">>> [SEQUELIZE] Tentando conectar usando credenciais separadas...");
    await sequelize.authenticate();
    console.log(">>> [SEQUELIZE] Conexão com PostgreSQL estabelecida com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco:", error);
    throw error;
  }
};

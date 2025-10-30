import mongoose from "mongoose";

const connectDB = async (uri: string, dbName: string) => {
  try {
    if (!uri) {
      throw new Error("ERRO: A variável de ambiente MONGO_URI não foi definida.");
    }

    await mongoose.connect(uri, { dbName });
    console.log(`✅ MongoDB conectado com sucesso ao banco: ${dbName}`);
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error);
  }
};

export default connectDB;

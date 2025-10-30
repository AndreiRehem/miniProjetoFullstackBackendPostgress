require('dotenv').config();

//
// ✅ Validação básica das variáveis obrigatórias (ambiente de desenvolvimento)
//
const requiredDevVars = [
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
  'POSTGRES_HOST',
  'POSTGRES_PORT'
];

for (const varName of requiredDevVars) {
  if (!process.env[varName]) {
    console.warn(`⚠️  Variável de ambiente faltando: ${varName}`);
  }
}

if (!process.env.DATABASE_URL) {
  console.warn(`⚠️  Aviso: DATABASE_URL (produção) não definida no .env`);
}

//
// ✅ Exporta as configurações do Sequelize para cada ambiente
//
module.exports = {
  development: {
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "senha123",
    database: process.env.POSTGRES_DATABASE || "meu_banco_dev",
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
    dialect: "postgres",
  },

  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // importante para Render / Railway
      },
    },
  },
};

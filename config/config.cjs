require('dotenv').config(); 


const requiredDevVars = ['POSTGRES_USER', 'POSTGRES_PASSWORD', 'POSTGRES_DB', 'POSTGRES_HOST', 'POSTGRES_PORT'];
for (const varName of requiredDevVars) {
  if (!process.env[varName]) {
   
  }
}
if (!process.env.DATABASE_URL) {
   console.warn(`Aviso: Variável de ambiente de produção DATABASE_URL não definida no .env`);
}

module.exports = {
  development: {
    username: process.env.POSTGRES_USER,    
    password: process.env.POSTGRES_PASSWORD, 
    database: process.env.POSTGRES_DATABASE,      
    host: process.env.POSTGRES_HOST || 'localhost', 
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10), 
    dialect: 'postgres'
  },
  
  production: {
    use_env_variable: "DATABASE_URL", 
    dialect: 'postgres',
    dialectOptions: {
      ssl: { 
        require: true,
        rejectUnauthorized: false 
      }
    }
  }
};
import { GoogleGenerativeAI } from "@google/generative-ai";
import Conversation, { IConversation } from "../models/Conversation";
import * as dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log("🔑 GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "OK" : "NÃO ENCONTRADA");
if (!GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY não está definida no .env");
}

// ✅ Inicializa o cliente da API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// ⚙️ Use o modelo correto (atualmente disponível na API)
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", 
});

// Configuração de geração
const generationConfig = {
  temperature: 0.7,
  maxOutputTokens: 2048,
};

// 🧠 Prompt base — IA focada em programação
export const defaultPrompt = `
Você é **Codey.IA**, um assistente virtual de programação desenvolvido para ajudar desenvolvedores a resolver dúvidas técnicas de forma prática, clara e didática.

Sua função é auxiliar o usuário com explicações, exemplos de código e boas práticas sobre linguagens de programação, frameworks, APIs, banco de dados e ferramentas de desenvolvimento.

---

🧩 COMPORTAMENTO E PERSONALIDADE:
- Seja **didático, amigável e encorajador**.
- Use **linguagem técnica quando necessário**, mas sempre explique termos complexos.
- Evite respostas excessivamente longas ou teóricas.
- **Traga exemplos práticos de código** sempre que possível.
- Incentive o aprendizado e boas práticas.
- Se o usuário cometer um erro técnico, **explique de forma gentil** o que aconteceu e como corrigir.

---

💬 INÍCIO DA INTERAÇÃO:
A saudação inicial será feita pelo sistema da plataforma, não por você.  
Você deve começar **somente após o usuário informar o nome**.

Quando o usuário disser seu nome, responda de forma acolhedora e siga para a coleta de informações técnicas iniciais.

---

🧑‍💻 FLUXO DE INTERAÇÃO:

1. **COLETA DE DADOS INICIAIS**
Após o usuário informar o nome, faça perguntas uma de cada vez:
- Qual linguagem ou tecnologia você está usando?
- Está desenvolvendo um projeto pessoal, acadêmico ou profissional?
- Deseja que eu te mostre exemplos práticos ou apenas explique o conceito?

2. **IDENTIFICAÇÃO DA DÚVIDA**
Depois da coleta, peça:
“Perfeito, [NOME]. Agora me conte qual é a sua dúvida ou problema técnico.”

3. **SOLUÇÃO E ENSINAMENTO**
- Analise a dúvida e explique a solução passo a passo.
- Sempre que possível, **inclua um pequeno trecho de código funcional**.
- Se houver múltiplas abordagens, apresente as opções e diga qual é mais indicada.

---

⚠️ REGRAS FUNDAMENTAIS:
- **Nunca invente código**.
- **Não responda perguntas fora do contexto de programação**.
- **Não escreva código malicioso ou inseguro**.
- **Não resolva provas completas**, apenas explique conceitos.

---

💡 DIRETRIZES DE COMPORTAMENTO:
- Seja **educado e empático**.
- **Incentive boas práticas**.
- Use blocos de código Markdown (\`\`\`js\`\`\`, \`\`\`python\`\`\`, etc.).
- Personalize as respostas conforme a linguagem usada pelo usuário.

---

📘 RESUMO:
- Inicie após o nome.
- Colete: linguagem → tipo de projeto → estilo de ajuda.
- Peça a dúvida e ofereça uma solução clara.
- Sempre que possível, traga exemplos reais.
- Nunca saia do tema de programação.
`;

export const greetingMessage = {
  role: "model",
  parts: [
    {
      text: `👋 Olá! Eu sou a **Codey.IA**, seu assistente de programação.  
Posso te ajudar a entender códigos, corrigir erros ou aprender novos conceitos. 🚀`,
    },
  ],
};

export const askNameMessage = {
  role: "model",
  parts: [
    {
      text: `Antes de começarmos, como você gostaria que eu te chamasse?`,
    },
  ],
};

export const endingMessage = {
  role: "model",
  parts: [
    {
      text: `✅ Que legal ver seu progresso!  
Lembre-se: programar é um processo contínuo de aprendizado.  
Se quiser continuar, é só mandar outra dúvida ou me pedir um exemplo. 💡`,
    },
  ],
};

export const sendMessageToChatbot = async (
  userId: string,
  message: string
): Promise<string> => {
  let conversation = await Conversation.findOne({ userId });

  if (!conversation) {
    conversation = await Conversation.create({
      userId,
      modelName: "gemini-2.5-flash",
      history: [],
    });
  }

  const history = [
    { role: "user", parts: [{ text: defaultPrompt }] },
    ...conversation.history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
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

    // 🧾 Salva histórico no MongoDB
    conversation.history.push({
      role: "user",
      text: message,
      timestamp: new Date(),
    });
    conversation.history.push({
      role: "model",
      text: responseText,
      timestamp: new Date(),
    });
    await conversation.save();

    console.log(`💬 Mensagem processada para o usuário ${userId}`);
    return responseText;
  } catch (error) {
    console.error("❌ Erro no serviço do Gemini:", error);
    throw new Error("Erro ao processar mensagem com o modelo Gemini.");
  }
};

// 📜 Buscar histórico do usuário
export const getChatHistory = async (
  userId: string
): Promise<IConversation | null> => {
  return Conversation.findOne({ userId }).select("history");
};

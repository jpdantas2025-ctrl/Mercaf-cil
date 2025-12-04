import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize AI Client
// Ideally this would check for process.env.API_KEY but for this demo environment we assume it's injected or handled by the platform.
// Note: We create a new instance per call if needed to handle key updates, but a singleton is fine for standard usage if env var is static.
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key missing");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const chatWithAssistant = async (
  message: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const ai = getAIClient();
    
    // Using a chat structure via generateContent with history context manually or using chat API
    // Implementing via chat API for session handling
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `Você é o assistente virtual do Mercafácil, um marketplace de supermercados em Roraima (Boa Vista e interior). 
        Seu nome é 'Mercabot'. Ajude com:
        1. Recomendação de produtos regionais (café, farinha, peixes).
        2. Dicas de receitas.
        3. Status de entrega (simulado).
        Seja amigável, use emojis, e fale português do Brasil.
        Não invente dados sensíveis.`,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text || "Desculpe, não entendi.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Estou tendo dificuldades para conectar ao servidor no momento.";
  }
};

export const analyzeProductImage = async (base64Image: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: "Analise esta imagem. É um produto de supermercado? Descreva-o brevemente e sugira uma categoria e um preço estimado em Reais (R$). Formate como JSON: { description: string, category: string, estimatedPrice: number }"
          }
        ]
      },
      config: {
        responseMimeType: 'application/json'
      }
    });
    return response.text || "{}";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw error;
  }
};

export const generateMarketingCaption = async (productName: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Crie uma legenda curta, vendedora e emocionante para o Instagram vendendo: ${productName}. Use emojis. Foco em urgência e qualidade.`,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini Text Error:", error);
    return "Oferta imperdível no Mercafácil! Aproveite agora.";
  }
};

export const generateRecipeFromIngredients = async (ingredients: string[]): Promise<string> => {
  try {
    const ai = getAIClient();
    const prompt = `Atue como um Chef de Cozinha criativo.
    Eu tenho os seguintes ingredientes no meu carrinho do Mercafácil: ${ingredients.join(', ')}.
    
    Crie uma receita deliciosa usando a maioria desses ingredientes. Você pode assumir que eu tenho itens básicos em casa (sal, óleo, água, temperos comuns).
    
    A resposta deve ter:
    1. Nome Criativo da Receita (com emoji)
    2. Lista de Ingredientes
    3. Modo de Preparo simples
    4. Uma dica do Chef.
    
    Formate a saída em Markdown limpo.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Não consegui criar uma receita com esses itens.";
  } catch (error) {
    console.error("Gemini Recipe Error:", error);
    return "Desculpe, o Chef IA está ocupado agora. Tente novamente mais tarde.";
  }
};
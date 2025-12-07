
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

// Initialize AI Client
// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    // We throw to ensure the UI handles the error or the developer sees it immediately.
    // In a real app, this might trigger a graceful UI degradation.
    throw new Error("API Key is missing. Ensure process.env.API_KEY is configured.");
  }
  return new GoogleGenAI({ apiKey });
};

// Define a simplified type for history that matches the SDK's Content expectation
type ChatHistory = { role: 'user' | 'model'; parts: { text: string }[] }[];

export const chatWithAssistant = async (
  message: string,
  history: ChatHistory
): Promise<string> => {
  try {
    const ai = getAIClient();
    
    // Using ai.chats.create to establish session context with history
    const chat: Chat = ai.chats.create({
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
      history: history
    });

    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "Desculpe, não entendi.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Estou tendo dificuldades para conectar ao servidor no momento.";
  }
};

export const analyzeProductImage = async (base64Image: string, mimeType: string = 'image/jpeg'): Promise<string> => {
  try {
    const ai = getAIClient();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
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
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Crie uma legenda curta, vendedora e emocionante para o Instagram vendendo: ${productName}. Use emojis. Foco em urgência e qualidade.`,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini Text Error:", error);
    return "Oferta imperdível no Mercafácil! Aproveite agora.";
  }
};

// Veo Generation Stub (Client-side simulation of the API call structure)
export const generateMarketingVideo = async (prompt: string): Promise<string> => {
    console.log("Generating video with prompt:", prompt);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            // Returning a sample placeholder video URL
            resolve("https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4");
        }, 3000);
    });
    
    /* 
    // Actual implementation structure would be:
    const ai = getAIClient();
    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '9:16' }
    });
    // ... polling logic ...
    */
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

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Não consegui criar uma receita com esses itens.";
  } catch (error) {
    console.error("Gemini Recipe Error:", error);
    return "Desculpe, o Chef IA está ocupado agora. Tente novamente mais tarde.";
  }
};

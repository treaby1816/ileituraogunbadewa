import { GoogleGenerativeAI } from "@google/generative-ai";
import { ADUN_SYSTEM_PROMPT } from "@/lib/chatbot-prompt";

export const getChatModel = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY environment variable");
  }
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  return genAI.getGenerativeModel({
    model: "models/gemini-flash-latest",
    systemInstruction: ADUN_SYSTEM_PROMPT,
    generationConfig: {
      maxOutputTokens: 300,
      temperature: 0.75,
      topP: 0.9,
    },
  });
};


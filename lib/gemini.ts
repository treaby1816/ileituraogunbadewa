import { GoogleGenerativeAI } from "@google/generative-ai";

export const getChatModel = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY environment variable");
  }
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    generationConfig: {
      maxOutputTokens: 600,
      temperature: 0.75,
      topP: 0.9,
    },
  });
};


import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getChatModel = () =>
  genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      maxOutputTokens: 600,
      temperature: 0.75,
      topP: 0.9,
    },
  });

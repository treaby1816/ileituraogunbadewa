import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { getChatModel } from "@/lib/gemini";
import { chatRateLimit } from "@/lib/rate-limit";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    // Rate Limiting (Bypass if Upstash is not configured)
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
      const { success, limit, remaining, reset } = await chatRateLimit.limit(ip);

      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please wait a moment." },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          }
        );
      }
    }

    // Process history to ensure alternating roles and valid content
    const history: any[] = [];
    let lastRole: string | null = null;

    for (const m of messages.slice(0, -1)) {
      if (m.id === "welcome") continue;
      
      const role = m.role === "user" ? "user" : "model";
      
      // Gemini API requires the first message in history to be from the user.
      // Skip any leading model messages.
      if (history.length === 0 && role === "model") {
        continue;
      }

      // Ensure we don't have consecutive same roles which Gemini rejects
      if (role !== lastRole) {
        history.push({
          role,
          parts: [{ text: m.content || "..." }],
        });
        lastRole = role;
      }
    }

    const lastMessage = messages[messages.length - 1].content;

    const chatModel = getChatModel();
    
    // Add safety settings to prevent over-eager filtering
    const chat = chatModel.startChat({
      history: history,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ]
    });

    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const responseText = response.text();

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    Sentry.captureException(error);
    
    // Return more descriptive error for "ADUN ERROR" investigation
    const errorMessage = error.message || "Unknown error";
    return NextResponse.json(
      { error: `Àdùn Error: ${errorMessage}. Please contact us on WhatsApp.` },
      { status: 500 }
    );
  }
}

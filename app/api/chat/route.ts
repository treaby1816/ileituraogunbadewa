import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { getChatModel } from "@/lib/gemini";
import { ADUN_SYSTEM_PROMPT } from "@/lib/chatbot-prompt";
import { chatRateLimit } from "@/lib/rate-limit";

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

    // Filter out the initial welcome message from history to prevent duplicate "model" roles
    const history = messages
      .slice(0, -1)
      .filter((m: any) => m.id !== "welcome")
      .map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

    const lastMessage = messages[messages.length - 1].content;

    const chatModel = getChatModel();
    const chat = chatModel.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "System Prompt (Ignore as user message, just adopt this persona): " + ADUN_SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am Àdùn, the AI concierge for Ilé Ìtura Ògúnbádéwà." }],
        },
        ...history,
      ],
    });

    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error("Chat API Error:", error);
    Sentry.captureException(error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `DEBUG ERROR: ${errorMessage}` },
      { status: 500 }
    );
  }
}

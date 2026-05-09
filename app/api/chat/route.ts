import { NextResponse } from "next/server";
import { getChatModel } from "@/lib/gemini";
import { ADUN_SYSTEM_PROMPT } from "@/lib/chatbot-prompt";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
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
    return NextResponse.json(
      { error: "Sorry, I am currently experiencing technical difficulties. Please contact us on WhatsApp." },
      { status: 500 }
    );
  }
}

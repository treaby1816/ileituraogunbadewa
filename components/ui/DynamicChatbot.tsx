"use client";

import dynamic from "next/dynamic";

const Chatbot = dynamic(() => import("@/components/ui/Chatbot").then((mod) => mod.Chatbot), { ssr: false });

export default function DynamicChatbot() {
  return <Chatbot />;
}

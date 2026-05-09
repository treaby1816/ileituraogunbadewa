"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

type Message = { id: string; role: "user" | "assistant"; content: string; timestamp: string };

const QUICK_REPLIES = [
  "What are your room rates?",
  "Where are you located?",
  "Do you have a bar/lounge?",
  "How do I book a room?",
  "Do you have an event hall?",
  "Is there parking space?",
];

const parseText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-gold-primary">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

function TypewriterEffect({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return <p className="text-[14px] leading-relaxed break-words">{parseText(displayed)}</p>;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Ẹ káàbọ̀! Welcome to Ilé Ìtura Ògúnbádéwà. I am Àdùn, your personal concierge. How can I make your stay comfortable today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Hide on dashboard
  if (pathname?.startsWith("/dashboard")) return null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const apiMessages = [...messages, userMsg].map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await res.json();
      
      if (data.response) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: data.response, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      } else {
        throw new Error(data.error);
      }
    } catch {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: "I'm having a little trouble connecting right now. Please reach out to us on WhatsApp instead!", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-forest-dark border-2 border-gold-primary text-2xl flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] transition-shadow cursor-pointer"
            aria-label="Open Chat"
          >
            🛎️
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 w-[350px] max-w-[calc(100vw-48px)] h-[550px] max-h-[calc(100svh-48px)] bg-forest-black border border-gold-primary/30 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-forest-dark to-forest border-b border-gold-primary/20 p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gold-primary/20 border border-gold-primary/50 flex items-center justify-center text-xl">👩🏾‍💼</div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-forest-dark" />
                </div>
                <div>
                  <h3 className="font-playfair text-cream font-semibold text-[15px]">Àdùn</h3>
                  <p className="text-gold-primary/70 text-[11px] font-cinzel tracking-widest uppercase">Digital Concierge</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-cream/50 hover:text-gold-primary p-2 cursor-pointer transition-colors">✕</button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-linear-to-b from-forest-black to-forest-dark scrollbar-hide">
              {messages.map((m, i) => {
                const isBot = m.role === "assistant";
                return (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${isBot ? "items-start" : "items-end"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${isBot ? "bg-white/5 border border-gold-primary/15 rounded-tl-sm text-cream/90" : "bg-gold-primary text-forest-black rounded-tr-sm"}`}>
                      {isBot && i === messages.length - 1 ? <TypewriterEffect text={m.content} /> : <p className="text-[14px] leading-relaxed break-words">{isBot ? parseText(m.content) : m.content}</p>}
                    </div>
                    <span className="text-cream/30 text-[10px] mt-1 px-1">{m.timestamp}</span>
                  </motion.div>
                );
              })}
              {isLoading && (
                <div className="flex items-start">
                  <div className="bg-white/5 border border-gold-primary/15 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-gold-primary/60 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gold-primary/60 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gold-primary/60 rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && !isLoading && (
              <div className="px-3 pb-2 pt-1 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
                {QUICK_REPLIES.map((qr) => (
                  <button key={qr} onClick={() => sendMessage(qr)} className="shrink-0 bg-forest/80 hover:bg-gold-primary/10 border border-gold-primary/20 hover:border-gold-primary/50 text-gold-primary/80 text-[11px] px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap">
                    {qr}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="p-3 bg-forest-dark border-t border-gold-primary/20 shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Àdùn anything..."
                  className="w-full bg-white/5 border border-gold-primary/20 focus:border-gold-primary/60 rounded-full pl-4 pr-12 py-3 text-[13px] text-cream outline-none transition-colors"
                />
                <button type="submit" disabled={!input.trim() || isLoading} className="absolute right-1.5 top-1.5 bottom-1.5 w-9 bg-gold-primary text-forest-black rounded-full flex items-center justify-center disabled:opacity-50 transition-opacity cursor-pointer">
                  ↑
                </button>
              </div>
              <div className="mt-2 text-center">
                <a href="https://wa.me/2348129041015" target="_blank" rel="noreferrer" className="text-[10px] text-green-400/80 hover:text-green-400 transition-colors">
                  Prefer human help? Chat on WhatsApp
                </a>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

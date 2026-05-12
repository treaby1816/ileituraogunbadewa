"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function DashboardLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
        setLoading(false);
      }
    } catch {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-black flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-forest-dark border border-gold-primary/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gold-primary/10 blur-3xl rounded-full" />
        
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-[0_0_16px_rgba(201,168,76,0.35)] mb-4">
            <Image src="/images/logo.png" alt="Logo" width={64} height={64} className="object-cover" />
          </div>
          <h1 className="font-playfair text-2xl text-cream mb-1">Admin Portal</h1>
          <p className="font-cinzel text-[10px] tracking-widest text-gold-primary uppercase">Ilé Ìtura Ògúnbádéwà</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div>
            <input 
              type="password" 
              placeholder="Enter Admin Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-forest-black border border-gold-primary/20 rounded-xl px-4 py-3 text-cream text-[14px] outline-none focus:border-gold-primary/60 transition-colors placeholder:text-cream-faint text-center tracking-widest"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full justify-center py-3"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Login to Dashboard"}
          </Button>
        </form>

        <div className="mt-8 relative z-10 flex justify-center">
          <button 
            onClick={() => router.push('/')}
            className="text-cream-faint hover:text-gold-primary text-xs tracking-wider uppercase flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            Return to Website
          </button>
        </div>
      </motion.div>
    </div>
  );
}

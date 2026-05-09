"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

const INQUIRY_TYPES = ["General Inquiry", "Room Booking", "Event Hall Hire", "Complaint", "Partnership", "Other"];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", inquiry_type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.inquiry_type || !form.message) return;
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setIsSuccess(true);
        toast.success("Message sent successfully! We will get back to you shortly.");
        setForm({ name: "", phone: "", email: "", inquiry_type: "", message: "" });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-gold-primary/20 rounded-xl px-4 py-3 text-cream text-[13px] outline-none focus:border-gold-primary/60 transition-colors placeholder:text-cream-faint";

  return (
    <main className="pt-24">
      <section className="py-16 px-4 md:px-8 text-center bg-linear-to-b from-forest-dark to-forest-black">
        <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold-primary uppercase">Get In Touch</span>
        <h1 className="font-playfair text-4xl md:text-5xl text-cream mt-3 mb-4">Contact Us</h1>
        <p className="text-cream-muted max-w-xl mx-auto">We&apos;d love to hear from you. Reach out anytime.</p>
      </section>

      <section className="py-16 px-4 md:px-8 bg-forest-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Map */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-2xl overflow-hidden border border-gold-primary/15 shadow-lg">
              <iframe
                title="Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63423.81308!2d3.5027!3d6.6018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf5f0b9af2ec9%3A0x3d0d4e5d5c5e5c5d!2sIkorodu%2C%20Lagos!5e0!3m2!1sen!2sng!4v1620000000000"
                width="100%" height="300" style={{ border: 0, display: "block" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: "📍", label: "Address", value: "Saheed Anibaba Street, Off Awolowo Way, Ikorodu, Lagos" },
                { icon: "📞", label: "Phone", value: "08129041015 / 08060721283" },
                { icon: "💬", label: "WhatsApp", value: "+234 812 904 1015" },
              ].map((c) => (
                <div key={c.label} className="p-5 rounded-xl border border-gold-primary/20 bg-forest/40 backdrop-blur-sm hover:-translate-y-1 hover:border-gold-primary/40 hover:shadow-[0_12px_30px_rgba(201,168,76,0.08)] transition-all duration-300">
                  <div className="text-xl mb-2">{c.icon}</div>
                  <p className="font-cinzel text-[9px] tracking-widest text-gold-primary font-bold uppercase mb-1">{c.label}</p>
                  <p className="text-cream-muted text-[12px] leading-relaxed">{c.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="p-7 rounded-2xl border border-gold-primary/15 bg-linear-to-br from-forest/60 to-forest-dark hover:border-gold-primary/25 transition-all duration-300">
              <h3 className="font-playfair text-xl text-cream mb-6">Send a Message</h3>

              {isSuccess ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                  <div className="text-4xl mb-4">✅</div>
                  <h4 className="font-playfair text-xl text-cream mb-2">Message Sent!</h4>
                  <p className="text-cream-muted text-[13px] mb-6">We&apos;ll get back to you shortly.</p>
                  <Button variant="ghost" size="sm" onClick={() => setIsSuccess(false)}>Send Another</Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input className={inputClass} placeholder="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  <input className={inputClass} placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <input className={inputClass} type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <select className={inputClass} value={form.inquiry_type} onChange={(e) => setForm({ ...form, inquiry_type: e.target.value })} required>
                    <option value="" style={{ background: "#0D1A0D" }}>Select Inquiry Type *</option>
                    {INQUIRY_TYPES.map((t) => (
                      <option key={t} value={t} style={{ background: "#0D1A0D" }}>{t}</option>
                    ))}
                  </select>
                  <textarea className={`${inputClass} min-h-[120px] resize-none`} placeholder="Your Message *" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />

                  <Button type="submit" variant="primary" className="w-full justify-center" disabled={isLoading}>
                    {isLoading ? "Sending…" : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

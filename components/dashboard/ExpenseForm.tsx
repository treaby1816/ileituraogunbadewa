"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

const CATEGORIES = [
  "Maintenance",
  "Utilities",
  "Salaries",
  "Supplies",
  "Marketing",
  "Laundry",
  "Others"
];

export function ExpenseForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "Maintenance",
    date: new Date().toISOString().split("T")[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount)
        }),
      });

      if (res.ok) {
        toast.success("Expense recorded successfully");
        setForm({
          description: "",
          amount: "",
          category: "Maintenance",
          date: new Date().toISOString().split("T")[0]
        });
        router.refresh();
      } else {
        toast.error("Failed to record expense");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-gold-primary/10 rounded-xl px-4 py-3 text-cream text-[13px] outline-none focus:border-gold-primary/40 transition-colors placeholder:text-cream-faint";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[11px] text-cream-faint uppercase tracking-wider mb-2">Description</label>
        <input 
          className={inputClass} 
          placeholder="e.g., Generator Diesel" 
          value={form.description} 
          onChange={(e) => setForm({ ...form, description: e.target.value })} 
          required 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] text-cream-faint uppercase tracking-wider mb-2">Amount (₦)</label>
          <input 
            type="number" 
            className={inputClass} 
            placeholder="0.00" 
            value={form.amount} 
            onChange={(e) => setForm({ ...form, amount: e.target.value })} 
            required 
          />
        </div>
        <div>
          <label className="block text-[11px] text-cream-faint uppercase tracking-wider mb-2">Category</label>
          <select 
            className={inputClass} 
            value={form.category} 
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c} style={{ background: "#0D1A0D" }}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[11px] text-cream-faint uppercase tracking-wider mb-2">Date</label>
        <input 
          type="date" 
          className={inputClass} 
          value={form.date} 
          onChange={(e) => setForm({ ...form, date: e.target.value })} 
          required 
        />
      </div>

      <Button type="submit" variant="primary" className="w-full justify-center mt-2" disabled={loading}>
        {loading ? "Recording..." : "Record Expense ✓"}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { formatNaira } from "@/lib/utils";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ExpenseListProps {
  initialExpenses: any[];
}

export function ExpenseList({ initialExpenses }: ExpenseListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense record?")) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Record deleted");
        router.refresh();
      } else {
        toast.error("Failed to delete record");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setDeletingId(null);
    }
  };

  if (initialExpenses.length === 0) {
    return (
      <div className="p-12 text-center text-cream-faint text-[13px]">
        No expense records found. Use the form to add one.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[13px] text-cream-muted">
        <thead className="bg-white/5 text-gold-primary font-cinzel text-[10px] tracking-widest uppercase">
          <tr>
            <th className="px-6 py-4 font-medium">Date</th>
            <th className="px-6 py-4 font-medium">Description</th>
            <th className="px-6 py-4 font-medium">Category</th>
            <th className="px-6 py-4 font-medium text-right">Amount</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {initialExpenses.map((e) => (
            <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">{new Date(e.date).toLocaleDateString()}</td>
              <td className="px-6 py-4 font-medium text-cream">{e.description}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-gold-primary/10 text-[11px]">
                  {e.category}
                </span>
              </td>
              <td className="px-6 py-4 text-right font-semibold text-gold-primary">
                {formatNaira(e.amount)}
              </td>
              <td className="px-6 py-4 text-right">
                <button 
                  onClick={() => handleDelete(e.id)}
                  disabled={deletingId === e.id}
                  className="p-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {deletingId === e.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

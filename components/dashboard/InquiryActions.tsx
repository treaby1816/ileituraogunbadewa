"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";

interface InquiryActionsProps {
  inquiryId: string;
}

export function InquiryActions({ inquiryId }: InquiryActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/inquiries?id=${inquiryId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Inquiry deleted");
        router.refresh();
      } else {
        toast.error("Failed to delete inquiry");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 rounded-lg text-cream-faint hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer disabled:opacity-50"
      title="Delete Inquiry"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </button>
  );
}

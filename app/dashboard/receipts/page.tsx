"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { createBrowserClient } from "@/lib/supabase-browser";
import { formatNaira } from "@/lib/utils";
import { useReactToPrint } from "react-to-print";
import { RoomReceipt } from "@/components/dashboard/RoomReceipt";
import { HallReceipt } from "@/components/dashboard/HallReceipt";

export default function ReceiptsArchivePage() {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const supabase = createBrowserClient();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("receipts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      
      if (error) throw error;
      setReceipts(data ?? []);
    } catch (err: any) {
      toast.error("Failed to fetch receipts list");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Reprint-${selectedReceipt?.receipt_number || 'Receipt'}`,
    pageStyle: `
      @page { size: A5 portrait; margin: 10mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
    onAfterPrint: () => setSelectedReceipt(null),
  });

  // Trigger print when a receipt is selected
  useEffect(() => {
    if (selectedReceipt) {
      setTimeout(() => handlePrint(), 100);
    }
  }, [selectedReceipt, handlePrint]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this receipt record? This action cannot be undone.")) return;
    
    try {
      const { error } = await supabase.from("receipts").delete().eq("id", id);
      if (error) throw error;
      
      setReceipts(receipts.filter(r => r.id !== id));
      toast.success("Receipt record deleted successfully");
    } catch (err: any) {
      toast.error("Failed to delete receipt");
      console.error(err);
    }
  };

  const exportCSV = () => {
    const headers = ["Receipt No", "Type", "Guest/Client", "Booking Ref", "Amount", "Payment Method", "Date Issued", "Issued By"];
    const csvContent = [
      headers.join(","),
      ...filteredReceipts.map(r => [
        r.receipt_number,
        r.receipt_type,
        `"${r.guest_name}"`,
        r.booking_ref,
        r.amount,
        r.payment_method,
        new Date(r.created_at).toLocaleString(),
        `"${r.issued_by}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `receipts_export_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats calculation
  const todayReceipts = receipts.filter(r => r.created_at.startsWith(today));
  const totalCollectedToday = todayReceipts.reduce((sum, r) => sum + Number(r.amount), 0);
  const cashToday = todayReceipts.filter(r => r.payment_method === 'cash').reduce((sum, r) => sum + Number(r.amount), 0);
  const transferToday = todayReceipts.filter(r => r.payment_method === 'transfer').reduce((sum, r) => sum + Number(r.amount), 0);
  const posToday = todayReceipts.filter(r => r.payment_method === 'pos').reduce((sum, r) => sum + Number(r.amount), 0);

  const filteredReceipts = receipts.filter(r => {
    if (filterType !== "all" && r.receipt_type !== filterType) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return r.guest_name.toLowerCase().includes(term) || 
             r.receipt_number.toLowerCase().includes(term) ||
             r.booking_ref?.toLowerCase().includes(term);
    }
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Hidden container for printing */}
      <div className="hidden">
        {selectedReceipt && (
           selectedReceipt.receipt_type === 'room_booking' 
            ? <RoomReceipt ref={receiptRef} booking={selectedReceipt.receipt_data} />
            : <HallReceipt ref={receiptRef} booking={selectedReceipt.receipt_data} />
        )}
      </div>

      <div className="flex justify-between items-end">
        <div>
           <p className="font-cinzel text-[10px] tracking-[0.2em] text-gold-primary uppercase">
            Front Desk Administration
          </p>
          <h1 className="font-playfair text-3xl text-cream mt-1">Receipts Archive</h1>
        </div>
        <button onClick={exportCSV} className="px-4 py-2 border border-gold-primary/30 rounded-xl text-cream text-sm hover:bg-gold-primary/10 transition-colors">
          Download CSV
        </button>
      </div>

      {/* Stats Header */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Issued Today", value: todayReceipts.length, color: "text-cream" },
          { label: "Total Collected", value: formatNaira(totalCollectedToday), color: "text-gold-primary" },
          { label: "Cash (Today)", value: formatNaira(cashToday), color: "text-green-400" },
          { label: "Transfer (Today)", value: formatNaira(transferToday), color: "text-blue-400" },
          { label: "POS (Today)", value: formatNaira(posToday), color: "text-amber-400" },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-2xl bg-forest/40 border border-gold-primary/20">
            <p className="text-cream/50 text-[10px] uppercase tracking-wider mb-1">{stat.label}</p>
            <p className={`font-bold text-lg ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <input 
          type="text" 
          placeholder="Search name, receipt or booking ref..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-forest/40 border border-gold-primary/20 rounded-xl px-4 py-2.5 text-sm text-cream outline-none focus:border-gold-primary/60"
        />
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="w-48 bg-forest/40 border border-gold-primary/20 rounded-xl px-4 py-2.5 text-sm text-cream outline-none focus:border-gold-primary/60"
        >
          <option value="all" style={{ background:"#0D1A0D" }}>All Receipts</option>
          <option value="room_booking" style={{ background:"#0D1A0D" }}>Room Bookings</option>
          <option value="hall_booking" style={{ background:"#0D1A0D" }}>Hall Bookings</option>
        </select>
      </div>

      {/* Receipts Table */}
      <div className="bg-forest/40 border border-gold-primary/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-forest-dark border-b border-gold-primary/20">
              <tr>
                <th className="px-4 py-3 text-cream/60 font-medium">Receipt No</th>
                <th className="px-4 py-3 text-cream/60 font-medium">Type</th>
                <th className="px-4 py-3 text-cream/60 font-medium">Guest / Client</th>
                <th className="px-4 py-3 text-cream/60 font-medium">Ref</th>
                <th className="px-4 py-3 text-cream/60 font-medium text-right">Amount</th>
                <th className="px-4 py-3 text-cream/60 font-medium">Paid By</th>
                <th className="px-4 py-3 text-cream/60 font-medium">Date</th>
                <th className="px-4 py-3 text-cream/60 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/10">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-cream/40">Loading receipts...</td>
                </tr>
              ) : filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-cream/40">No receipts found</td>
                </tr>
              ) : (
                filteredReceipts.map(r => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-3 text-gold-primary font-mono text-xs">{r.receipt_number}</td>
                    <td className="px-4 py-3 text-cream/80 capitalize">{r.receipt_type.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-cream font-medium">{r.guest_name}</td>
                    <td className="px-4 py-3 text-cream/60 text-xs">{r.booking_ref}</td>
                    <td className="px-4 py-3 text-right font-bold text-green-400">{formatNaira(r.amount)}</td>
                    <td className="px-4 py-3 text-cream/60 uppercase text-[10px] tracking-wide">{r.payment_method}</td>
                    <td className="px-4 py-3 text-cream/60 text-xs">{new Date(r.created_at).toLocaleString('en-NG')}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedReceipt(r)}
                          className="px-2 py-1 text-xs bg-gold-primary/20 text-gold-primary rounded hover:bg-gold-primary/40 transition-colors"
                        >
                          🖨️ Reprint
                        </button>
                        <button 
                          onClick={() => handleDelete(r.id)}
                          className="px-2 py-1 text-xs bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

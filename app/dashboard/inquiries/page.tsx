import { createServiceClient } from "@/lib/supabase-server";
import { InquiryActions } from "@/components/dashboard/InquiryActions";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  let inquiries: any[] = [];
  try {
    const supabase = await createServiceClient();
    const { data } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) inquiries = data;
  } catch (error) {
    console.error("Inquiries fetch error:", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl text-cream mb-1">Inquiries</h1>
        <p className="text-cream-muted text-[14px]">Manage messages and customer requests.</p>
      </div>

      <div className="bg-forest-dark border border-gold-primary/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-cream-muted">
            <thead className="bg-white/5 text-gold-primary font-cinzel text-[11px] font-bold tracking-[0.1em] uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Message</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {inquiries?.map((inq) => (
                <tr key={inq.id} className="hover:bg-white/[0.02] transition-colors align-top">
                  <td className="px-6 py-4 whitespace-nowrap text-[12px]">{new Date(inq.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <p className="text-cream">{inq.name}</p>
                    <p className="text-[11px] text-cream-faint">{inq.phone}</p>
                    {inq.email && <p className="text-[11px] text-cream-faint">{inq.email}</p>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-gold-primary/10 text-gold-primary border border-gold-primary/20 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider">
                      {inq.inquiry_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 min-w-[300px]">
                    <p className="text-[13px] leading-relaxed">{inq.message}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <InquiryActions inquiryId={inq.id} />
                  </td>
                </tr>
              ))}
              {!inquiries?.length && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-cream-faint">
                    No inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

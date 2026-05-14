import { createServiceClient } from "@/lib/supabase-server";
import { ExpenseForm } from "@/components/dashboard/ExpenseForm";
import { ExpenseList } from "@/components/dashboard/ExpenseList";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  let expenses: any[] = [];
  try {
    const supabase = await createServiceClient();
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false });
    if (data) expenses = data;
  } catch (error) {
    console.error("Expenses fetch error:", error);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl text-cream mb-1">Expenses Tracking</h1>
          <p className="text-cream-muted text-[14px]">Record and monitor daily operational costs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-forest-dark border border-gold-primary/10 rounded-2xl p-6 sticky top-24">
            <h2 className="font-cinzel text-xs tracking-widest text-gold-primary uppercase mb-6">Record New Expense</h2>
            <ExpenseForm />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-forest-dark border border-gold-primary/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gold-primary/5 flex items-center justify-between">
              <h2 className="font-cinzel text-xs tracking-widest text-gold-primary uppercase">Recent Expenses</h2>
              <span className="text-[11px] text-cream-faint">{expenses.length} records found</span>
            </div>
            <ExpenseList initialExpenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
}

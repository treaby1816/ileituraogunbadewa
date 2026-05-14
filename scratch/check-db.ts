import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function checkTable() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("expenses")
    .select("id")
    .limit(1);

  if (error) {
    console.error("Error checking expenses table:", error.message);
  } else {
    console.log("Expenses table exists.");
  }
}

checkTable();

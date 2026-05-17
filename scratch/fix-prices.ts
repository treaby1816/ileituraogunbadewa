import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPrices() {
  console.log("Updating room prices...");
  
  const { error: err1 } = await supabase.from('rooms').update({ price: 15000 }).eq('type', 'standard');
  if (err1) console.error("Error updating standard:", err1);
  
  const { error: err2 } = await supabase.from('rooms').update({ price: 22000 }).eq('type', 'deluxe');
  if (err2) console.error("Error updating deluxe:", err2);
  
  const { error: err3 } = await supabase.from('rooms').update({ price: 35000 }).eq('type', 'suite');
  if (err3) console.error("Error updating suite:", err3);
  
  const { data, error } = await supabase.from('rooms').select('name, type, price');
  console.log("Current rooms:", data);
}

fixPrices();

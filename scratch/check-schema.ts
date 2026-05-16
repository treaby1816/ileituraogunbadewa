import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
  // Check bookings table columns
  const { data: cols, error } = await supabase
    .rpc('get_table_columns', { table_name_param: 'bookings' })
  
  if (error) {
    console.log("RPC not available, trying direct insert test...")
    
    // Try a dry-run insert to see exactly what error we get
    const { data, error: insertErr } = await supabase
      .from("bookings")
      .insert({
        room_id:        "00000000-0000-0000-0000-000000000001",
        guest_name:     "TEST_DELETE_ME",
        guest_phone:    "08000000000",
        check_in:       "2026-01-01",
        check_out:      "2026-01-02",
        num_guests:     1,
        status:         "confirmed",
        payment_status: "fully_paid",
        amount_paid:    0,
        payment_method: "cash",
        booking_source: "walk_in",
        booked_by:      "test",
        notes:          "",
      })
      .select("*")
      .single()

    if (insertErr) {
      console.error("INSERT ERROR:", JSON.stringify(insertErr, null, 2))
    } else {
      console.log("INSERT OK (deleting test row):", data)
      // Cleanup
      if (data?.id) {
        await supabase.from("bookings").delete().eq("id", data.id)
      }
    }
  } else {
    console.log("COLUMNS:", cols)
  }

  // Also check rooms
  const { data: rooms, error: roomsErr } = await supabase.from("rooms").select("*").limit(3)
  console.log("\nROOMS (first 3):", rooms, roomsErr ? `ERROR: ${roomsErr.message}` : "")

  // Check if RLS is the issue on bookings
  const { data: bdata, error: berr } = await supabase.from("bookings").select("*").limit(1)
  console.log("\nBOOKINGS SELECT TEST:", bdata, berr ? `ERROR: ${berr.message}` : "")
}

checkSchema()

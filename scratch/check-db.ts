import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
  const payload = {
    hall_name: "Main Hall",
    client_name: "Test Client",
    client_phone: "08012345678",
    client_email: null,
    event_type: "wedding",
    event_date: "2026-06-01",
    event_start_time: "10:00",
    event_end_time: "14:00",
    expected_guests: 100,
    setup_required: false,
    setup_notes: "",
    total_amount: 500000,
    amount_paid: 100000,
    payment_method: "cash",
    booked_by: "Admin",
    special_requests: "",
    payment_status: "deposit_paid",
    status: "confirmed"
  }

  const { data, error } = await supabase.from('hall_bookings').insert(payload).select('booking_ref').single()
  
  if (error) {
    console.error("SUPABASE ERROR:", error)
  } else {
    console.log("SUCCESS:", data)
  }
}

testInsert()

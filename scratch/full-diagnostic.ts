import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const anon = createClient(supabaseUrl, supabaseAnonKey)

async function fullDiagnostic() {
  console.log("=== FULL BOOKING DIAGNOSTIC ===\n")

  // 1. Check rooms via anon key
  console.log("--- 1. ROOMS CHECK (ANON) ---")
  const { data: rooms, error: roomErr } = await anon.from("rooms").select("id, name, type, price").limit(3)
  if (roomErr) {
    console.log("  ❌ ROOMS ERROR:", roomErr.message, roomErr.code)
  } else {
    console.log("  ✅ Rooms found:", rooms?.length)
    if (rooms?.[0]) console.log("  Sample:", rooms[0])
  }

  const testRoomId = rooms?.[0]?.id || "00000000-0000-0000-0000-000000000001"

  // 2. Test booking insert via anon key (exact same as browser)
  console.log("\n--- 2. BOOKING INSERT TEST (ANON - same as browser) ---")
  const payload = {
    booking_ref:    "DIAG-" + Date.now(),
    receipt_number: "RCT-DIAG" + Date.now(),
    room_id:        testRoomId,
    guest_name:     "DIAG_TEST",
    guest_phone:    "08012345678",
    check_in:       "2026-12-25",
    check_out:      "2026-12-26",
    num_guests:     1,
    status:         "confirmed",
    payment_status: "fully_paid",
    amount_paid:    25000,
    payment_method: "cash",
    booking_source: "walk_in",
    booked_by:      "System",
    notes:          "",
  }
  console.log("  Payload keys:", Object.keys(payload).join(", "))

  const { data: result, error: insertErr } = await anon
    .from("bookings")
    .insert(payload)
    .select("*")
    .single()

  if (insertErr) {
    console.log("  ❌ INSERT FAILED:")
    console.log("    code:", insertErr.code)
    console.log("    message:", insertErr.message)
    console.log("    details:", insertErr.details)
    console.log("    hint:", insertErr.hint)
  } else {
    console.log("  ✅ INSERT OK! booking_ref:", result?.booking_ref)
    // Cleanup
    await anon.from("bookings").delete().eq("id", result?.id)
    console.log("  (Cleaned up test row)")
  }

  // 3. Test receipt insert
  console.log("\n--- 3. RECEIPT INSERT TEST ---")
  const { error: rcptErr } = await anon.from("receipts").insert({
    receipt_number: "RCT-TEST-" + Date.now(),
    receipt_type:   "room_booking",
    booking_ref:    "DIAG-" + Date.now(),
    guest_name:     "DIAG_TEST",
    amount:         25000,
    payment_method: "cash",
    issued_by:      "System",
    receipt_data:   { test: true },
  })
  if (rcptErr) {
    console.log("  ❌ RECEIPT ERROR:", rcptErr.code, rcptErr.message)
  } else {
    console.log("  ✅ RECEIPT INSERT OK")
  }

  // 4. Test transaction insert
  console.log("\n--- 4. TRANSACTION INSERT TEST ---")
  const { error: txErr } = await anon.from("transactions").insert({
    type:             "income",
    category:         "room_booking",
    description:      "DIAG TEST",
    amount:           25000,
    booking_ref:      "DIAG-" + Date.now(),
    recorded_by:      "System",
    transaction_date: "2026-05-17",
  })
  if (txErr) {
    console.log("  ❌ TRANSACTION ERROR:", txErr.code, txErr.message)
  } else {
    console.log("  ✅ TRANSACTION INSERT OK")
  }

  // 5. Test hall_bookings insert
  console.log("\n--- 5. HALL BOOKING INSERT TEST ---")
  const { data: hallResult, error: hallErr } = await anon.from("hall_bookings").insert({
    booking_ref:      "HDIAG-" + Date.now(),
    receipt_number:   "HRCT-" + Date.now(),
    hall_name:        "Main Hall",
    client_name:      "DIAG_HALL_TEST",
    client_phone:     "08012345678",
    event_type:       "wedding",
    event_date:       "2026-12-25",
    event_start_time: "10:00",
    event_end_time:   "18:00",
    expected_guests:  100,
    setup_required:   false,
    total_amount:     500000,
    amount_paid:      250000,
    payment_method:   "cash",
    payment_status:   "deposit_paid",
    status:           "confirmed",
    booked_by:        "System",
  }).select("*").single()

  if (hallErr) {
    console.log("  ❌ HALL ERROR:", hallErr.code, hallErr.message, hallErr.details)
  } else {
    console.log("  ✅ HALL INSERT OK! ref:", hallResult?.booking_ref)
    await anon.from("hall_bookings").delete().eq("id", hallResult?.id)
  }

  console.log("\n=== DIAGNOSTIC COMPLETE ===")
}

fullDiagnostic()

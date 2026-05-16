import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log("Seeding rooms into:", supabaseUrl)
  
  // Clear first
  await supabase.from('rooms').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const roomsToInsert = [
    { name: 'Room 101', type: 'standard', price: 25000, max_guests: 2, available: true },
    { name: 'Room 102', type: 'standard', price: 25000, max_guests: 2, available: true },
    { name: 'Room 103', type: 'standard', price: 25000, max_guests: 2, available: true },
    { name: 'Room 201 (Deluxe)', type: 'deluxe', price: 35000, max_guests: 2, available: true },
    { name: 'Room 202 (Deluxe)', type: 'deluxe', price: 35000, max_guests: 2, available: true },
    { name: 'Suite 301 (Royal)', type: 'suite', price: 55000, max_guests: 4, available: true },
    { name: 'Suite 302 (Executive)', type: 'suite', price: 55000, max_guests: 4, available: true }
  ]

  const { data, error } = await supabase.from('rooms').insert(roomsToInsert).select('*')
  
  if (error) {
    console.error("SEED ERROR:", error)
  } else {
    console.log("SUCCESSFULLY SEEDED ROOMS:", data)
  }
}

seed()

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkRooms() {
  const { data, error } = await supabase.from('rooms').select('*')
  if (error) {
    console.error("ERROR:", error)
  } else {
    console.log("ROOMS IN DB:", data)
  }
}

checkRooms()

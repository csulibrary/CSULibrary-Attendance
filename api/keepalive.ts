import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Simple query just to create activity
  await supabase.from('announcements').select('*').limit(1)

  res.status(200).json({ message: 'Supabase is awake 👋' })
}
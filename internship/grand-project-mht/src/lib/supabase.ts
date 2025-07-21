import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for Supabase
export type User = {
  id: string
  email: string
  created_at: string
}

export type Session = {
  user: User
  access_token: string
  refresh_token: string
} 
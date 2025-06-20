// lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// This safety check ensures the variables are loaded before creating the client.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or anonymous key is not defined in your environment variables.")
}

// This is your public client for use in frontend components.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)


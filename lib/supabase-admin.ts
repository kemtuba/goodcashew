import { createClient } from '@supabase/supabase-js';

// These secrets are loaded from your environment variables (.env.local or Vercel settings).
// They should ONLY be used on the server-side and must NOT have the NEXT_PUBLIC_ prefix.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// A safety check to ensure the server doesn't start in a misconfigured state.
if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Supabase URL or service role key is not defined in the environment variables.");
}

// Create the secure Supabase admin client.
// This client has admin privileges and can bypass Row Level Security policies.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    // It's good practice to disable auto-refreshing tokens for a service role client.
    autoRefreshToken: false,
    persistSession: false
  }
});
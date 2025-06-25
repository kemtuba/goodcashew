"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import React, { useState } from "react";

// This provider component is essential for making the Supabase client available
// to all client components, solving the 'setSession' error.
export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  // We create a single Supabase client instance on the client-side.
  const [supabaseClient] = useState(() => createClientComponentClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
}

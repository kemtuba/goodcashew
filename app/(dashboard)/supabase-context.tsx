"use client";

import { createContext, useContext } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

// 1. Create a context with a default value of null.
export const SupabaseContext = createContext<SupabaseClient | null>(null);

// 2. Create a custom hook for easy access to the client.
// This simplifies getting the client in your page components.
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

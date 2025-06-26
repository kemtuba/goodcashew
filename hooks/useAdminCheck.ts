"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
// CORRECTED: Import the existing supabase client, don't create a new one
import { supabase } from "@/lib/supabaseClient";

export function useAdminCheck() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null means "loading"

  useEffect(() => {
    // onAuthStateChanged is the correct way to get the current user on the client-side
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // If there is a logged-in user, check their role in the database
      if (user) {
        // CORRECTED: We query the database using the permanent user ID, not the phone number.
        // This matches the logic in your backend API route.
        const { data: profile, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.uid) // Match on the unique Firebase User ID
          .single();

        if (error) {
          console.error("Error fetching user role for admin check:", error);
          setIsAdmin(false);
        } else {
          // The user is an admin if their role in the database is 'admin'.
          setIsAdmin(profile?.role === "admin");
        }
      } else {
        // No user is signed in, so they are definitely not an admin.
        setIsAdmin(false);
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs only once

  return isAdmin;
}

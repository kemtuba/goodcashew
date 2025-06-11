// hooks/useAdminCheck.ts
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createClient } from "@supabase/supabase-js";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useAdminCheck() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.phoneNumber) {
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("phone", user.phoneNumber)
          .single();

        if (error || !data) {
          console.error("Error fetching user role", error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data.role === "admin");
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return isAdmin;
}

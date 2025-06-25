// /app/(dashboard)/layout.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// We are temporarily removing the Header and Sidebar to simplify the test
// import { Header } from '@/components/sections/dashboard/Header';
// import { Sidebar } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSessionValid, setIsSessionValid] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    console.log("DashboardLayout: Checking session...");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          // If a session exists, the check is successful.
          console.log("DashboardLayout: SUCCESS - Session found. Granting access.");
          setIsSessionValid(true);
        } else {
          // If no session, redirect to the homepage.
          console.log("DashboardLayout: No session found. Redirecting...");
          setIsSessionValid(false);
          router.push('/');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // While checking the session, show a simple loading message.
  if (isSessionValid === null) {
    return <div className="h-screen w-full flex items-center justify-center">Loading session...</div>;
  }

  // If the session is valid, render the children (the dashboard page).
  // Otherwise, render nothing while the redirect happens.
  return isSessionValid ? <>{children}</> : null;
}

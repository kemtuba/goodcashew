"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// Import shared components
import { Header } from '@/components/sections/dashboard/Header';
import { Sidebar } from '@/components/ui/sidebar';

// CORRECTED: Import both UserRole and Language types
import type { UserRole, Language } from '@/lib/types';

/**
 * This DashboardLayout acts as a secure wrapper for all dashboard pages.
 * It ensures a user is authenticated and has a valid role before showing any content.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [userRole, setUserRole] = useState<UserRole | null>(null);
  // NEW: Initialize the language state, defaulting to English
  const [language, setLanguage] = useState<Language>('en'); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This more robust listener waits for the auth state to be confirmed
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // If the user logs out, the session is invalid, or an error occurs, redirect to homepage
        if (event === 'SIGNED_OUT' || !session) {
          router.push('/');
          return;
        }

        // If the user is signed in, fetch their profile from our database
        const { data: profile, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error || !profile?.role) {
          console.error("Profile not found or missing role, redirecting.", error);
          router.push('/'); // Redirect if profile is incomplete
        } else {
          setUserRole(profile.role);
        }
        setLoading(false);
      }
    );

    // Cleanup the listener when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // While checking the initial auth state, show a full-screen loading state.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div>Loading Dashboard...</div>
      </div>
    );
  }

  // This is a failsafe. If loading is done and there's still no role, they can't see the page.
  // The useEffect hook should have already redirected them.
  if (!userRole) {
    return null; 
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>
      
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* CORRECTED: The Header now receives both the userRole and language props it requires */}
        <Header userRole={userRole} language={language} />
        
        {/* The main content area where your dashboard pages will be rendered */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// Import shared components
import { Header } from '@/components/sections/dashboard/Header';
import { Sidebar } from '@/components/ui/sidebar';
import { Spinner } from '@/components/ui/spinner'; // Import a spinner for loading

// Import both UserRole and Language types
import type { UserRole, Language } from '@/lib/types';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [language, setLanguage] = useState<Language>('en'); 
  const [loading, setLoading] = useState(true);

  // This hook securely verifies the user's session and fetches their role
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) {
          router.push('/');
          return;
        }

        const { data: profile, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error || !profile?.role) {
          console.error("Profile/role not found, redirecting.", error);
          router.push('/');
        } else {
          setUserRole(profile.role);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // While checking the initial auth state, show a full-screen loading state.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  // If loading is done, but we failed to get a role, we show nothing.
  // The useEffect will handle the redirect.
  if (!userRole) {
    return null; 
  }

  // Only if loading is false AND userRole is valid do we render the dashboard
  return (
    <div className="flex h-screen w-full bg-background">
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>
      
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* CORRECTED: We now know for certain that userRole is not null here */}
        <Header userRole={userRole} language={language} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}


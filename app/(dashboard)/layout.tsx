// /app/(dashboard)/layout.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Header } from '@/components/sections/dashboard/Header';
import { Sidebar } from '@/components/ui/sidebar';
import type { UserRole, Language } from '@/lib/types';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // This listener is more robust than getSession() for redirects.
    // It waits for the initial auth state to be confirmed.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // If the user logs out or the session expires, redirect to homepage.
        if (event === 'SIGNED_OUT' || !session) {
          router.push('/');
          return;
        }

        // If the user is signed in, fetch their profile from our database.
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

  // While checking the initial auth state, show a loading screen.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div>Loading Dashboard...</div>
      </div>
    );
  }

  // This is a failsafe. If loading is done and there's no role, they can't see the page.
  if (!userRole) {
    return null; 
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header userRole={userRole} language={language} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}


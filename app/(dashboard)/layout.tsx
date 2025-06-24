// /app/(dashboard)/layout.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

import { Header } from '@/components/sections/dashboard/Header';
import { Sidebar } from '@/components/ui/sidebar';

// Import both UserRole and Language types
import type { UserRole, Language } from '@/lib/types';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // State to hold the user's role and language
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [language, setLanguage] = useState<Language>('en'); // Language state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserProfile = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

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
        console.error("Could not find user profile or role in database.", error);
        router.push('/'); 
        return;
      }
      
      setUserRole(profile.role);
      setLoading(false);
    };

    getUserProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div>Loading Dashboard...</div>
      </div>
    );
  }

  if (!userRole) {
    return null; 
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>
      
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* CORRECTED: The Header now receives the language prop it requires */}
        <Header userRole={userRole} language={language} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
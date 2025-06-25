"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Spinner } from '@/components/ui/spinner';
import { Header } from '@/components/sections/dashboard/Header';
import { Sidebar } from '@/components/ui/sidebar';
import type { Language } from '@/lib/types'; // Assuming you have a Language type

// Define the specific roles a user can have
type UserRole = 'farmer' | 'coop-leader' | 'extension-worker' | 'admin' | 'retailer';

// Define a type for the user profile data we expect
type UserProfile = {
  id: string;
  full_name: string;
  // --- THIS IS THE FIX ---
  // The role is now correctly typed as the specific UserRole union type,
  // not just a generic string.
  role: UserRole;
  phone_number: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  // State is now typed with our more specific UserProfile type
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [language, setLanguage] = useState<Language>('en'); // Example language state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged into Firebase, now fetch their profile from our DB
        const { data: profile, error } = await supabase
          .from('users')
          .select('id, full_name, role, phone_number')
          .eq('id', user.uid)
          .single();

        if (profile) {
          // The fetched profile will be assigned to our correctly typed state
          setUserProfile(profile);
        } else {
          console.error("User logged in but profile not found.", error);
          router.push('/'); // Or a logout route
        }
      } else {
        router.push('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  if (!userProfile) {
    return null; // The useEffect is handling the redirect
  }

  // Render the dashboard with correctly typed props
  return (
    <div className="flex h-screen w-full bg-background">
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>
      
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* TypeScript is now happy because userProfile.role is guaranteed to be of type UserRole */}
        <Header userName={userProfile.full_name} userRole={userProfile.role} language={language} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
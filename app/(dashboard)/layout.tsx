"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
// EXPLANATION: We import useSupabaseClient for easier access to the client instance.
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Spinner } from '@/components/ui/spinner';
import { Header } from '@/components/sections/dashboard/Header';
import { Sidebar } from '@/components/ui/sidebar';
import type { Language, UserRole } from '@/lib/types';

type UserProfile = {
  id: string;
  full_name: string;
  role: UserRole;
  phone_number: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Get the Supabase client instance via the hook.
  const supabase = useSupabaseClient();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // --- THIS IS THE CRITICAL FIX ---
          // STEP 1: Get the Firebase JWT (ID token). This is the user's "ID card".
          const firebaseToken = await user.getIdToken();

          // STEP 2: Tell the Supabase client to use this token for its next requests.
          // This "shows the ID card" to the Supabase Guard (RLS).
          await supabase.auth.setSession({
            access_token: firebaseToken,
            refresh_token: firebaseToken, // For phone auth, access and refresh tokens can be the same
          });

          // STEP 3: Now that Supabase knows who we are, fetch the profile.
          // This query will now succeed because the RLS policy will pass.
          const { data: profile, error } = await supabase
            .from('users')
            .select('id, full_name, role, phone_number')
            .eq('id', user.uid)
            .single();

          if (error) {
            // This error will now be more specific if it happens (e.g., a real DB issue).
            throw error;
          }
          
          if (profile) {
            setUserProfile(profile as UserProfile);
          } else {
            // This case should be rare now, but it's good to have.
            throw new Error("Profile not found in database.");
          }

        } catch (error) {
            console.error("Error setting session or fetching profile:", error);
            router.push('/'); // If anything fails, log out.
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
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header userName={userProfile.full_name} userRole={userProfile.role} language={language} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

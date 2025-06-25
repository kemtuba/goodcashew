"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
// --- THIS IS THE FIX, PART 1 ---
// We now import `createClient` from the core Supabase library,
// which gives us direct control over the headers.
import { createClient } from '@supabase/supabase-js';
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // STEP 1: Get the Firebase JWT (ID token).
          const firebaseToken = await user.getIdToken();

          // STEP 2: Create a new Supabase client instance using the core library.
          // This is the most critical part of the fix. We create a client
          // and pass the Firebase token directly into its global headers.
          // This tells Supabase to use this token for EVERY request this client makes.
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
              global: {
                headers: {
                  Authorization: `Bearer ${firebaseToken}`,
                },
              },
            }
          );

          // STEP 3: Use this new, authenticated client to fetch the user profile.
          // The request will now have the `Authorization` header, and your RLS policy will work.
          const { data: profile, error } = await supabase
            .from('users')
            .select('id, full_name, role, phone_number')
            .eq('id', user.uid)
            .single();

          if (error) throw error;
          
          if (profile) {
            setUserProfile(profile as UserProfile);
          } else {
            throw new Error("Profile not found in database.");
          }

        } catch (error) {
            console.error("Error fetching authenticated profile:", error);
            router.push('/');
        }
      } else {
        router.push('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

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

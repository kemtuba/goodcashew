// app/(dashboard)/layout.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // Make sure this path is correct

// Import shared components
import { Header } from '@/components/sections/dashboard/Header';
import { Sidebar } from '@/components/ui/sidebar';

// Import shared types from your central types file
import type { UserRole, Language } from '@/lib/types';

/**
 * This DashboardLayout is a "client" component that acts as a secure wrapper.
 * It fetches the user's session and profile to ensure they are authenticated
 * before rendering the dashboard content. It also provides real user data to its children.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // State to hold the user's role and loading status
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserProfile = async () => {
      // 1. Get the current user session from Supabase Auth
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      // 2. If no session, the user is not logged in. Redirect them.
      if (sessionError || !session) {
        router.push('/login');
        return;
      }
      
      // 3. Fetch the user's profile from your `goodcashew_users` table
      //    to get their specific roles.
      const { data: profile, error: profileError } = await supabase
        .from('goodcashew_users')
        .select('roles')
        .eq('id', session.user.id)
        .single();
      
      if (profileError || !profile || !profile.roles || profile.roles.length === 0) {
        // Handle case where user is authenticated but has no profile/role
        console.error("Could not find user profile or roles.");
        router.push('/login'); // Or a "profile incomplete" page
        return;
      }
      
      // 4. Set the user's role (for simplicity, we take the first role)
      setUserRole(profile.roles[0]);
      setLoading(false);
    };

    getUserProfile();
  }, [router]);

  // While fetching the user's data, show a loading state.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div>Loading Dashboard...</div>
      </div>
    );
  }

  // This check is important. If, after loading, we still don't have a role,
  // we don't render the dashboard.
  if (!userRole) {
    return null; // Or render an error message
  }

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-gray-800">
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>
      
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* We now pass the dynamically fetched userRole to the Header */}
        <Header language={"en"} userRole={userRole} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

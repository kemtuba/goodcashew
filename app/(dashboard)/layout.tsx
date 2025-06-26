"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Spinner } from '@/components/ui/spinner';
import { Header } from '@/components/sections/dashboard/Header';
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarHeader, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { Home, Users, BarChart3, DollarSign, Settings, Trees, UserCheck, HardHat } from 'lucide-react';
import { SupabaseContext } from './supabase-context'; 
import type { Language, UserRole } from '@/lib/types';

// --- THIS IS A FIX ---
// Define a specific type for our navigation links for better type safety.
interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType; // Allows any Lucide icon
}

// --- THIS IS A FIX ---
// We explicitly type navLinks as a Record where keys must be of type UserRole
// and values are an array of NavLink objects. This solves the indexing error.
const navLinks: Record<UserRole, NavLink[]> = {
  admin: [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/finance", label: "Financials", icon: DollarSign },
  ],
  farmer: [
    { href: "/farmer", label: "My Dashboard", icon: Home },
    { href: "/farmer/yield", label: "Yield Reports", icon: Trees },
    { href: "/farmer/training", label: "My Training", icon: UserCheck },
  ],
  "coop-leader": [
    { href: "/coop-leader", label: "Co-op Dashboard", icon: Home },
    { href: "/coop-leader/members", label: "Members", icon: Users },
    { href: "/coop-leader/production", label: "Production", icon: BarChart3 },
  ],
  "extension-worker": [
    { href: "/extension-worker", label: "My Dashboard", icon: Home },
    { href: "/extension-worker/farmers", label: "Assigned Farmers", icon: Users },
    { href: "/extension-worker/visits", label: "Field Visits", icon: HardHat },
  ],
  // We add 'retailer' with an empty array to satisfy the type, even if not used yet.
  retailer: [],
  "lead-farmer": [], // Add any other roles from your UserRole type
  "school-liaison": [],
};

type UserProfile = {
  id: string;
  full_name: string;
  role: UserRole;
  phone_number: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const firebaseToken = await user.getIdToken();
          const client = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { global: { headers: { Authorization: `Bearer ${firebaseToken}` } } }
          );

          setSupabaseClient(client);

          const { data: profile, error } = await client
            .from('users')
            .select('id, full_name, role, phone_number')
            .eq('id', user.uid)
            .single();

          if (error) throw error;
          if (profile) setUserProfile(profile as UserProfile);
          else throw new Error("Profile not found.");

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

  if (loading || !userProfile || !supabaseClient) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }
  
  // This line will now be type-safe.
  const links = navLinks[userProfile.role] || [];

  return (
    <SupabaseContext.Provider value={supabaseClient}>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-background">
          <Sidebar>
              <SidebarHeader>
                 {/* You can place your logo or title here */}
              </SidebarHeader>
              <SidebarContent>
                  <SidebarMenu>
                      {/* --- THIS IS A FIX --- */}
                      {/* We explicitly type `link` to avoid the implicit 'any' error. */}
                      {links.map((link: NavLink) => (
                           <SidebarMenuItem key={link.href}>
                               <SidebarMenuButton asChild isActive={pathname === link.href}>
                                   <Link href={link.href}>
                                       <link.icon className="size-4" />
                                       <span>{link.label}</span>
                                   </Link>
                               </SidebarMenuButton>
                           </SidebarMenuItem>
                      ))}
                  </SidebarMenu>
              </SidebarContent>
          </Sidebar>
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header userName={userProfile.full_name} userRole={userProfile.role} language={'en'} />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SupabaseContext.Provider>
  );
}

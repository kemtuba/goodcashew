"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  LayoutDashboard, Users, TrendingUp, DollarSign, BookOpen, Bell, HelpCircle, ChevronLeft, ChevronRight, Menu, Home, Trees, UserCheck, HardHat, Award, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from '@/components/ui/spinner';
import { SupabaseContext } from './supabase-context';
import type { UserRole } from '@/lib/types';

// --- Types (Unchanged) ---
interface NavLink { href: string; label: string; icon: React.ElementType; }
const navLinks: Record<UserRole, NavLink[]> = {
  admin: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard }, { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/analytics", label: "Analytics", icon: TrendingUp }, { href: "/admin/financials", label: "Financials", icon: DollarSign },
  ],
  farmer: [
    { href: "/farmer", label: "My Dashboard", icon: Home }, { href: "/farmer/yield", label: "Yield Reports", icon: Trees },
    { href: "/farmer/training", label: "My Training", icon: UserCheck },
  ],
  "coop-leader": [
    { href: "/coop-leader", label: "Co-op Dashboard", icon: Home }, { href: "/coop-leader/members", label: "Members", icon: Users },
    { href: "/coop-leader/production", label: "Production", icon: TrendingUp },
  ],
  "extension-worker": [
    { href: "/extension-worker", label: "My Dashboard", icon: Home }, { href: "/extension-worker/farmers", label: "Assigned Farmers", icon: Users },
    { href: "/extension-worker/visits", label: "Field Visits", icon: HardHat },
  ],
  retailer: [], "lead-farmer": [], "school-liaison": [],
};
type UserProfile = { id: string; full_name: string; role: UserRole; phone_number: string; }

const UserProfileContext = createContext<UserProfile | null>(null);
export const useUserProfile = () => useContext(UserProfileContext);

// --- Main Layout Component ---
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);
  const [loading, setLoading] = useState(true);
  // --- HIGHLIGHT: State for mobile sidebar visibility ---
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
          const { data: profile, error } = await client.from('users').select('id, full_name, role, phone_number').eq('id', user.uid).single();
          if (error) throw error;
          if (profile) setUserProfile(profile as UserProfile);
          else throw new Error("Profile not found.");
        } catch (error) { router.push('/'); }
      } else { router.push('/'); }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading || !userProfile || !supabaseClient) {
    return <div className="flex h-screen w-full items-center justify-center bg-zinc-900"><Spinner /></div>;
  }

  const links = navLinks[userProfile.role] || [];

  return (
    <SupabaseContext.Provider value={supabaseClient}>
      <UserProfileContext.Provider value={userProfile}>
        <div className="flex h-screen bg-zinc-900 text-white overflow-hidden">
          {/* --- HIGHLIGHT: New Mobile Sidebar Drawer --- */}
          <MobileSidebar navLinks={links} isOpen={isMobileSidebarOpen} setIsOpen={setIsMobileSidebarOpen} />
          <DesktopSidebar navLinks={links} />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header onMenuClick={() => setIsMobileSidebarOpen(true)} userName={userProfile.full_name} userRole={userProfile.role} />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </UserProfileContext.Provider>
    </SupabaseContext.Provider>
  );
}

// --- Desktop Sidebar (for large screens) ---
function DesktopSidebar({ navLinks }: { navLinks: NavLink[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  return (
    <nav 
      className={`h-screen bg-zinc-800 border-r border-zinc-700 p-3 flex-col justify-between transition-all duration-300 ease-in-out hidden lg:flex ${isExpanded ? 'w-64' : 'w-16'}`}
      onMouseEnter={() => setIsExpanded(true)} onMouseLeave={() => setIsExpanded(false)}
    >
      <div>
        <div className="flex items-center gap-3 px-2 mb-6 h-10">
          {isExpanded ? <Image src="/goodcashew-primarylogo.svg" alt="GoodCashew Logo" width={150} height={24} /> : <Image src="/goodCashewlogo.svg" alt="Icon" width={32} height={32} />}
        </div>
        <div className="space-y-2">
          {navLinks.map(link => (
            <Button key={link.href} variant={pathname?.startsWith(`/dashboard${link.href}`) ? "secondary" : "ghost"} className="w-full justify-start gap-3 hover:bg-amber-500/20" asChild>
              <Link href={`/dashboard${link.href}`}><link.icon size={20} className="flex-shrink-0" /><span className={`overflow-hidden transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>{link.label}</span></Link>
            </Button>
          ))}
        </div>
      </div>
      <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-amber-500/20" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}<span className={`overflow-hidden transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>Collapse</span>
      </Button>
    </nav>
  );
}

// --- HIGHLIGHT: New Mobile Sidebar Component ---
function MobileSidebar({ navLinks, isOpen, setIsOpen }: { navLinks: NavLink[], isOpen: boolean, setIsOpen: (open: boolean) => void }) {
    const pathname = usePathname();
    return (
        <>
            <div className={`fixed inset-0 bg-black/60 z-40 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
            <nav className={`fixed top-0 left-0 h-full bg-zinc-800 border-r border-zinc-700 p-4 flex flex-col z-50 transition-transform lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between mb-8">
                    <Image src="/goodcashew-primarylogo.svg" alt="GoodCashew Logo" width={150} height={24} />
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}><X size={20} /></Button>
                </div>
                <div className="space-y-2">
                    {navLinks.map(link => (
                        <Button key={link.href} variant={pathname?.startsWith(`/dashboard${link.href}`) ? "secondary" : "ghost"} className="w-full justify-start gap-3" asChild>
                            <Link href={`/dashboard${link.href}`} onClick={() => setIsOpen(false)}><link.icon size={20} /><span>{link.label}</span></Link>
                        </Button>
                    ))}
                </div>
            </nav>
        </>
    );
}


// --- Header Component ---
function Header({ onMenuClick, userName, userRole }: { onMenuClick: () => void, userName: string, userRole: UserRole }) {
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
    const formattedRole = userRole.charAt(0).toUpperCase() + userRole.slice(1).replace(/-/g, ' ');
    return (
        <header className="flex-shrink-0 h-16 flex items-center justify-between px-4 md:px-6 border-b border-zinc-700 bg-zinc-900">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}><Menu size={20} /></Button>
                <Badge variant="outline" className="border-amber-500/50 text-amber-400">{formattedRole}</Badge>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
                <Button variant="ghost" size="icon"><Award size={18} /></Button>
                <Button variant="ghost" size="icon" className="relative"><DollarSign size={18} /><div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div></Button>
                <Button variant="ghost" size="icon"><Bell size={18} /></Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" className="rounded-full w-8 h-8 bg-amber-600 hover:bg-amber-700"><span className="font-bold text-white">{userInitials}</span></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end"><DropdownMenuLabel>{userName}</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem>Settings</DropdownMenuItem><DropdownMenuItem>Log out</DropdownMenuItem></DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

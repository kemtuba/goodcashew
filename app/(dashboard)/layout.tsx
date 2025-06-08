// app/(dashboard)/layout.tsx
"use client";

import React from 'react';

// Import your updated Header and Sidebar
import { Header } from '@/components/sections/dashboard/Header';
import { Sidebar } from '@/components/ui/sidebar'; // Assuming your sidebar logic is here

// Assuming these types are defined in a central file like `/types.ts`
type UserRole = "farmer" | "extension-worker" | "coop-leader" | "admin" | "retailer";
type Language = "en" | "twi" | "nafana" | "fr";


/**
 * DashboardLayout provides a consistent wrapper for all pages within the (dashboard) route group.
 * The logic for the mobile menu has been moved into the Header component itself.
 * This layout now only needs to arrange the Sidebar, Header, and page content.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In a real application, you would fetch the current user's role and language
  // from your authentication state (e.g., Supabase session).
  // For now, we can use placeholder values.
  const currentUserRole: UserRole = "farmer"; // Placeholder
  const currentLanguage: Language = "en"; // Placeholder

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-gray-800">
      {/* --- Desktop Sidebar --- */}
      {/* This remains the same: a static sidebar for larger screens. */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* --- Main Content Area --- */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/*
          * FIXED: We now pass the required `language` and `userRole` props to the Header.
          * The `onMenuClick` prop is removed because the new Header handles its own mobile menu state.
        */}
        <Header language={currentLanguage} userRole={currentUserRole} />

        {/* The `main` tag is where the actual page content (`children`) will be displayed. */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

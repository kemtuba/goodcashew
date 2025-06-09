// app/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { Users, Briefcase, Crown, Settings, ShoppingCart } from "lucide-react";

// Import UI components from their central location
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// BEST PRACTICE: Import shared types from the central /lib/types.ts file.
import type { UserRole, Language } from "@/lib/types";

// The translations object is specific to this page, so it's fine to keep it here.
const translations = {
  en: {
    title: "Welcome to GoodCashew",
    subtitle: "Select your role to continue",
    farmer: "Farmer",
    farmerDesc: "Track your cashew production and cooperative participation",
    extensionWorker: "Extension Worker",
    extensionWorkerDesc: "Support farmers and coordinate school-based activities",
    coopLeader: "Cooperative Leader",
    coopLeaderDesc: "Manage cooperative members and school operations",
    admin: "Administrator",
    adminDesc: "Oversee program data and support onboarding",
    retailer: "Retailer", // Added retailer for consistency
    retailerDesc: "Manage product sales and inventory"
  },
  // You can keep your other languages here
  twi: { /* ... */ },
  nafana: { /* ... */ },
  fr: { /* ... */ },
};

export default function HomePage() {
  const router = useRouter();
  
  // For this pilot, we can hardcode the language.
  const language: Language = "en"; 
  const t = translations[language];

  const handleRoleClick = (role: UserRole) => {
    // This function correctly navigates to the login page with the role
    router.push(`/login?role=${role}`);
  };

  // The roles array now includes all roles defined in your UserRole type.
  const roles = [
    { key: "farmer" as UserRole, label: t.farmer, desc: t.farmerDesc, icon: Users, color: "bg-green-500" },
    { key: "extension-worker" as UserRole, label: t.extensionWorker, desc: t.extensionWorkerDesc, icon: Briefcase, color: "bg-blue-500" },
    { key: "coop-leader" as UserRole, label: t.coopLeader, desc: t.coopLeaderDesc, icon: Crown, color: "bg-purple-500" },
    { key: "admin" as UserRole, label: t.admin, desc: t.adminDesc, icon: Settings, color: "bg-gray-500" },
    { key: "retailer" as UserRole, label: t.retailer, desc: t.retailerDesc, icon: ShoppingCart, color: "bg-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-gray-600 text-lg">{t.subtitle}</p>
        </div>

        <div className="space-y-4">
          {roles.map((role) => {
            const Icon = role.icon;
            // You can easily remove a role from the UI by filtering it out here if needed
            // For example: if (role.key === 'retailer') return null;
            return (
              <Card 
                key={role.key} 
                className="cursor-pointer hover:shadow-xl transition-shadow duration-300 rounded-lg"
                onClick={() => handleRoleClick(role.key)}
              >
                <CardContent className="p-6 flex items-center gap-6">
                  <div className={`p-4 rounded-full ${role.color}`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{role.label}</h3>
                    <p className="text-md text-gray-500 mt-1">{role.desc}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

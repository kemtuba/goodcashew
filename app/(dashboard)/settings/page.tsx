"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// --- FIX: We will use our custom context hook to get the authenticated Supabase client ---
import { useSupabase } from '../supabase-context'; 
import { Globe, User, Bell, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Language, UserRole } from "@/lib/types";

// --- FIX: Invalid keys like 'lead-farmer' must be enclosed in quotes ---
type TranslationSet = {
  title: string;
  language: string;
  userRole: string;
  notifications: string;
  about: string;
  version: string;
  currentRole: string;
  farmer: string;
  extensionWorker: string;
  coopLeader: string;
  admin: string;
  retailer: string;
  "lead-farmer": string; // Enclosed in quotes
  "school-liaison": string; // Enclosed in quotes
  english: string;
  twi: string;
  nafana: string;
  french: string;
};

// --- FIX: Added the missing roles to each language with placeholder text ---
const translations: Record<Language, TranslationSet> = {
  en: {
    title: "Settings", language: "Language", userRole: "Your Role", notifications: "Notifications",
    about: "About GoodCashew", version: "Version 1.0.0", currentRole: "Current Role",
    farmer: "Farmer", extensionWorker: "Extension Worker", coopLeader: "Cooperative Leader",
    admin: "Administrator", retailer: "Retailer", "lead-farmer": "Lead Farmer", "school-liaison": "School Liaison",
    english: "English", twi: "Twi", nafana: "Nafana", french: "French",
  },
  twi: {
    title: "Nhyehyɛe", language: "Kasa", userRole: "Wo Dwumadi", notifications: "Amanneɛbɔ",
    about: "GoodCashew Ho Nsɛm", version: "Nkyerɛwde 1.0.0", currentRole: "Dwumadi a Woyɛ",
    farmer: "Okuafo", extensionWorker: "Mmoa Adwumayɛfo", coopLeader: "Kuo Kannifo",
    admin: "Ɔhwɛfo", retailer: "Retailer", "lead-farmer": "Lead Farmer", "school-liaison": "School Liaison",
    english: "Borɔfo Kasa", twi: "Twi", nafana: "Nafana", french: "Frɛnkye Kasa",
  },
  nafana: {
    title: "Yεlεni", language: "Kasa", userRole: "Wo Tuma", notifications: "Amanneεbɔ",
    about: "GoodCashew Ho Nsεm", version: "Nkyerεwde 1.0.0", currentRole: "Tuma a Woyε",
    farmer: "Kuoro", extensionWorker: "Dεmε Tumani", coopLeader: "Kuo Yεlεni",
    admin: "Yεlεni Kεsε", retailer: "Retailer", "lead-farmer": "Lead Farmer", "school-liaison": "School Liaison",
    english: "Borɔfo Kasa", twi: "Twi", nafana: "Nafana", french: "Frεnkye Kasa",
  },
  fr: {
    title: "Paramètres", language: "Langue", userRole: "Votre Rôle", notifications: "Notifications",
    about: "À Propos de GoodCashew", version: "Version 1.0.0", currentRole: "Rôle Actuel",
    farmer: "Agriculteur", extensionWorker: "Agent de Vulgarisation", coopLeader: "Leader Coopératif",
    admin: "Administrateur", retailer: "Détaillant", "lead-farmer": "Agriculteur Principal", "school-liaison": "Liaison Scolaire",
    english: "Anglais", twi: "Twi", nafana: "Nafana", french: "Français",
  },
};

export default function SettingsPage() {
  const router = useRouter();
  // --- FIX: Use our authenticated context hook ---
  const supabase = useSupabase(); 

  const [language, setLanguage] = useState<Language>("en");
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const t = translations[language];

  useEffect(() => {
    // Don't run the effect if the authenticated client isn't ready yet.
    if (!supabase) return;

    const fetchUserProfile = async () => {
      setLoading(true);
      // --- FIX: We now use the authenticated client provided by the layout ---
      // This automatically respects RLS policies.
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/'); 
        return;
      }

      // --- FIX: Query the correct 'users' table and 'role' column ---
      const { data: profile, error } = await supabase
        .from('users') 
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
      } else if (profile) {
        setUserRole(profile.role as UserRole);
      }
      setLoading(false);
    };
    fetchUserProfile();
  }, [supabase, router]);


  if (loading) {
    return (
        <div className="space-y-6 p-4 md:p-8">
            <Skeleton className="h-10 w-1/3" />
            <Card><CardHeader><Skeleton className="h-24 w-full" /></CardHeader></Card>
            <Card><CardHeader><Skeleton className="h-24 w-full" /></CardHeader></Card>
        </div>
    );
  }
  
  // --- FIX: Create a complete map of roles to labels ---
  const roleLabels: Record<UserRole, string> = {
    farmer: t.farmer,
    "extension-worker": t.extensionWorker,
    "coop-leader": t.coopLeader,
    admin: t.admin,
    retailer: t.retailer,
    "lead-farmer": t["lead-farmer"],
    "school-liaison": t["school-liaison"],
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">Manage your account and app settings.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{t.language}</CardTitle>
          </div>
          <CardDescription>Choose your preferred language for the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
            <SelectTrigger className="w-full md:w-1/2">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t.english}</SelectItem>
              <SelectItem value="twi">{t.twi}</SelectItem>
              <SelectItem value="nafana">{t.nafana}</SelectItem>
              <SelectItem value="fr">{t.french}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      {/* --- SIMPLIFIED: Role display (switching roles is a more complex feature) --- */}
      <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <CardTitle>{t.userRole}</CardTitle>
            </div>
          <CardDescription>This is your currently active role in the program.</CardDescription>
        </CardHeader>
        <CardContent>
           <p className="font-semibold p-3 border rounded-md bg-muted w-full md:w-1/2">
             {userRole ? roleLabels[userRole] : 'Loading...'}
           </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <CardTitle>{t.notifications}</CardTitle>
            </div>
          <CardDescription>Manage your notification preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <label htmlFor="coop-updates" className="font-medium text-sm">Cooperative Updates</label>
            <Switch id="coop-updates" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <label htmlFor="market-alerts" className="font-medium text-sm">Market Price Alerts</label>
            <Switch id="market-alerts" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-muted-foreground" />
                <CardTitle>{t.about}</CardTitle>
            </div>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2 text-muted-foreground">
            <p className="text-lg font-semibold text-foreground">GoodCashew</p>
            <p>{t.version}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

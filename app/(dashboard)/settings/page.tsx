// app/(dashboard)/settings/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Globe, User, Bell, Info } from "lucide-react";

// CORRECTED: Importing UI components from the central library
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// CORRECTED: Importing shared types from the central types file
import type { Language, UserRole } from "@/lib/types";

// Translations specific to this page
const translations = {
  en: {
    title: "Settings",
    language: "Language",
    userRole: "Switch Role",
    notifications: "Notifications",
    about: "About GoodCashew",
    version: "Version 1.0.0",
    currentRole: "Current Role",
    farmer: "Farmer",
    extensionWorker: "Extension Worker",
    coopLeader: "Cooperative Leader",
    admin: "Administrator",
    retailer: "Retailer",
    english: "English",
    twi: "Twi",
    nafana: "Nafana",
    french: "French",
  },
  // FIXED: Added placeholder data for other languages to satisfy TypeScript
  twi: {
    title: "Nhyehyɛe",
    language: "Kasa",
    userRole: "Sesa Dwumadi",
    notifications: "Amanneɛbɔ",
    about: "GoodCashew Ho Nsɛm",
    version: "Nkyerɛwde 1.0.0",
    currentRole: "Dwumadi a Woyɛ",
    farmer: "Okuafo",
    extensionWorker: "Mmoa Adwumayɛfo",
    coopLeader: "Kuo Kannifo",
    admin: "Ɔhwɛfo",
    retailer: "Retailer",
    english: "Borɔfo Kasa",
    twi: "Twi",
    nafana: "Nafana",
    french: "Frɛnkye Kasa",
  },
  nafana: {
    title: "Yεlεni",
    language: "Kasa",
    userRole: "Sesa Tuma",
    notifications: "Amanneεbɔ",
    about: "GoodCashew Ho Nsεm",
    version: "Nkyerεwde 1.0.0",
    currentRole: "Tuma a Woyε",
    farmer: "Kuoro",
    extensionWorker: "Dεmε Tumani",
    coopLeader: "Kuo Yεlεni",
    admin: "Yεlεni Kεsε",
    retailer: "Retailer",
    english: "Borɔfo Kasa",
    twi: "Twi",
    nafana: "Nafana",
    french: "Frεnkye Kasa",
  },
  fr: {
    title: "Paramètres",
    language: "Langue",
    userRole: "Changer Rôle",
    notifications: "Notifications",
    about: "À Propos de GoodCashew",
    version: "Version 1.0.0",
    currentRole: "Rôle Actuel",
    farmer: "Agriculteur",
    extensionWorker: "Agent de Vulgarisation",
    coopLeader: "Leader Coopératif",
    admin: "Administrateur",
    retailer: "Détaillant",
    english: "Anglais",
    twi: "Twi",
    nafana: "Nafana",
    french: "Français",
  },
};

export default function SettingsPage() {
  const router = useRouter();

  // State for user data and settings
  const [language, setLanguage] = useState<Language>("en");
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  const t = translations[language];

  // Fetch the user's profile and available roles on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('goodcashew_users')
        .select('roles')
        .eq('id', session.user.id)
        .single();

      if (profile && profile.roles) {
        // For simplicity, we assume the current role is the first one in their list.
        setCurrentRole(profile.roles[0]); 
        setAvailableRoles(profile.roles);
      }
      setLoading(false);
    };
    fetchUserProfile();
  }, [router]);

  // Handler for when a user selects a new role from the dropdown
  const handleRoleChange = (newRole: UserRole) => {
    if (newRole && newRole !== currentRole) {
      router.push(`/${newRole}`);
    }
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  // A map to get the display label for a role key
  const roleLabels: Record<UserRole, string> = {
    farmer: t.farmer,
    "extension-worker": t.extensionWorker,
    "coop-leader": t.coopLeader,
    admin: t.admin,
    retailer: t.retailer,
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">Manage your account and app settings.</p>
      </div>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t.language}</CardTitle>
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

      {/* User Role Switching (only shows if user has more than one role) */}
      {availableRoles.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.userRole}</CardTitle>
            <CardDescription>Switch between your available roles.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleRoleChange} defaultValue={currentRole || undefined}>
              <SelectTrigger className="w-full md:w-1/2">
                <SelectValue placeholder="Select a role to switch to" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {roleLabels[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Notifications Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t.notifications}</CardTitle>
          <CardDescription>Manage your notification preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-2 rounded-lg border">
            <label htmlFor="school-events" className="font-medium">School Events</label>
            <Switch id="school-events" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg border">
            <label htmlFor="pest-alerts" className="font-medium">Pest Alerts</label>
            <Switch id="pest-alerts" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t.about}</CardTitle>
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

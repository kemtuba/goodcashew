"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Globe, User, Bell, Info } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import type { Language, UserRole } from "@/lib/types";

// Type definition for a single translation set
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
  english: string;
  twi: string;
  nafana: string;
  french: string;
};

// Complete translations object to satisfy TypeScript types
const translations: Record<Language, TranslationSet> = {
  en: {
    title: "Settings", language: "Language", userRole: "Switch Role", notifications: "Notifications",
    about: "About GoodCashew", version: "Version 1.0.0", currentRole: "Current Role",
    farmer: "Farmer", extensionWorker: "Extension Worker", coopLeader: "Cooperative Leader",
    admin: "Administrator", retailer: "Retailer", english: "English", twi: "Twi",
    nafana: "Nafana", french: "French",
  },
  twi: {
    title: "Nhyehyɛe", language: "Kasa", userRole: "Sesa Dwumadi", notifications: "Amanneɛbɔ",
    about: "GoodCashew Ho Nsɛm", version: "Nkyerɛwde 1.0.0", currentRole: "Dwumadi a Woyɛ",
    farmer: "Okuafo", extensionWorker: "Mmoa Adwumayɛfo", coopLeader: "Kuo Kannifo",
    admin: "Ɔhwɛfo", retailer: "Retailer", english: "Borɔfo Kasa", twi: "Twi",
    nafana: "Nafana", french: "Frɛnkye Kasa",
  },
  nafana: {
    title: "Yεlεni", language: "Kasa", userRole: "Sesa Tuma", notifications: "Amanneεbɔ",
    about: "GoodCashew Ho Nsεm", version: "Nkyerεwde 1.0.0", currentRole: "Tuma a Woyε",
    farmer: "Kuoro", extensionWorker: "Dεmε Tumani", coopLeader: "Kuo Yεlεni",
    admin: "Yεlεni Kεsε", retailer: "Retailer", english: "Borɔfo Kasa", twi: "Twi",
    nafana: "Nafana", french: "Frεnkye Kasa",
  },
  fr: {
    title: "Paramètres", language: "Langue", userRole: "Changer Rôle", notifications: "Notifications",
    about: "À Propos de GoodCashew", version: "Version 1.0.0", currentRole: "Rôle Actuel",
    farmer: "Agriculteur", extensionWorker: "Agent de Vulgarisation", coopLeader: "Leader Coopératif",
    admin: "Administrateur", retailer: "Détaillant", english: "Anglais", twi: "Twi",
    nafana: "Nafana", french: "Français",
  },
};

export default function SettingsPage() {
  const router = useRouter();

  const [language, setLanguage] = useState<Language>("en");
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  const t = translations[language];

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/'); 
        return;
      }

      // NOTE: Replace 'profiles' with your actual Supabase table name for user profiles
      const { data: profile, error } = await supabase
        .from('profiles') 
        .select('roles')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
      }
      
      if (profile && profile.roles && profile.roles.length > 0) {
        // Sets the current role and the list of roles available to switch to
        setCurrentRole(profile.roles[0]); 
        setAvailableRoles(profile.roles);
      }
      setLoading(false);
    };
    fetchUserProfile();
  }, [router]);

  const handleRoleChange = (newRoleValue: string) => {
    const newRole = newRoleValue as UserRole;
    if (newRole && newRole !== currentRole) {
      setCurrentRole(newRole);
      // In a real app, you might make an API call to update the user's session
      // then use router.refresh() to reload server components with the new role.
      console.log(`Switched to role: ${newRole}`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading settings...</div>;
  }

  const roleLabels: Record<UserRole, string> = {
    farmer: t.farmer,
    "extension-worker": t.extensionWorker,
    "coop-leader": t.coopLeader,
    admin: t.admin,
    retailer: t.retailer,
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

      {availableRoles.length > 1 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <CardTitle>{t.userRole}</CardTitle>
            </div>
            <CardDescription>
              Your current role is **{currentRole ? roleLabels[currentRole] : '...'}**. 
              Switch between your available roles.
            </CardDescription>
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
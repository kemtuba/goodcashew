// app/(dashboard)/extension-worker/page.tsx
"use client";

import React from 'react';
import { Users, MapPin, CheckCircle } from "lucide-react";

// CORRECTED: Importing UI components from the central library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// CORRECTED: Importing shared types from the central types file
import type { Language } from "@/lib/types";

// Translations specific to this dashboard
const translations = {
  en: {
    welcome: "Welcome, Extension Worker",
    assignedFarmers: "Assigned Farmers",
    pendingVisits: "Pending Visits",
    moduleFollowUps: "Module Follow-ups Required",
    recentActivity: "Recent Activity",
    scheduleVisit: "Schedule Visit",
    viewFarmer: "View Farmer",
    urgent: "Urgent",
  },
  twi: {
    welcome: "Akwaaba, Mmoa Adwumayɛfo",
    assignedFarmers: "Akuafo A Wɔde Ama Wo",
    //... (other Twi translations)
  },
  fr: {
    welcome: "Bienvenue, Agent de Vulgarisation",
    assignedFarmers: "Agriculteurs Assignés",
    //... (other French translations)
  },
};

// The component is now the default export for the page.
export default function ExtensionWorkerDashboardPage() {
  // In a real app, this data would be fetched from Supabase
  const language: Language = 'en';
  const t = translations[language];

  // Placeholder data representing what you'd fetch from your database
  const dashboardData = {
    assignedFarmersCount: 15,
    pendingVisitsCount: 3,
    assignedFarmers: [
      { id: 1, name: "Kwame Asante", location: "Brong Ahafo", status: "active" as const, lastVisit: "2024-01-10" },
      { id: 2, name: "Ama Osei", location: "Ashanti", status: "needs-visit" as const, lastVisit: "2023-12-15" },
      { id: 3, name: "Kofi Mensah", location: "Eastern", status: "active" as const, lastVisit: "2024-01-08" },
    ],
    moduleFollowUps: [
      { farmer: "Kwame Asante", module: "Week 7: Pest Identification", priority: "urgent" as const },
      { farmer: "Ama Osei", module: "Week 4: Planting Techniques", priority: "normal" as const },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">{t.welcome}</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.assignedFarmers}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.assignedFarmersCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.pendingVisits}</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.pendingVisitsCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Assigned Farmers List */}
        <Card>
          <CardHeader>
            <CardTitle>{t.assignedFarmers}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.assignedFarmers.map((farmer) => (
              <div key={farmer.id} className="flex items-center space-x-4">
                <div className="flex-1">
                  <p className="font-semibold">{farmer.name}</p>
                  <p className="text-sm text-muted-foreground">{farmer.location}</p>
                </div>
                <Badge variant={farmer.status === "needs-visit" ? "destructive" : "secondary"}>
                  {farmer.status === "needs-visit" ? t.urgent : "Active"}
                </Badge>
                <Button size="sm" variant="outline">{t.viewFarmer}</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Module Follow-ups List */}
        <Card>
          <CardHeader>
            <CardTitle>{t.moduleFollowUps}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.moduleFollowUps.map((followUp, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-1">
                  <p className="font-semibold">{followUp.farmer}</p>
                  <p className="text-sm text-muted-foreground">{followUp.module}</p>
                </div>
                <Badge variant={followUp.priority === "urgent" ? "destructive" : "secondary"}>
                  {followUp.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

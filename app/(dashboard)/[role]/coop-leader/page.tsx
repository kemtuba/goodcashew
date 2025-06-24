// app/(dashboard)/coop-leader/page.tsx
"use client";

import React from 'react';
import { Users, TrendingUp, Award, BarChart3 } from "lucide-react";

// CORRECTED: Importing UI components from the central library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// CORRECTED: Importing shared types from the central types file
import type { Language } from "@/lib/types";

// Translations specific to this dashboard
const translations = {
  en: {
    welcome: "Welcome, Cooperative Leader",
    totalMembers: "Total Members",
    totalProduction: "Total Production (Season)",
    certificationReady: "Certification Ready",
    memberParticipation: "Member Participation",
    topPerformers: "Top Performers",
    kg: "kg",
  },
  twi: {
    welcome: "Akwaaba, Kuo Kannifo",
    //... (other Twi translations)
  },
  fr: {
    welcome: "Bienvenue, Leader Coopératif",
    //... (other French translations)
  },
};

// The component is now the default export for the page.
export default function CoopLeaderDashboardPage() {
  // In a real app, this data would be fetched from Supabase
  const language: Language = 'en';
  const t = translations[language];

  // Placeholder data representing what you'd fetch from your database
  const dashboardData = {
    totalMembers: 48,
    totalProduction: "12,450",
    certificationReady: 35,
    memberParticipationPercent: 87,
    participation: {
      training: 87,
      reporting: 92,
      certification: 73,
    },
    topPerformers: [
      { name: "Kwame Asante", production: 450, progress: 95 },
      { name: "Ama Osei", production: 380, progress: 88 },
      { name: "Kofi Mensah", production: 320, progress: 82 },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">{t.welcome}</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalMembers}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalProduction}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalProduction} {t.kg}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.certificationReady}</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.certificationReady}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.memberParticipation}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.memberParticipationPercent}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Member Participation Details */}
        <Card>
          <CardHeader>
            <CardTitle>{t.memberParticipation}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Training Completion</span>
                <span>{dashboardData.participation.training}%</span>
              </div>
              <Progress value={dashboardData.participation.training} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Production Reporting</span>
                <span>{dashboardData.participation.reporting}%</span>
              </div>
              <Progress value={dashboardData.participation.reporting} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Certification Process</span>
                <span>{dashboardData.participation.certification}%</span>
              </div>
              <Progress value={dashboardData.participation.certification} />
            </div>
          </CardContent>
        </Card>

        {/* Top Performers List */}
        <Card>
          <CardHeader>
            <CardTitle>{t.topPerformers}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dashboardData.topPerformers.map((performer, index) => (
              <div key={index} className="rounded-lg border p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">{performer.name}</p>
                  <span className="text-sm font-medium text-muted-foreground">
                    {performer.production} {t.kg}
                  </span>
                </div>
                <div>
                  <Progress value={performer.progress} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

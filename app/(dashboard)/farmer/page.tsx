// app/(dashboard)/farmer/page.tsx
"use client";

import React from 'react';
import { TrendingUp, AlertTriangle, BookOpen, DollarSign, School } from "lucide-react";

// CORRECTED: Importing UI components from the central library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// CORRECTED: Importing shared types from the central types file
import type { Language } from "@/lib/types";

// This translations object is specific to the farmer dashboard content
const translations = {
  en: {
    welcome: "Welcome back",
    currentSeason: "Current Season Yield",
    kg: "kg",
    trainingProgress: "Training Progress",
    cooperativeDues: "Cooperative Dues",
    pestAlerts: "Pest Alerts",
    nextSchoolEvent: "Next School Event",
    incentiveEarned: "Incentive Earned",
    duesPaid: "Dues Paid",
    ghsMonth: "GHS/month",
    viewDetails: "View Details",
    payDues: "Pay Dues",
    seedDistribution: "Seed Distribution",
    tuesday: "Tuesday",
    kabile: "Kabile School",
  },
  twi: {
    welcome: "Akwaaba",
    currentSeason: "Afe Yi Nnɔbae",
    //... (other Twi translations)
  },
  nafana: {
    welcome: "Bεrε",
    currentSeason: "Bεrε Cashew Yεlε",
    //... (other Nafana translations)
  },
  fr: {
    welcome: "Bon retour",
    currentSeason: "Rendement Saison Actuelle",
    //... (other French translations)
  },
};

// The component is now the default export for the page.
export default function FarmerDashboardPage() {
  // In a real app, language and user data would come from context or session.
  const language: Language = 'en';
  const t = translations[language];

  // This data would be fetched from your database (e.g., Supabase)
  const farmerData = {
    name: "Kwame Asante",
    yield: 245,
    yieldChange: "+12%",
    incentive: "15%",
    trainingProgress: 29,
    duesPaid: 8,
    duesTotal: 12,
    duesAmount: 10,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-bold">{t.welcome}, {farmerData.name}!</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Current Season Yield */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.currentSeason}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmerData.yield} {t.kg}</div>
            <p className="text-xs text-muted-foreground">{farmerData.yieldChange} from last season</p>
            <div className="mt-3">
              <Badge>{t.incentiveEarned}: {farmerData.incentive}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Training Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.trainingProgress}</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmerData.trainingProgress}%</div>
            <p className="text-xs text-muted-foreground">Week 8 of 28</p>
            <Progress value={farmerData.trainingProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>

        {/* Cooperative Dues */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.cooperativeDues}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmerData.duesAmount} {t.ghsMonth}</div>
            <p className="text-xs text-muted-foreground">{farmerData.duesPaid} of {farmerData.duesTotal} months paid</p>
            <Button className="mt-2 w-full" variant="outline">{t.payDues}</Button>
          </CardContent>
        </Card>

        {/* Next School Event */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.nextSchoolEvent}</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border-l-4 border-orange-400">
              <h4 className="font-semibold text-orange-800 dark:text-orange-300">{t.seedDistribution}</h4>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                {t.tuesday} @ {t.kabile}
              </p>
              <Button size="sm" className="mt-2" variant="outline">{t.viewDetails}</Button>
            </div>
          </CardContent>
        </Card>

        {/* Pest Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.pestAlerts}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-400">
              <p className="text-red-800 dark:text-red-300 font-medium">Cashew Stem Borer Alert</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">Check your trees for small holes in branches</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

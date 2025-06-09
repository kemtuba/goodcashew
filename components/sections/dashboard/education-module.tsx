// components/sections/dashboard/education-modules.tsx
"use client";

import React from 'react';
import { CheckCircle, Clock, Users, BookOpen } from "lucide-react";

// CORRECTED: Importing UI components from the central library
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


// CORRECTED: Importing shared types from the central types file
import type { Language, UserRole } from "@/lib/types";

// Props for the component
interface EducationModulesProps {
  language: Language;
  userRole: UserRole;
}

// Translations specific to this section, with placeholders for all languages.
const translations: Record<Language, any> = {
  en: {
    title: "Education Modules",
    subtitle: "28-Week Curriculum",
    week: "Week",
    completed: "Completed",
    inProgress: "In Progress",
    notStarted: "Not Started",
    extensionRequired: "Extension Follow-up Required",
    startModule: "Start Module",
    continueModule: "Continue Module",
    reviewModule: "Review Module",
    moduleOverview: "Module Completion Overview",
    module: "Module",
    completionRate: "Completion Rate",
  },
  twi: {
    title: "Adesua Akuw",
    week: "Dapɛn",
    completed: "Awie",
    inProgress: "Ɛrekɔ So",
    notStarted: "Mmfii Ase",
    extensionRequired: "Mmoa Adwumayɛfo Hia",
    startModule: "Fi Adesua Ase",
    continueModule: "Kɔ Adesua So",
    reviewModule: "San Hwɛ Adesua",
    moduleOverview: "Adesua Awieyɛ",
    module: "Adesua",
    completionRate: "Awieyɛ Rate",
  },
  nafana: {
    title: "Kalanni Yεlε",
    //... (other nafana translations)
  },
  fr: {
    title: "Modules d'Éducation",
    week: "Semaine",
    completed: "Terminé",
    inProgress: "En Cours",
    notStarted: "Pas Commencé",
    extensionRequired: "Suivi Agent Requis",
    startModule: "Commencer Module",
    continueModule: "Continuer Module",
    reviewModule: "Revoir Module",
    moduleOverview: "Aperçu de l'achèvement des modules",
    module: "Module",
    completionRate: "Taux d'achèvement",
  },
};

// This component shows the education modules curriculum.
export function EducationModulesSection({ language, userRole }: EducationModulesProps) {
  const t = translations[language];

  // --- MOCK DATA ---
  const farmerModules = [
    { week: 1, title: "Introduction to GoodCashew", status: "completed", extensionRequired: false },
    { week: 2, title: "Organic Preparation", status: "completed", extensionRequired: true },
    { week: 3, title: "Soil Health Assessment", status: "in-progress", extensionRequired: false },
    { week: 4, title: "Planting Techniques", status: "not-started", extensionRequired: true },
    // ... more modules
  ];

  const leaderModuleProgress = [
      { title: "Organic Preparation", completion: 95 },
      { title: "Soil Health", completion: 88 },
      { title: "Planting Techniques", completion: 72 },
  ]

  // --- HELPER FUNCTIONS ---
  const getStatusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === "in-progress") return <Clock className="h-5 w-5 text-blue-500" />;
    return <Clock className="h-5 w-5 text-gray-400" />;
  };
  const getButtonText = (status: string) => {
    if (status === "completed") return t.reviewModule;
    if (status === "in-progress") return t.continueModule;
    return t.startModule;
  };

  // --- ROLE-SPECIFIC RENDER LOGIC ---
  const FarmerView = () => (
    <div className="space-y-3">
      {farmerModules.map((module) => (
        <Card key={module.week}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getStatusIcon(module.status)}
              <div>
                <p className="font-semibold">{`${t.week} ${module.week}: ${module.title}`}</p>
                <p className="text-sm text-muted-foreground">{getStatusText(module.status)}</p>
              </div>
            </div>
            <Button variant={module.status === "completed" ? "outline" : "default"}>
              {getButtonText(module.status)}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const LeaderView = () => (
     <Card>
        <CardHeader>
          <CardTitle>{t.moduleOverview}</CardTitle>
          <CardDescription>Track the educational progress of all cooperative members.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t.module}</TableHead>
                        <TableHead className="text-right">{t.completionRate}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leaderModuleProgress.map(module => (
                        <TableRow key={module.title}>
                            <TableCell className="font-medium">{module.title}</TableCell>
                            <TableCell className="text-right">{module.completion}%</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
     </Card>
  );

  // Helper to get status text, needed by FarmerView
  const getStatusText = (status: string) => {
    if (status === "completed") return t.completed;
    if (status === "in-progress") return t.inProgress;
    return t.notStarted;
  };

  // --- MAIN RENDER ---
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">{t.title}</h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>
      
      {/* Conditional rendering based on the userRole prop */}
      {userRole === 'farmer' && <FarmerView />}
      {(userRole === 'coop-leader' || userRole === 'admin') && <LeaderView />}
    </div>
  );
}

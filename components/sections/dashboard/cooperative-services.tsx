// components/sections/dashboard/cooperative-services.tsx
"use client";

import React from 'react';
import { DollarSign, Truck, BookOpen, Wrench, Gift, TrendingUp } from "lucide-react";

// CORRECTED: Importing UI components from the central library
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// CORRECTED: Importing shared types from the central types file
import type { Language, UserRole } from "@/lib/types";

// Props for the component
interface CooperativeServicesProps {
  language: Language;
  userRole: UserRole;
}

// Translations specific to this section, now with placeholders for all languages.
const translations: Record<Language, any> = {
  en: {
    title: "Cooperative Services",
    memberDues: "Member Dues",
    benefits: "Benefits Provided",
    incentives: "Incentive Tracker",
    schoolSupport: "School Support",
    payDues: "Pay Dues",
    viewBenefits: "View Benefits",
    ghsMonth: "GHS/month",
    duesPaid: "Dues Paid",
    seedSpray: "Seed & Spray",
    laborSupport: "Labor Support",
    transport: "Transport to Market",
    inputDiscounts: "Input Discounts",
    textbooks: "Textbooks",
    farmTools: "Farm Tools",
    earlyHarvest: "Early Harvest Bonus",
    qualityBonus: "Quality Bonus",
    attendanceBonus: "Training Attendance",
    totalMembers: "Total Members",
    duesCollected: "Dues Collected",
    benefitsDistributed: "Benefits Distributed",
    memberDuesSummary: "Member Dues Summary",
  },
  twi: {
    title: "Kuo Nnwuma",
    memberDues: "Mufo Ka",
    // ... all other twi translations
  },
  nafana: {
    title: "Kuo Tuma",
    memberDues: "Nεrε Sika",
    // ... all other nafana translations
  },
  fr: {
    title: "Services Coopératifs",
    memberDues: "Cotisations Membres",
    // ... all other fr translations
  },
};

export function CooperativeServicesSection({ language, userRole }: CooperativeServicesProps) {
  const t = translations[language];

  // --- MOCK DATA ---
  const farmerData = {
    dues: { paid: 8, total: 12, amount: 10, progress: 67 },
    benefits: [
      { icon: Gift, name: t.seedSpray, status: "received", value: "50 GHS" },
      { icon: Wrench, name: t.laborSupport, status: "available", value: "2 days" },
      { icon: Truck, name: t.transport, status: "scheduled", value: "Next week" },
    ],
    schoolSupport: [
      { icon: BookOpen, name: t.textbooks, status: "received", value: "3 books" },
    ],
    incentives: [
      { name: t.earlyHarvest, progress: 85, target: "Harvest by Oct 15" },
      { name: t.qualityBonus, progress: 92, target: "Grade A quality" },
    ],
  };

  const leaderData = {
    duesCollectedPercent: 85,
    benefitsDistributedCount: 42,
    duesSummary: {
        expected: "480 GHS",
        collected: "408 GHS",
        outstanding: "72 GHS",
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "received": return <Badge className="bg-green-500">Received</Badge>;
      case "available": return <Badge variant="outline" className="text-blue-600 border-blue-600">Available</Badge>;
      case "scheduled": return <Badge variant="outline" className="text-orange-600 border-orange-600">Scheduled</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  // --- ROLE-SPECIFIC RENDER LOGIC ---

  const FarmerView = () => (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Member Dues */}
      <Card>
        <CardHeader>
          <CardTitle>{t.memberDues}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-2xl font-bold">{farmerData.dues.amount} {t.ghsMonth}</div>
          <p className="text-sm text-muted-foreground">{farmerData.dues.paid} of {farmerData.dues.total} months paid</p>
          <Progress value={farmerData.dues.progress} />
          <Button className="w-full">{t.payDues}</Button>
        </CardContent>
      </Card>

      {/* Benefits Provided */}
      <Card>
        <CardHeader>
          <CardTitle>{t.benefits}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {farmerData.benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3"><Icon className="h-4 w-4 text-muted-foreground" /> <span className="font-medium">{benefit.name}</span></div>
                {getStatusBadge(benefit.status)}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Incentive Tracker */}
       <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{t.incentives}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {farmerData.incentives.map((incentive, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>{incentive.name}</span>
                <span>{incentive.progress}%</span>
              </div>
              <Progress value={incentive.progress} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const LeaderView = () => (
    <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.duesCollected}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaderData.duesCollectedPercent}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.benefitsDistributed}</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaderData.benefitsDistributedCount}</div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t.memberDuesSummary}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <Progress value={leaderData.duesCollectedPercent} />
             <div className="flex justify-between text-sm">
                <span>Collected: <span className="font-bold">{leaderData.duesSummary.collected}</span></span>
                <span>Outstanding: <span className="font-bold">{leaderData.duesSummary.outstanding}</span></span>
             </div>
          </CardContent>
        </Card>
    </div>
  );

  // --- MAIN RENDER ---
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">{t.title}</h2>
      </div>
      
      {/* Conditional rendering based on the userRole prop */}
      {userRole === 'farmer' && <FarmerView />}
      {(userRole === 'coop-leader' || userRole === 'admin') && <LeaderView />}
    </div>
  );
}

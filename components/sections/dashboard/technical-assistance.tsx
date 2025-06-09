// components/sections/dashboard/technical-assistance.tsx
"use client";

import React from 'react';
import { MessageCircle, AlertCircle, Calendar, Users } from "lucide-react";

// CORRECTED: Importing UI components from the central library
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// CORRECTED: Importing shared types from the central types file
import type { Language, UserRole } from "@/lib/types";

// Props for the component
interface TechnicalAssistanceProps {
  language: Language;
  userRole: UserRole;
}

// Translations specific to this section, with placeholders for all languages.
const translations: Record<Language, any> = {
  en: {
    title: "Technical Assistance",
    askExtensionWorker: "Ask Extension Worker",
    recentVisits: "Recent Visits",
    helpRequests: "Help Requests",
    alerts: "Alerts & Recommendations",
    pending: "Pending",
    resolved: "Resolved",
    urgent: "Urgent",
    scheduled: "Scheduled",
    viewDetails: "View Details",
    newRequest: "New Request",
    farmerRequests: "Farmer Help Requests",
  },
  twi: {
    title: "Mmoa Teknikal",
    //... other twi translations
  },
  nafana: {
    title: "Teknikal Dεmε",
    //... other nafana translations
  },
  fr: {
    title: "Assistance Technique",
    askExtensionWorker: "Demander Agent Vulgarisation",
    //... other fr translations
  },
};

export function TechnicalAssistanceSection({ language, userRole }: TechnicalAssistanceProps) {
  const t = translations[language];

  // --- MOCK DATA ---
  const farmerData = {
    helpRequests: [
      { id: 1, title: "Cashew leaves turning yellow", status: "pending", priority: "urgent", date: "2024-01-15", extensionWorker: "John Mensah" },
      { id: 2, title: "Best time for pruning?", status: "resolved", priority: "normal", date: "2024-01-10", extensionWorker: "Mary Asante" },
    ],
    recentVisits: [
      { id: 1, extensionWorker: "John Mensah", date: "2024-01-12", topic: "Organic pest management training" },
    ],
    alerts: [
      { id: 1, type: "warning", title: "Low yield detected", message: "Your yield is 15% below average.", date: "2024-01-14" },
    ],
  };

  const extensionWorkerData = {
    requests: [
        { farmer: "Kwame Asante", issue: "Cashew leaves yellowing", priority: "urgent" },
        { farmer: "Ama Osei", issue: "Pest control advice", priority: "normal" },
    ]
  }

  // --- HELPER FUNCTIONS ---
  const getStatusBadge = (status: string, priority: string) => {
    if (status === "pending" && priority === "urgent") return <Badge variant="destructive">{t.urgent}</Badge>;
    if (status === "resolved") return <Badge className="bg-green-500">{t.resolved}</Badge>;
    if (status === "scheduled") return <Badge variant="secondary">{t.scheduled}</Badge>;
    return <Badge variant="outline">{t.pending}</Badge>;
  };

  // --- ROLE-SPECIFIC RENDER LOGIC ---
  const FarmerView = () => (
    <>
      <Card>
        <CardContent className="p-4">
          <Button className="w-full h-16 text-lg"><MessageCircle className="h-6 w-6 mr-3" />{t.askExtensionWorker}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.helpRequests}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {farmerData.helpRequests.map((request) => (
            <div key={request.id} className="border rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold">{request.title}</p>
                {getStatusBadge(request.status, request.priority)}
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{request.extensionWorker}</span>
                <span>{request.date}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
  
  const ExtensionWorkerView = () => (
    <Card>
      <CardHeader>
        <CardTitle>{t.farmerRequests}</CardTitle>
        <CardDescription>Review and respond to help requests from your assigned farmers.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Farmer</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {extensionWorkerData.requests.map((request) => (
                <TableRow key={request.farmer}>
                    <TableCell className="font-medium">{request.farmer}</TableCell>
                    <TableCell>{request.issue}</TableCell>
                    <TableCell><Badge variant={request.priority === 'urgent' ? 'destructive' : 'secondary'}>{request.priority}</Badge></TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  // --- MAIN RENDER ---
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">{t.title}</h2>
      </div>

      {userRole === 'farmer' && <FarmerView />}
      {(userRole === 'extension-worker' || userRole === 'coop-leader' || userRole === 'admin') && <ExtensionWorkerView />}
    </div>
  );
}

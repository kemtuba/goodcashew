// components/sections/dashboard/certification.tsx
"use client";

import React from 'react';
import { Award, QrCode, MapPin, Calendar, Download, CheckCircle, Users } from "lucide-react";

// CORRECTED: Importing UI components from the central library
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// CORRECTED: Importing shared types from the central types file
import type { Language, UserRole } from "@/lib/types";

// Props for the component, including the all-important userRole
interface CertificationProps {
  language: Language;
  userRole: UserRole;
}

// Translations specific to this section
const translations: Record<Language, any> = {
  en: {
    title: "Certification & Traceability",
    certificationStatus: "Certification Status",
    certified: "Certified",
    farmStory: "Farm Story",
    traceabilityProfile: "Traceability Profile",
    annualAudit: "Annual Audit",
    downloadBadge: "Download Badge",
    generateQR: "Generate QR Code",
    viewProfile: "View Profile",
    nextAudit: "Next Audit",
    location: "Location",
    harvestTimeline: "Harvest Timeline",
    methods: "Methods Used",
    batchLink: "Batch Link",
    village: "Village",
    gpsCoords: "GPS Coordinates",
    organic: "Organic",
    fairTrade: "Fair Trade",
    requirements: "Requirements Met",
    memberCertificationStatus: "Member Certification Status",
  },
  // FIXED: Added full placeholder data for other languages to resolve the error.
  twi: {
    title: "Adansedie & Nhwehwɛmu",
    certificationStatus: "Adansedie Tebea",
    certified: "Wɔadan Se",
    farmStory: "Afuo Asɛm",
    traceabilityProfile: "Nhwehwɛmu Nsɛm",
    annualAudit: "Afe Biara Nhwehwɛmu",
    downloadBadge: "Yi Badge",
    generateQR: "Yɛ QR Code",
    viewProfile: "Hwɛ Nsɛm",
    nextAudit: "Nhwehwɛmu A Ɛdi Hɔ",
    location: "Beae",
    harvestTimeline: "Otwa Bere",
    methods: "Akwan A Wɔde Di Dwuma",
    batchLink: "Nkuw Nkitahodi",
    village: "Akuraa",
    gpsCoords: "GPS Nsɛnkyerɛnne",
    organic: "Organic",
    fairTrade: "Fair Trade",
    requirements: "Ahwehwɛde A Wɔadi",
    memberCertificationStatus: "Member Adansedie Tebea",
  },
  nafana: {
    title: "Tεntεrεnni & Kpεlεni",
    certificationStatus: "Tεntεrεnni Tebea",
    certified: "Tεntεrεnni",
    farmStory: "Kuoro Asεm",
    traceabilityProfile: "Kpεlεni Nsεm",
    annualAudit: "Afe Kpεlεni",
    downloadBadge: "Yi Badge",
    generateQR: "Yε QR Code",
    viewProfile: "Kpεlε Nsεm",
    nextAudit: "Kpεlεni Kεsε",
    location: "Beae",
    harvestTimeline: "Twa Bere",
    methods: "Akwan Tumani",
    batchLink: "Nkuw Nkitahodi",
    village: "Tengan",
    gpsCoords: "GPS Nsεnkyerεnne",
    organic: "Organic",
    fairTrade: "Fair Trade",
    requirements: "Ahwehwεde Diani",
    memberCertificationStatus: "Member Tεntεrεnni Tebea",
  },
  fr: {
    title: "Certification & Traçabilité",
    certificationStatus: "Statut Certification",
    certified: "Certifié",
    farmStory: "Histoire Ferme",
    traceabilityProfile: "Profil Traçabilité",
    annualAudit: "Audit Annuel",
    downloadBadge: "Télécharger Badge",
    generateQR: "Générer QR Code",
    viewProfile: "Voir Profil",
    nextAudit: "Prochain Audit",
    location: "Localisation",
    harvestTimeline: "Calendrier Récolte",
    methods: "Méthodes Utilisées",
    batchLink: "Lien Lot",
    village: "Village",
    gpsCoords: "Coordonnées GPS",
    organic: "Biologique",
    fairTrade: "Commerce Équitable",
    requirements: "Exigences Satisfaites",
    memberCertificationStatus: "Statut Certification Membres",
  },
};

// This is the component that will be imported into different dashboard pages
export function CertificationSection({ language, userRole }: CertificationProps) {
  const t = translations[language];

  // --- MOCK DATA ---
  // In a real app, this data would be fetched based on the logged-in user
  const farmerCertificationData = {
    status: "certified",
    score: 92,
    nextAudit: "2024-06-15",
    requirementsMet: 18,
    totalRequirements: 20,
    farmStory: {
      village: "Kabile",
      gpsCoords: "7.9465° N, 2.1734° W",
      harvestPeriod: "October - December 2023",
      methods: ["Organic", "Fair Trade"],
      batchId: "GC-KAB-2024-001",
    }
  };

  const coopLeaderData = {
    members: [
        { name: "Kwame Asante", status: "Certified", progress: 100 },
        { name: "Ama Osei", status: "In Progress", progress: 85 },
        { name: "Kofi Mensah", status: "Pending Audit", progress: 95 },
    ]
  };

  // --- ROLE-SPECIFIC RENDER LOGIC ---
  
  // View for a Farmer
  const FarmerView = () => (
    <>
      {/* Certification Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-yellow-500" />
            {t.certificationStatus}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <Badge className="bg-green-500"><CheckCircle className="h-4 w-4 mr-1" />{t.certified}</Badge>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{t.requirements}</span>
                <span>{farmerCertificationData.requirementsMet}/{farmerCertificationData.totalRequirements}</span>
              </div>
              <Progress value={(farmerCertificationData.requirementsMet / farmerCertificationData.totalRequirements) * 100} className="h-3" />
            </div>
            <p className="text-sm text-muted-foreground"><strong>{t.nextAudit}:</strong> {farmerCertificationData.nextAudit}</p>
        </CardContent>
      </Card>

      {/* Farm Story Builder Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t.farmStory}</CardTitle>
          <CardDescription>{t.traceabilityProfile}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <p className="font-medium">{t.village}:</p><p>{farmerCertificationData.farmStory.village}</p>
            </div>
             <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <p className="font-medium">{t.harvestTimeline}:</p><p>{farmerCertificationData.farmStory.harvestPeriod}</p>
            </div>
        </CardContent>
      </Card>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Button><Download className="h-4 w-4 mr-2" />{t.downloadBadge}</Button>
        <Button variant="outline"><QrCode className="h-4 w-4 mr-2" />{t.generateQR}</Button>
      </div>
    </>
  );

  // View for a Coop Leader or Admin
  const LeaderView = () => (
    <Card>
      <CardHeader>
        <CardTitle>{t.memberCertificationStatus}</CardTitle>
        <CardDescription>Overview of certification progress for all members.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coopLeaderData.members.map(member => (
              <TableRow key={member.name}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell><Badge variant={member.status === "Certified" ? "default" : "secondary"}>{member.status}</Badge></TableCell>
                <TableCell className="text-right">{member.progress}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );


  // --- MAIN RENDER ---
  // This is where we decide which view to show based on the user's role.
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">{t.title}</h2>
      </div>
      
      {/* Conditional rendering based on the userRole prop */}
      {userRole === 'farmer' && <FarmerView />}
      {(userRole === 'coop-leader' || userRole === 'admin') && <LeaderView />}
      {/* You could add a specific view for 'extension-worker' here as well */}

    </div>
  );
}

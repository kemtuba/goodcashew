"use client"

import { Package, Award, FileText, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/pages/components/ui/card"
import { Button } from "@/app/pages/components/ui/button"
import { Badge } from "@/app/pages/components/ui/badge"
import type { Language } from "../../app"

interface RetailerDashboardProps {
  language: Language
}

const translations = {
  en: {
    welcome: "Welcome, Retailer",
    traceabilityScore: "Traceability Score",
    certifiedBatches: "Certified Batches",
    auditReports: "Audit Reports",
    esgScore: "ESG Score",
    recentBatches: "Recent Batches",
    downloadAudit: "Download Audit",
    viewTraceability: "View Traceability",
    excellent: "Excellent",
    good: "Good",
  },
  twi: {
    welcome: "Akwaaba, Detɔnfo",
    traceabilityScore: "Nhwehwɛmu Akontabuo",
    certifiedBatches: "Adansedie Nkuw",
    auditReports: "Audit Amanneɛbɔ",
    esgScore: "ESG Akontabuo",
    recentBatches: "Nkuw A Aba",
    downloadAudit: "Yi Audit",
    viewTraceability: "Hwɛ Nhwehwɛmu",
    excellent: "Ɛyɛ Papa",
    good: "Ɛyɛ",
  },
  fr: {
    welcome: "Bienvenue, Détaillant",
    traceabilityScore: "Score Traçabilité",
    certifiedBatches: "Lots Certifiés",
    auditReports: "Rapports d'Audit",
    esgScore: "Score ESG",
    recentBatches: "Lots Récents",
    downloadAudit: "Télécharger Audit",
    viewTraceability: "Voir Traçabilité",
    excellent: "Excellent",
    good: "Bon",
  },
}

export function RetailerDashboard({ language }: RetailerDashboardProps) {
  const t = translations[language]

  const recentBatches = [
    { id: "GC-2024-001", farms: 12, weight: "2,450 kg", certification: "Organic", traceability: 95 },
    { id: "GC-2024-002", farms: 8, weight: "1,680 kg", certification: "Fair Trade", traceability: 88 },
    { id: "GC-2024-003", farms: 15, weight: "3,200 kg", certification: "Organic", traceability: 92 },
  ]

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-orange-600">{t.welcome}</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">92%</div>
            <div className="text-sm text-gray-600">{t.traceabilityScore}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">24</div>
            <div className="text-sm text-gray-600">{t.certifiedBatches}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-gray-600">{t.auditReports}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">89%</div>
            <div className="text-sm text-gray-600">{t.esgScore}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Batches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6 text-green-500" />
            {t.recentBatches}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentBatches.map((batch) => (
            <div key={batch.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{batch.id}</h4>
                  <p className="text-sm text-gray-600">
                    {batch.farms} farms • {batch.weight}
                  </p>
                </div>
                <Badge variant="secondary">{batch.certification}</Badge>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm">Traceability: {batch.traceability}%</span>
                <Badge variant={batch.traceability >= 90 ? "default" : "secondary"}>
                  {batch.traceability >= 90 ? t.excellent : t.good}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  {t.viewTraceability}
                </Button>
                <Button size="sm" className="flex-1">
                  {t.downloadAudit}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

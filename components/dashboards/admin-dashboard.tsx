"use client"

import { Users, TrendingUp, MapPin, Download, BarChart3, School } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Language } from "../../app"

interface AdminDashboardProps {
  language: Language
}

const translations = {
  en: {
    welcome: "Admin Dashboard",
    totalMembers: "Total Members",
    participationRate: "Participation Rate",
    dataExports: "Data Exports",
    onboardingSupport: "Onboarding Support",
    schoolOperations: "School Operations",
    aggregatedMetrics: "Aggregated Metrics",
    exportData: "Export Data",
    viewMap: "View Participation Map",
    supportFarmers: "Support New Farmers",
    scheduleEvent: "Schedule School Event",
    activeSchools: "Active Schools",
    totalProduction: "Total Production",
    certificationRate: "Certification Rate",
  },
  twi: {
    welcome: "Ɔhwɛfo Dashboard",
    totalMembers: "Mufo Dodow",
    participationRate: "Nkɔmmɔ Dodow",
    dataExports: "Data Yi",
    onboardingSupport: "Mmoa Foforɔ",
    schoolOperations: "Sukuu Nnwuma",
    aggregatedMetrics: "Nsɛm Nyinaa",
    exportData: "Yi Data",
    viewMap: "Hwɛ Nkɔmmɔ Map",
    supportFarmers: "Boa Akuafo Foforɔ",
    scheduleEvent: "Hyɛ Sukuu Dwuma",
    activeSchools: "Sukuu A Ɛyɛ Adwuma",
    totalProduction: "Nnɔbae Nyinaa",
    certificationRate: "Adansedie Dodow",
  },
  nafana: {
    welcome: "Yεlεni Dashboard",
    totalMembers: "Nεrε Dodow",
    participationRate: "Nkɔmmɔ Dodow",
    dataExports: "Data Yi",
    onboardingSupport: "Dεmε Foforɔ",
    schoolOperations: "Sukuu Tuma",
    aggregatedMetrics: "Nsεm Nyinaa",
    exportData: "Yi Data",
    viewMap: "Kpεlε Nkɔmmɔ Map",
    supportFarmers: "Dεmε Kuoro Foforɔ",
    scheduleEvent: "Hyε Sukuu Tuma",
    activeSchools: "Sukuu Tumani",
    totalProduction: "Yεlε Nyinaa",
    certificationRate: "Tεntεrεnni Dodow",
  },
  fr: {
    welcome: "Tableau de Bord Admin",
    totalMembers: "Total Membres",
    participationRate: "Taux Participation",
    dataExports: "Exports Données",
    onboardingSupport: "Support Intégration",
    schoolOperations: "Opérations École",
    aggregatedMetrics: "Métriques Agrégées",
    exportData: "Exporter Données",
    viewMap: "Voir Carte Participation",
    supportFarmers: "Soutenir Nouveaux Agriculteurs",
    scheduleEvent: "Programmer Événement École",
    activeSchools: "Écoles Actives",
    totalProduction: "Production Totale",
    certificationRate: "Taux Certification",
  },
}

export function AdminDashboard({ language }: AdminDashboardProps) {
  const t = translations[language]

  const metrics = [
    { label: t.totalMembers, value: "48", icon: Users, color: "text-blue-500" },
    { label: t.activeSchools, value: "3", icon: School, color: "text-green-500" },
    { label: t.totalProduction, value: "12.4T", icon: TrendingUp, color: "text-purple-500" },
    { label: t.certificationRate, value: "73%", icon: BarChart3, color: "text-orange-500" },
  ]

  const schoolOperations = [
    { school: "Kabile Primary", members: 18, lastEvent: "Seed Distribution", nextEvent: "Training Session" },
    { school: "Banda Primary", members: 15, lastEvent: "Tool Distribution", nextEvent: "Harvest Planning" },
    { school: "Wenchi Primary", members: 15, lastEvent: "Training Session", nextEvent: "Quality Assessment" },
  ]

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">{t.welcome}</h2>
        <p className="text-gray-600">GoodCashew Program Overview</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <Icon className={`h-8 w-8 ${metric.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Participation Rate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-500" />
            {t.participationRate}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Training Attendance</span>
                <span>87%</span>
              </div>
              <Progress value={87} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Dues Payment</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Data Reporting</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* School Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-6 w-6 text-green-500" />
            {t.schoolOperations}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {schoolOperations.map((school, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{school.school}</h4>
                <span className="text-sm text-gray-600">{school.members} members</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Last: {school.lastEvent}</p>
                <p>Next: {school.nextEvent}</p>
              </div>
              <Button size="sm" className="mt-2 w-full">
                {t.scheduleEvent}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4">
        <Button className="h-16 flex items-center justify-center gap-3">
          <Download className="h-6 w-6" />
          <span className="text-lg">{t.exportData}</span>
        </Button>

        <Button variant="outline" className="h-16 flex items-center justify-center gap-3">
          <MapPin className="h-6 w-6" />
          <span className="text-lg">{t.viewMap}</span>
        </Button>

        <Button variant="outline" className="h-16 flex items-center justify-center gap-3">
          <Users className="h-6 w-6" />
          <span className="text-lg">{t.supportFarmers}</span>
        </Button>
      </div>
    </div>
  )
}

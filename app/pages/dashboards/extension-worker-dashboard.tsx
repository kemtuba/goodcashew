"use client"

import { Users, MapPin, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/pages/components/ui/card"
import { Button } from "@/app/pages/components/ui/button"
import { Badge } from "@/app/pages/components/ui/badge"
import type { Language } from "../../app"

interface ExtensionWorkerDashboardProps {
  language: Language
}

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
    pendingVisits: "Nsra A Ɛretwɛn",
    moduleFollowUps: "Adesua A Ɛsɛ Sɛ Wodi Akyi",
    recentActivity: "Nneyɛe A Aba",
    scheduleVisit: "Hyɛ Nsra",
    viewFarmer: "Hwɛ Okuafo",
    urgent: "Ɛho Hia",
  },
  fr: {
    welcome: "Bienvenue, Agent de Vulgarisation",
    assignedFarmers: "Agriculteurs Assignés",
    pendingVisits: "Visites en Attente",
    moduleFollowUps: "Suivis de Module Requis",
    recentActivity: "Activité Récente",
    scheduleVisit: "Programmer Visite",
    viewFarmer: "Voir Agriculteur",
    urgent: "Urgent",
  },
}

export function ExtensionWorkerDashboard({ language }: ExtensionWorkerDashboardProps) {
  const t = translations[language]

  const assignedFarmers = [
    { id: 1, name: "Kwame Asante", location: "Brong Ahafo", status: "active", lastVisit: "2024-01-10" },
    { id: 2, name: "Ama Osei", location: "Ashanti", status: "needs-visit", lastVisit: "2023-12-15" },
    { id: 3, name: "Kofi Mensah", location: "Eastern", status: "active", lastVisit: "2024-01-08" },
  ]

  const moduleFollowUps = [
    { farmer: "Kwame Asante", module: "Week 7: Pest Identification", priority: "urgent" },
    { farmer: "Ama Osei", module: "Week 4: Planting Techniques", priority: "normal" },
    { farmer: "Kofi Mensah", module: "Week 2: Organic Preparation", priority: "normal" },
  ]

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-600">{t.welcome}</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">15</div>
            <div className="text-sm text-gray-600">{t.assignedFarmers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-gray-600">{t.pendingVisits}</div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Farmers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-500" />
            {t.assignedFarmers}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {assignedFarmers.map((farmer) => (
            <div key={farmer.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{farmer.name}</h4>
                  <p className="text-sm text-gray-600">{farmer.location}</p>
                </div>
                <Badge variant={farmer.status === "needs-visit" ? "destructive" : "default"}>
                  {farmer.status === "needs-visit" ? t.urgent : "Active"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Last visit: {farmer.lastVisit}</span>
                <div className="space-x-2">
                  <Button size="sm" variant="outline">
                    {t.viewFarmer}
                  </Button>
                  <Button size="sm">{t.scheduleVisit}</Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Module Follow-ups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            {t.moduleFollowUps}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {moduleFollowUps.map((followUp, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{followUp.farmer}</h4>
                  <p className="text-sm text-gray-600">{followUp.module}</p>
                </div>
                <Badge variant={followUp.priority === "urgent" ? "destructive" : "secondary"}>
                  {followUp.priority === "urgent" ? t.urgent : "Normal"}
                </Badge>
              </div>
              <Button size="sm" className="w-full">
                Schedule Follow-up
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

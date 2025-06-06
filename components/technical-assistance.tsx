"use client"

import { MessageCircle, AlertCircle, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Language, UserRole } from "../app"

interface TechnicalAssistanceProps {
  language: Language
  userRole: UserRole
}

const translations = {
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
  },
  twi: {
    title: "Mmoa Teknikal",
    askExtensionWorker: "Bisa Mmoa Adwumayɛfo",
    recentVisits: "Nsra A Aba",
    helpRequests: "Mmoa Abisade",
    alerts: "Kɔkɔbɔ & Akwankyerɛ",
    pending: "Ɛretwɛn",
    resolved: "Asiesie",
    urgent: "Ɛho Hia",
    scheduled: "Wɔahyɛ",
    viewDetails: "Hwɛ Nsɛm",
    newRequest: "Abisade Foforɔ",
  },
  fr: {
    title: "Assistance Technique",
    askExtensionWorker: "Demander Agent Vulgarisation",
    recentVisits: "Visites Récentes",
    helpRequests: "Demandes d'Aide",
    alerts: "Alertes & Recommandations",
    pending: "En Attente",
    resolved: "Résolu",
    urgent: "Urgent",
    scheduled: "Programmé",
    viewDetails: "Voir Détails",
    newRequest: "Nouvelle Demande",
  },
}

export function TechnicalAssistance({ language, userRole }: TechnicalAssistanceProps) {
  const t = translations[language]

  const helpRequests = [
    {
      id: 1,
      title: "Cashew leaves turning yellow",
      status: "pending",
      priority: "urgent",
      date: "2024-01-15",
      extensionWorker: "John Mensah",
    },
    {
      id: 2,
      title: "Best time for pruning?",
      status: "resolved",
      priority: "normal",
      date: "2024-01-10",
      extensionWorker: "Mary Asante",
    },
    {
      id: 3,
      title: "Pest control advice needed",
      status: "scheduled",
      priority: "normal",
      date: "2024-01-08",
      extensionWorker: "John Mensah",
    },
  ]

  const recentVisits = [
    {
      id: 1,
      extensionWorker: "John Mensah",
      date: "2024-01-12",
      topic: "Organic pest management training",
      notes: "Demonstrated neem oil application. Follow up in 2 weeks.",
    },
    {
      id: 2,
      extensionWorker: "Mary Asante",
      date: "2024-01-05",
      topic: "Soil health assessment",
      notes: "Soil pH is good. Recommended organic compost application.",
    },
  ]

  const alerts = [
    {
      id: 1,
      type: "warning",
      title: "Low yield detected",
      message: "Your yield is 15% below average. Review Module 10: Fertilizer Application",
      date: "2024-01-14",
    },
    {
      id: 2,
      type: "info",
      title: "Seasonal reminder",
      message: "Pruning season starts next month. Prepare your tools.",
      date: "2024-01-13",
    },
  ]

  const getStatusBadge = (status: string, priority: string) => {
    if (status === "pending" && priority === "urgent") {
      return <Badge variant="destructive">{t.urgent}</Badge>
    }
    if (status === "resolved") {
      return (
        <Badge variant="default" className="bg-green-500">
          {t.resolved}
        </Badge>
      )
    }
    if (status === "scheduled") {
      return <Badge variant="secondary">{t.scheduled}</Badge>
    }
    return <Badge variant="outline">{t.pending}</Badge>
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600">{t.title}</h2>
      </div>

      {/* Quick Action */}
      {userRole === "farmer" && (
        <Card>
          <CardContent className="p-4">
            <Button className="w-full h-16 flex flex-col gap-2">
              <MessageCircle className="h-8 w-8" />
              <span className="text-lg">{t.askExtensionWorker}</span>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Help Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-blue-500" />
            {t.helpRequests}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {helpRequests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{request.title}</h4>
                {getStatusBadge(request.status, request.priority)}
              </div>
              <p className="text-sm text-gray-600 mb-2">Extension Worker: {request.extensionWorker}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{request.date}</span>
                <Button size="sm" variant="outline">
                  {t.viewDetails}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Visits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-green-500" />
            {t.recentVisits}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentVisits.map((visit) => (
            <div key={visit.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{visit.topic}</h4>
                <span className="text-xs text-gray-500">{visit.date}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">By: {visit.extensionWorker}</p>
              <p className="text-sm bg-gray-50 p-2 rounded">{visit.notes}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-orange-500" />
            {t.alerts}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border-l-4 p-4 rounded-r-lg ${
                alert.type === "warning" ? "border-orange-400 bg-orange-50" : "border-blue-400 bg-blue-50"
              }`}
            >
              <h4 className="font-semibold mb-1">{alert.title}</h4>
              <p className="text-sm mb-2">{alert.message}</p>
              <span className="text-xs text-gray-500">{alert.date}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

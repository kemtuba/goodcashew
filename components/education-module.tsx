"use client"

import { CheckCircle, Clock, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Language, UserRole } from "../app"

interface EducationModuleProps {
  language: Language
  userRole: UserRole
}

const translations = {
  en: {
    title: "Education Modules",
    week: "Week",
    completed: "Completed",
    inProgress: "In Progress",
    notStarted: "Not Started",
    extensionRequired: "Extension Follow-up Required",
    startModule: "Start Module",
    continueModule: "Continue Module",
    reviewModule: "Review Module",
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
  },
}

const modules = [
  { week: 1, title: "Introduction to GoodCashew", status: "completed", extensionRequired: false },
  { week: 2, title: "Organic Preparation", status: "completed", extensionRequired: true },
  { week: 3, title: "Soil Health Assessment", status: "completed", extensionRequired: false },
  { week: 4, title: "Planting Techniques", status: "completed", extensionRequired: true },
  { week: 5, title: "Water Management", status: "completed", extensionRequired: false },
  { week: 6, title: "Pruning Basics", status: "completed", extensionRequired: false },
  { week: 7, title: "Pest Identification", status: "completed", extensionRequired: true },
  { week: 8, title: "Organic Pest Management", status: "in-progress", extensionRequired: false },
  { week: 9, title: "Disease Prevention", status: "not-started", extensionRequired: true },
  { week: 10, title: "Fertilizer Application", status: "not-started", extensionRequired: false },
  { week: 11, title: "Harvesting Timing", status: "not-started", extensionRequired: true },
  { week: 12, title: "Post-Harvest Handling", status: "not-started", extensionRequired: false },
  { week: 13, title: "Quality Control", status: "not-started", extensionRequired: true },
  { week: 14, title: "Storage Techniques", status: "not-started", extensionRequired: false },
  { week: 15, title: "Processing Basics", status: "not-started", extensionRequired: false },
  { week: 16, title: "Market Preparation", status: "not-started", extensionRequired: true },
  { week: 17, title: "Cooperative Benefits", status: "not-started", extensionRequired: false },
  { week: 18, title: "Record Keeping", status: "not-started", extensionRequired: false },
  { week: 19, title: "Financial Planning", status: "not-started", extensionRequired: true },
  { week: 20, title: "Certification Process", status: "not-started", extensionRequired: true },
  { week: 21, title: "Sustainability Practices", status: "not-started", extensionRequired: false },
  { week: 22, title: "Climate Adaptation", status: "not-started", extensionRequired: false },
  { week: 23, title: "Biodiversity Conservation", status: "not-started", extensionRequired: false },
  { week: 24, title: "Community Engagement", status: "not-started", extensionRequired: false },
  { week: 25, title: "Technology Integration", status: "not-started", extensionRequired: true },
  { week: 26, title: "Advanced Techniques", status: "not-started", extensionRequired: true },
  { week: 27, title: "Troubleshooting", status: "not-started", extensionRequired: true },
  { week: 28, title: "Graduation & Next Steps", status: "not-started", extensionRequired: true },
]

export function EducationModule({ language, userRole }: EducationModuleProps) {
  const t = translations[language]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "in-progress":
        return <Clock className="h-6 w-6 text-blue-500" />
      default:
        return <Clock className="h-6 w-6 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return t.completed
      case "in-progress":
        return t.inProgress
      default:
        return t.notStarted
    }
  }

  const getButtonText = (status: string) => {
    switch (status) {
      case "completed":
        return t.reviewModule
      case "in-progress":
        return t.continueModule
      default:
        return t.startModule
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600">{t.title}</h2>
        <p className="text-gray-600 mt-1">28-Week Curriculum</p>
      </div>

      <div className="space-y-4">
        {modules.map((module) => (
          <Card key={module.week} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(module.status)}
                  <div>
                    <CardTitle className="text-lg">
                      {t.week} {module.week}: {module.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{getStatusText(module.status)}</p>
                  </div>
                </div>
                {module.extensionRequired && userRole === "extension-worker" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Follow-up
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant={module.status === "completed" ? "outline" : "default"}
                className="w-full"
                disabled={module.status === "not-started" && module.week > 9}
              >
                {getButtonText(module.status)}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

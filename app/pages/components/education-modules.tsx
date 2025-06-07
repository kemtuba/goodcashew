"use client"

import { CheckCircle, Clock, Users, School } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/pages/components/ui/card"
import { Badge } from "@/app/pages/components/ui/badge"
import { Button } from "@/app/pages/components/ui/button"
import type { Language, UserRole } from "../app"

interface EducationModulesProps {
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
    schoolBased: "School-Based Activity",
    startModule: "Start Module",
    continueModule: "Continue Module",
    reviewModule: "Review Module",
    atSchool: "At School",
  },
  twi: {
    title: "Adesua Nhyehyɛe",
    week: "Dapɛn",
    completed: "Awie",
    inProgress: "Ɛrekɔ So",
    notStarted: "Mmfii Ase",
    extensionRequired: "Mmoa Adwumayɛfo Hia",
    schoolBased: "Sukuu Dwuma",
    startModule: "Fi Adesua Ase",
    continueModule: "Kɔ Adesua So",
    reviewModule: "San Hwɛ Adesua",
    atSchool: "Sukuu Hɔ",
  },
  nafana: {
    title: "Kalanni Yεlε",
    week: "Dapεn",
    completed: "Awie",
    inProgress: "Ɛrekɔ So",
    notStarted: "Mmfii Ase",
    extensionRequired: "Dεmε Tumani Hia",
    schoolBased: "Sukuu Tuma",
    startModule: "Fi Kalanni Ase",
    continueModule: "Kɔ Kalanni So",
    reviewModule: "San Kpεlε Kalanni",
    atSchool: "Sukuu Hɔ",
  },
  fr: {
    title: "Modules d'Éducation",
    week: "Semaine",
    completed: "Terminé",
    inProgress: "En Cours",
    notStarted: "Pas Commencé",
    extensionRequired: "Suivi Agent Requis",
    schoolBased: "Activité Scolaire",
    startModule: "Commencer Module",
    continueModule: "Continuer Module",
    reviewModule: "Revoir Module",
    atSchool: "À l'École",
  },
}

const modules = [
  { week: 1, title: "Introduction to GoodCashew", status: "completed", extensionRequired: false, schoolBased: true },
  { week: 2, title: "Organic Preparation", status: "completed", extensionRequired: true, schoolBased: false },
  { week: 3, title: "Soil Health Assessment", status: "completed", extensionRequired: false, schoolBased: true },
  { week: 4, title: "Planting Techniques", status: "completed", extensionRequired: true, schoolBased: true },
  { week: 5, title: "Water Management", status: "completed", extensionRequired: false, schoolBased: false },
  { week: 6, title: "Pruning Basics", status: "completed", extensionRequired: false, schoolBased: true },
  { week: 7, title: "Pest Identification", status: "completed", extensionRequired: true, schoolBased: false },
  { week: 8, title: "Organic Pest Management", status: "in-progress", extensionRequired: false, schoolBased: true },
  { week: 9, title: "Disease Prevention", status: "not-started", extensionRequired: true, schoolBased: false },
  { week: 10, title: "Fertilizer Application", status: "not-started", extensionRequired: false, schoolBased: true },
]

export function EducationModules({ language, userRole }: EducationModulesProps) {
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
        <p className="text-gray-600 mt-1">28-Week School-Based Curriculum</p>
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
                <div className="flex flex-col gap-1">
                  {module.extensionRequired && userRole === "extension-worker" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Follow-up
                    </Badge>
                  )}
                  {module.schoolBased && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <School className="h-3 w-3" />
                      {t.atSchool}
                    </Badge>
                  )}
                </div>
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

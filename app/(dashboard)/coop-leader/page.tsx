"use client"

import { Users, TrendingUp, Award, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/pages/components/ui/card"
import { Progress } from "@/app/pages/components/ui/progress"
import type { Language } from "../../app"

interface CoopLeaderDashboardProps {
  language: Language
}

const translations = {
  en: {
    welcome: "Welcome, Cooperative Leader",
    totalMembers: "Total Members",
    totalProduction: "Total Production (Season)",
    certificationReady: "Certification Ready",
    memberParticipation: "Member Participation",
    topPerformers: "Top Performers",
    kg: "kg",
  },
  twi: {
    welcome: "Akwaaba, Kuo Kannifo",
    totalMembers: "Mufo Dodow",
    totalProduction: "Nnɔbae Nyinaa (Bere)",
    certificationReady: "Adansedie Ahoboa",
    memberParticipation: "Mufo Nkɔmmɔ",
    topPerformers: "Adwumayɛfo Pa",
    kg: "kg",
  },
  fr: {
    welcome: "Bienvenue, Leader Coopératif",
    totalMembers: "Total Membres",
    totalProduction: "Production Totale (Saison)",
    certificationReady: "Prêt Certification",
    memberParticipation: "Participation Membres",
    topPerformers: "Meilleurs Performeurs",
    kg: "kg",
  },
}

export function CoopLeaderDashboard({ language }: CoopLeaderDashboardProps) {
  const t = translations[language]

  const topPerformers = [
    { name: "Kwame Asante", production: 450, progress: 95 },
    { name: "Ama Osei", production: 380, progress: 88 },
    { name: "Kofi Mensah", production: 320, progress: 82 },
  ]

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-600">{t.welcome}</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">48</div>
            <div className="text-sm text-gray-600">{t.totalMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">12,450</div>
            <div className="text-sm text-gray-600">
              {t.totalProduction} {t.kg}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">35</div>
            <div className="text-sm text-gray-600">{t.certificationReady}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">87%</div>
            <div className="text-sm text-gray-600">{t.memberParticipation}</div>
          </CardContent>
        </Card>
      </div>

      {/* Member Participation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-500" />
            {t.memberParticipation}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Training Completion</span>
                <span>87%</span>
              </div>
              <Progress value={87} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Production Reporting</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Certification Process</span>
                <span>73%</span>
              </div>
              <Progress value={73} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-yellow-500" />
            {t.topPerformers}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topPerformers.map((performer, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{performer.name}</h4>
                <span className="text-sm font-medium">
                  {performer.production} {t.kg}
                </span>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Training Progress</span>
                  <span>{performer.progress}%</span>
                </div>
                <Progress value={performer.progress} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

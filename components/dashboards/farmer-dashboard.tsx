"use client"

import { TrendingUp, AlertTriangle, BookOpen, DollarSign, School } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Language } from "../../app"

interface FarmerDashboardProps {
  language: Language
}

const translations = {
  en: {
    welcome: "Welcome back",
    currentSeason: "Current Season Yield",
    kg: "kg",
    trainingProgress: "Training Progress",
    cooperativeDues: "Cooperative Dues",
    pestAlerts: "Pest Alerts",
    nextSchoolEvent: "Next School Event",
    incentiveEarned: "Incentive Earned",
    duesPaid: "Dues Paid",
    ghsMonth: "GHS/month",
    viewDetails: "View Details",
    payDues: "Pay Dues",
    seedDistribution: "Seed Distribution",
    tuesday: "Tuesday",
    kabile: "Kabile School",
  },
  twi: {
    welcome: "Akwaaba",
    currentSeason: "Afe Yi Nnɔbae",
    kg: "kg",
    trainingProgress: "Adesua Nkɔso",
    cooperativeDues: "Kuo Ka",
    pestAlerts: "Mmoawa Ho Kɔkɔbɔ",
    nextSchoolEvent: "Sukuu Dwuma A Ɛdi Hɔ",
    incentiveEarned: "Nkuran A Woanya",
    duesPaid: "Ka A Wɔatua",
    ghsMonth: "GHS/bosome",
    viewDetails: "Hwɛ Nsɛm",
    payDues: "Tua Ka",
    seedDistribution: "Aba Nkyekyɛ",
    tuesday: "Benada",
    kabile: "Kabile Sukuu",
  },
  nafana: {
    welcome: "Bεrε",
    currentSeason: "Bεrε Cashew Yεlε",
    kg: "kg",
    trainingProgress: "Kalanni Kpεlε",
    cooperativeDues: "Kuo Sika",
    pestAlerts: "Mmoawa Kɔkɔbɔ",
    nextSchoolEvent: "Sukuu Tuma Kεsε",
    incentiveEarned: "Nkuran Nyaani",
    duesPaid: "Sika Tuani",
    ghsMonth: "GHS/bosome",
    viewDetails: "Kpεlε Nsεm",
    payDues: "Tua Sika",
    seedDistribution: "Aba Kyekyε",
    tuesday: "Talata",
    kabile: "Kabile Sukuu",
  },
  fr: {
    welcome: "Bon retour",
    currentSeason: "Rendement Saison Actuelle",
    kg: "kg",
    trainingProgress: "Progrès Formation",
    cooperativeDues: "Cotisations Coopérative",
    pestAlerts: "Alertes Parasites",
    nextSchoolEvent: "Prochain Événement École",
    incentiveEarned: "Incitation Gagnée",
    duesPaid: "Cotisations Payées",
    ghsMonth: "GHS/mois",
    viewDetails: "Voir Détails",
    payDues: "Payer Cotisations",
    seedDistribution: "Distribution Graines",
    tuesday: "Mardi",
    kabile: "École Kabile",
  },
}

export function FarmerDashboard({ language }: FarmerDashboardProps) {
  const t = translations[language]

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600">{t.welcome}</h2>
        <p className="text-gray-600">Kwame Asante</p>
      </div>

      {/* Current Season Yield */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-6 w-6 text-green-500" />
            {t.currentSeason}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">245 {t.kg}</div>
          <p className="text-sm text-gray-600 mt-1">+12% from last season</p>
          <div className="mt-3">
            <Badge className="bg-blue-100 text-blue-800">{t.incentiveEarned}: 15%</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Training Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-6 w-6 text-blue-500" />
            {t.trainingProgress}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Week 8 of 28</span>
              <span>29%</span>
            </div>
            <Progress value={29} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Cooperative Dues */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-6 w-6 text-purple-500" />
            {t.cooperativeDues}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-purple-600">10 {t.ghsMonth}</p>
              <p className="text-sm text-gray-600">{t.duesPaid}: 8/12 months</p>
            </div>
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              2 months due
            </Badge>
          </div>
          <Button className="w-full" variant="outline">
            {t.payDues}
          </Button>
        </CardContent>
      </Card>

      {/* Next School Event */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <School className="h-6 w-6 text-orange-500" />
            {t.nextSchoolEvent}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
            <h4 className="font-semibold text-orange-800">{t.seedDistribution}</h4>
            <p className="text-sm text-orange-600 mt-1">
              {t.tuesday} @ {t.kabile}
            </p>
            <Button size="sm" className="mt-2" variant="outline">
              {t.viewDetails}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pest Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            {t.pestAlerts}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <p className="text-red-800 font-medium">Cashew Stem Borer Alert</p>
            <p className="text-sm text-red-600 mt-1">Check your trees for small holes in branches</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

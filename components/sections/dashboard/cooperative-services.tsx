"use client"

import { DollarSign, Truck, BookOpen, Wrench, Gift, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/pages/components/ui/card"
import { Button } from "@/app/pages/components/ui/button"
import { Badge } from "@/app/pages/components/ui/badge"
import { Progress } from "@/app/pages/components/ui/progress"
import type { Language, UserRole } from "@/app"

interface CooperativeServicesProps {
  language: Language
  userRole: UserRole
}

const translations = {
  en: {
    title: "Cooperative Services",
    memberDues: "Member Dues",
    benefits: "Benefits Provided",
    incentives: "Incentive Tracker",
    schoolSupport: "School Support",
    payDues: "Pay Dues",
    viewBenefits: "View Benefits",
    ghsMonth: "GHS/month",
    duesPaid: "Dues Paid",
    seedSpray: "Seed & Spray",
    laborSupport: "Labor Support",
    transport: "Transport to Market",
    inputDiscounts: "Input Discounts",
    textbooks: "Textbooks",
    farmTools: "Farm Tools",
    earlyHarvest: "Early Harvest Bonus",
    qualityBonus: "Quality Bonus",
    attendanceBonus: "Training Attendance",
    totalMembers: "Total Members",
    duesCollected: "Dues Collected",
    benefitsDistributed: "Benefits Distributed",
  },
  twi: {
    title: "Kuo Nnwuma",
    memberDues: "Mufo Ka",
    benefits: "Mfaso A Wɔma",
    incentives: "Nkuran Nhwehwɛmu",
    schoolSupport: "Sukuu Mmoa",
    payDues: "Tua Ka",
    viewBenefits: "Hwɛ Mfaso",
    ghsMonth: "GHS/bosome",
    duesPaid: "Ka A Wɔatua",
    seedSpray: "Aba ne Aduru",
    laborSupport: "Adwuma Mmoa",
    transport: "Kar Kɔ Gua",
    inputDiscounts: "Nneɛma Tew",
    textbooks: "Adesua Nhoma",
    farmTools: "Kuadwuma Nnwinnade",
    earlyHarvest: "Ntɛm Otwa Akatua",
    qualityBonus: "Papa Akatua",
    attendanceBonus: "Adesua Kɔ",
    totalMembers: "Mufo Dodow",
    duesCollected: "Ka A Wɔaboa",
    benefitsDistributed: "Mfaso A Wɔakyekyɛ",
  },
  nafana: {
    title: "Kuo Tuma",
    memberDues: "Nεrε Sika",
    benefits: "Mfaso Maani",
    incentives: "Nkuran Kpεlε",
    schoolSupport: "Sukuu Dεmε",
    payDues: "Tua Sika",
    viewBenefits: "Kpεlε Mfaso",
    ghsMonth: "GHS/bosome",
    duesPaid: "Sika Tuani",
    seedSpray: "Aba ni Aduru",
    laborSupport: "Tuma Dεmε",
    transport: "Kar Kɔ Dwa",
    inputDiscounts: "Nneεma Tew",
    textbooks: "Kalanni Nhoma",
    farmTools: "Kuoro Nnwinnade",
    earlyHarvest: "Ntεm Twa Akatua",
    qualityBonus: "Papa Akatua",
    attendanceBonus: "Kalanni Kɔ",
    totalMembers: "Nεrε Dodow",
    duesCollected: "Sika Boaani",
    benefitsDistributed: "Mfaso Kyekyεani",
  },
  fr: {
    title: "Services Coopératifs",
    memberDues: "Cotisations Membres",
    benefits: "Avantages Fournis",
    incentives: "Suivi Incitations",
    schoolSupport: "Soutien École",
    payDues: "Payer Cotisations",
    viewBenefits: "Voir Avantages",
    ghsMonth: "GHS/mois",
    duesPaid: "Cotisations Payées",
    seedSpray: "Graines & Pulvérisation",
    laborSupport: "Soutien Main-d'œuvre",
    transport: "Transport au Marché",
    inputDiscounts: "Remises Intrants",
    textbooks: "Manuels Scolaires",
    farmTools: "Outils Agricoles",
    earlyHarvest: "Prime Récolte Précoce",
    qualityBonus: "Prime Qualité",
    attendanceBonus: "Assiduité Formation",
    totalMembers: "Total Membres",
    duesCollected: "Cotisations Collectées",
    benefitsDistributed: "Avantages Distribués",
  },
}

export function CooperativeServices({ language, userRole }: CooperativeServicesProps) {
  const t = translations[language]

  const benefits = [
    { icon: Gift, name: t.seedSpray, status: "received", value: "50 GHS" },
    { icon: Wrench, name: t.laborSupport, status: "available", value: "2 days" },
    { icon: Truck, name: t.transport, status: "scheduled", value: "Next week" },
    { icon: TrendingUp, name: t.inputDiscounts, status: "active", value: "15% off" },
  ]

  const schoolSupport = [
    { icon: BookOpen, name: t.textbooks, status: "received", value: "3 books" },
    { icon: Wrench, name: t.farmTools, status: "available", value: "Hoe & cutlass" },
  ]

  const incentives = [
    { name: t.earlyHarvest, progress: 85, target: "Harvest by Oct 15" },
    { name: t.qualityBonus, progress: 92, target: "Grade A quality" },
    { name: t.attendanceBonus, progress: 67, target: "80% attendance" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "received":
        return <Badge className="bg-green-500">Received</Badge>
      case "available":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Available
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            Scheduled
          </Badge>
        )
      case "active":
        return <Badge className="bg-purple-500">Active</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const renderFarmerView = () => (
    <>
      {/* Member Dues */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-6 w-6 text-purple-500" />
            {t.memberDues}
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
          <Progress value={67} className="h-3" />
          <Button className="w-full">{t.payDues}</Button>
        </CardContent>
      </Card>

      {/* Benefits Provided */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gift className="h-6 w-6 text-green-500" />
            {t.benefits}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{benefit.name}</p>
                    <p className="text-sm text-gray-600">{benefit.value}</p>
                  </div>
                </div>
                {getStatusBadge(benefit.status)}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* School Support */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-6 w-6 text-blue-500" />
            {t.schoolSupport}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {schoolSupport.map((support, index) => {
            const Icon = support.icon
            return (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{support.name}</p>
                    <p className="text-sm text-gray-600">{support.value}</p>
                  </div>
                </div>
                {getStatusBadge(support.status)}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Incentive Tracker */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-6 w-6 text-orange-500" />
            {t.incentives}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {incentives.map((incentive, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{incentive.name}</span>
                <span>{incentive.progress}%</span>
              </div>
              <Progress value={incentive.progress} className="h-2" />
              <p className="text-xs text-gray-600">{incentive.target}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  )

  const renderLeaderView = () => (
    <>
      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">85%</div>
            <div className="text-sm text-gray-600">{t.duesCollected}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Gift className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">42</div>
            <div className="text-sm text-gray-600">{t.benefitsDistributed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Member Dues Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-purple-500" />
            {t.memberDues} Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Expected</span>
              <span className="font-bold">480 GHS</span>
            </div>
            <div className="flex justify-between">
              <span>Collected</span>
              <span className="font-bold text-green-600">408 GHS</span>
            </div>
            <div className="flex justify-between">
              <span>Outstanding</span>
              <span className="font-bold text-red-600">72 GHS</span>
            </div>
            <Progress value={85} className="h-3" />
          </div>
        </CardContent>
      </Card>
    </>
  )

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600">{t.title}</h2>
      </div>

      {userRole === "farmer" ? renderFarmerView() : renderLeaderView()}
    </div>
  )
}

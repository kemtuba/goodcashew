"use client"

import { Users, Briefcase, Crown, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { UserRole, Language } from "../app"

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void
  language: Language
}

const translations = {
  en: {
    title: "Welcome to GoodCashew",
    subtitle: "Select your role to continue",
    farmer: "Farmer",
    farmerDesc: "Track your cashew production and cooperative participation",
    extensionWorker: "Extension Worker",
    extensionWorkerDesc: "Support farmers and coordinate school-based activities",
    coopLeader: "Cooperative Leader",
    coopLeaderDesc: "Manage cooperative members and school operations",
    admin: "Administrator",
    adminDesc: "Oversee program data and support onboarding",
  },
  twi: {
    title: "Akwaaba GoodCashew",
    subtitle: "Yi wo dwuma na kɔ so",
    farmer: "Okuafo",
    farmerDesc: "Hwɛ wo cashew dua no so na di kuo no mu dwuma",
    extensionWorker: "Mmoa Adwumayɛfo",
    extensionWorkerDesc: "Boa akuafo na hwɛ sukuu nnwuma so",
    coopLeader: "Kuo Kannifo",
    coopLeaderDesc: "Hwɛ kuo mufo ne sukuu nnwuma so",
    admin: "Ɔhwɛfo",
    adminDesc: "Hwɛ nhyehyɛe nsɛm ne mmoa so",
  },
  nafana: {
    title: "Bεrε GoodCashew",
    subtitle: "Tii a tuma ka kpεlε",
    farmer: "Kuoro",
    farmerDesc: "Kpεlε a cashew yεlε ni kuo tuma",
    extensionWorker: "Dεmε Tumani",
    extensionWorkerDesc: "Dεmε kuoro ni sukuu tuma kpεlε",
    coopLeader: "Kuo Yεlεni",
    coopLeaderDesc: "Kuo nεrε ni sukuu tuma kpεlε",
    admin: "Yεlεni Kεsε",
    adminDesc: "Tuma nsεm ni dεmε kpεlε",
  },
  fr: {
    title: "Bienvenue à GoodCashew",
    subtitle: "Sélectionnez votre rôle pour continuer",
    farmer: "Agriculteur",
    farmerDesc: "Suivez votre production d'anacarde et participation coopérative",
    extensionWorker: "Agent de Vulgarisation",
    extensionWorkerDesc: "Soutenez les agriculteurs et coordonnez les activités scolaires",
    coopLeader: "Leader Coopératif",
    coopLeaderDesc: "Gérez les membres de la coopérative et les opérations scolaires",
    admin: "Administrateur",
    adminDesc: "Supervisez les données du programme et l'intégration",
  },
}

export function RoleSelector({ onRoleSelect, language }: RoleSelectorProps) {
  const t = translations[language]

  const roles = [
    { key: "farmer" as UserRole, label: t.farmer, desc: t.farmerDesc, icon: Users, color: "bg-green-500" },
    {
      key: "extension-worker" as UserRole,
      label: t.extensionWorker,
      desc: t.extensionWorkerDesc,
      icon: Briefcase,
      color: "bg-blue-500",
    },
    {
      key: "coop-leader" as UserRole,
      label: t.coopLeader,
      desc: t.coopLeaderDesc,
      icon: Crown,
      color: "bg-purple-500",
    },
    {
      key: "admin" as UserRole,
      label: t.admin,
      desc: t.adminDesc,
      icon: Settings,
      color: "bg-gray-500",
    },
  ]

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-2">{t.title}</h1>
          <p className="text-gray-600 text-lg">{t.subtitle}</p>
        </div>

        <div className="space-y-4">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <Card key={role.key} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    className="w-full h-auto p-6 flex flex-col items-center gap-4"
                    onClick={() => onRoleSelect(role.key)}
                  >
                    <div className={`p-4 rounded-full ${role.color}`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900">{role.label}</h3>
                      <p className="text-sm text-gray-600 mt-1">{role.desc}</p>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

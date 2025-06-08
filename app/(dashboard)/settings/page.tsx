"use client"

import { Globe, User, Bell, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/pages/components/ui/card"
import { Button } from "@/app/pages/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/pages/components/ui/select"
import type { Language, UserRole } from "../app"

interface SettingsProps {
  language: Language
  userRole: UserRole
  onLanguageChange: (language: Language) => void
  onRoleChange: (role: UserRole) => void
}

const translations = {
  en: {
    title: "Settings",
    language: "Language",
    userRole: "User Role",
    notifications: "Notifications",
    about: "About GoodCashew",
    version: "Version 1.0.0",
    changeRole: "Change Role",
    farmer: "Farmer",
    extensionWorker: "Extension Worker",
    coopLeader: "Cooperative Leader",
    admin: "Administrator",
    english: "English",
    twi: "Twi",
    nafana: "Nafana",
    french: "French",
  },
  twi: {
    title: "Nhyehyɛe",
    language: "Kasa",
    userRole: "Dwumadi",
    notifications: "Amanneɛbɔ",
    about: "GoodCashew Ho Nsɛm",
    version: "Nkyerɛwde 1.0.0",
    changeRole: "Sesa Dwumadi",
    farmer: "Okuafo",
    extensionWorker: "Mmoa Adwumayɛfo",
    coopLeader: "Kuo Kannifo",
    admin: "Ɔhwɛfo",
    english: "Borɔfo Kasa",
    twi: "Twi",
    nafana: "Nafana",
    french: "Frɛnkye Kasa",
  },
  nafana: {
    title: "Yεlεni",
    language: "Kasa",
    userRole: "Tuma",
    notifications: "Amanneεbɔ",
    about: "GoodCashew Ho Nsεm",
    version: "Nkyerεwde 1.0.0",
    changeRole: "Sesa Tuma",
    farmer: "Kuoro",
    extensionWorker: "Dεmε Tumani",
    coopLeader: "Kuo Yεlεni",
    admin: "Yεlεni Kεsε",
    english: "Borɔfo Kasa",
    twi: "Twi",
    nafana: "Nafana",
    french: "Frεnkye Kasa",
  },
  fr: {
    title: "Paramètres",
    language: "Langue",
    userRole: "Rôle Utilisateur",
    notifications: "Notifications",
    about: "À Propos de GoodCashew",
    version: "Version 1.0.0",
    changeRole: "Changer Rôle",
    farmer: "Agriculteur",
    extensionWorker: "Agent de Vulgarisation",
    coopLeader: "Leader Coopératif",
    admin: "Administrateur",
    english: "Anglais",
    twi: "Twi",
    nafana: "Nafana",
    french: "Français",
  },
}

export function Settings({ language, userRole, onLanguageChange, onRoleChange }: SettingsProps) {
  const t = translations[language]

  const languageOptions = [
    { value: "en" as Language, label: t.english },
    { value: "twi" as Language, label: t.twi },
    { value: "nafana" as Language, label: t.nafana },
    { value: "fr" as Language, label: t.french },
  ]

  const roleOptions = [
    { value: "farmer" as UserRole, label: t.farmer },
    { value: "extension-worker" as UserRole, label: t.extensionWorker },
    { value: "coop-leader" as UserRole, label: t.coopLeader },
    { value: "admin" as UserRole, label: t.admin },
  ]

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600">{t.title}</h2>
      </div>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-500" />
            {t.language}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* User Role Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6 text-green-500" />
            {t.userRole}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            Current: <span className="font-semibold capitalize">{userRole.replace("-", " ")}</span>
          </div>
          <Select value={userRole} onValueChange={onRoleChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-orange-500" />
            {t.notifications}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>School Events</span>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Pest Alerts</span>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Training Reminders</span>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Dues Reminders</span>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-6 w-6 text-purple-500" />
            {t.about}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">GoodCashew</p>
            <p className="text-sm text-gray-600">{t.version}</p>
            <p className="text-sm text-gray-600 mt-4">
              Supporting smallholding cashew farmers through school-based cooperatives with sustainable practices,
              education, and market access.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

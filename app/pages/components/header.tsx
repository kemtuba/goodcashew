"use client"

import { useState } from "react"
import { Menu, Home, BookOpen, Wrench, Users, Award, Settings } from "lucide-react"
import { Button } from "@/app/pages/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/app/pages/components/ui/sheet"
import type { UserRole, Language, CurrentView } from "../app"

interface HeaderProps {
  language: Language
  userRole: UserRole
  currentView: CurrentView
  onViewChange: (view: CurrentView) => void
}

const translations = {
  en: {
    title: "GoodCashew",
    home: "Home",
    dashboard: "My Dashboard",
    education: "Education Modules",
    technical: "Technical Assistance",
    cooperative: "Cooperative Services",
    certification: "Certification",
    settings: "Settings",
  },
  twi: {
    title: "GoodCashew",
    home: "Fie",
    dashboard: "Me Dashboard",
    education: "Adesua Nhyehyɛe",
    technical: "Mmoa Teknikal",
    cooperative: "Kuo Nnwuma",
    certification: "Adansedie",
    settings: "Nhyehyɛe",
  },
  nafana: {
    title: "GoodCashew",
    home: "Yiri",
    dashboard: "N Dashboard",
    education: "Kalanni Yεlε",
    technical: "Dεmε Teknikal",
    cooperative: "Kuo Tuma",
    certification: "Tεntεrεnni",
    settings: "Yεlεni",
  },
  fr: {
    title: "GoodCashew",
    home: "Accueil",
    dashboard: "Mon Tableau de Bord",
    education: "Modules d'Éducation",
    technical: "Assistance Technique",
    cooperative: "Services Coopératifs",
    certification: "Certification",
    settings: "Paramètres",
  },
}

export function Header({ language, userRole, currentView, onViewChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const t = translations[language]

  const menuItems = [
    { key: "home" as CurrentView, label: t.home, icon: Home },
    { key: "education" as CurrentView, label: t.education, icon: BookOpen },
    { key: "technical" as CurrentView, label: t.technical, icon: Wrench },
    { key: "cooperative" as CurrentView, label: t.cooperative, icon: Users },
    { key: "certification" as CurrentView, label: t.certification, icon: Award },
    { key: "settings" as CurrentView, label: t.settings, icon: Settings },
  ]

  const handleMenuItemClick = (view: CurrentView) => {
    onViewChange(view)
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold">{t.title}</h1>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-green-700">
              <Menu className="h-8 w-8" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-white">
            <div className="flex flex-col gap-4 pt-8">
              <div className="text-center pb-4 border-b">
                <h2 className="text-lg font-semibold text-green-600">{t.title}</h2>
                <p className="text-sm text-gray-600 capitalize">{userRole.replace("-", " ")}</p>
              </div>

              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.key}
                    variant={currentView === item.key ? "default" : "ghost"}
                    className="justify-start gap-3 h-12 text-lg"
                    onClick={() => handleMenuItemClick(item.key)}
                  >
                    <Icon className="h-6 w-6" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

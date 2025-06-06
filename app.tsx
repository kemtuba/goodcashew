"use client"

import { useState } from "react"
import { Header } from "./components/header"
import { RoleSelector } from "./components/role-selector"
import { FarmerDashboard } from "./components/dashboards/farmer-dashboard"
import { ExtensionWorkerDashboard } from "./components/dashboards/extension-worker-dashboard"
import { CoopLeaderDashboard } from "./components/dashboards/coop-leader-dashboard"
import { AdminDashboard } from "./components/dashboards/admin-dashboard"
import { EducationModules } from "./components/education-modules"
import { TechnicalAssistance } from "./components/technical-assistance"
import { CooperativeServices } from "./components/cooperative-services"
import { Certification } from "./components/certification"
import { Settings } from "./components/settings"

export type UserRole = "farmer" | "extension-worker" | "coop-leader" | "admin"
export type Language = "en" | "twi" | "nafana" | "fr"
export type CurrentView = "home" | "education" | "technical" | "cooperative" | "certification" | "settings"

interface AppState {
  userRole: UserRole | null
  language: Language
  currentView: CurrentView
}

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    userRole: null,
    language: "en",
    currentView: "home",
  })

  const updateRole = (role: UserRole) => {
    setAppState((prev) => ({ ...prev, userRole: role }))
  }

  const updateLanguage = (language: Language) => {
    setAppState((prev) => ({ ...prev, language }))
  }

  const updateView = (view: CurrentView) => {
    setAppState((prev) => ({ ...prev, currentView: view }))
  }

  if (!appState.userRole) {
    return <RoleSelector onRoleSelect={updateRole} language={appState.language} />
  }

  const renderCurrentView = () => {
    switch (appState.currentView) {
      case "home":
        switch (appState.userRole) {
          case "farmer":
            return <FarmerDashboard language={appState.language} />
          case "extension-worker":
            return <ExtensionWorkerDashboard language={appState.language} />
          case "coop-leader":
            return <CoopLeaderDashboard language={appState.language} />
          case "admin":
            return <AdminDashboard language={appState.language} />
        }
        break
      case "education":
        return <EducationModules language={appState.language} userRole={appState.userRole} />
      case "technical":
        return <TechnicalAssistance language={appState.language} userRole={appState.userRole} />
      case "cooperative":
        return <CooperativeServices language={appState.language} userRole={appState.userRole} />
      case "certification":
        return <Certification language={appState.language} userRole={appState.userRole} />
      case "settings":
        return (
          <Settings
            language={appState.language}
            userRole={appState.userRole}
            onLanguageChange={updateLanguage}
            onRoleChange={updateRole}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-green-50">
      <Header
        language={appState.language}
        userRole={appState.userRole}
        currentView={appState.currentView}
        onViewChange={updateView}
      />
      <main className="pt-16 pb-4">{renderCurrentView()}</main>
    </div>
  )
}

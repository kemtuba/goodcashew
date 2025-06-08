"use client"

import { Award, Download, QrCode, FileText, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/pages/components/ui/card"
import { Button } from "@/app/pages/components/ui/button"
import { Badge } from "@/app/pages/components/ui/badge"
import { Progress } from "@/app/pages/components/ui/progress"
import type { Language, UserRole } from "../app"

interface ReportsAndCertificationProps {
  language: Language
  userRole: UserRole
}

const translations = {
  en: {
    title: "Reports & Certification",
    certificationStatus: "Certification Status",
    certified: "Certified",
    inProgress: "In Progress",
    downloadBadge: "Download GoodCashew Badge",
    farmStory: "Farm Story QR Code",
    annualReview: "Annual Certification Review",
    traceabilityScore: "Traceability Score",
    esgReports: "ESG Reports",
    auditReports: "Audit Reports",
    productionReports: "Production Reports",
    downloadReport: "Download Report",
    viewQR: "View QR Code",
    nextReview: "Next Review",
    requirements: "Requirements Met",
  },
  twi: {
    title: "Amanneɛbɔ & Adansedie",
    certificationStatus: "Adansedie Tebea",
    certified: "Wɔadan Se",
    inProgress: "Ɛrekɔ So",
    downloadBadge: "Yi GoodCashew Badge",
    farmStory: "Afuo Asɛm QR Code",
    annualReview: "Afe Biara Adansedie Nhwehwɛmu",
    traceabilityScore: "Nhwehwɛmu Akontabuo",
    esgReports: "ESG Amanneɛbɔ",
    auditReports: "Audit Amanneɛbɔ",
    productionReports: "Nnɔbae Amanneɛbɔ",
    downloadReport: "Yi Amanneɛbɔ",
    viewQR: "Hwɛ QR Code",
    nextReview: "Nhwehwɛmu A Ɛdi Hɔ",
    requirements: "Ahwehwɛde A Wɔadi",
  },
  fr: {
    title: "Rapports & Certification",
    certificationStatus: "Statut de Certification",
    certified: "Certifié",
    inProgress: "En Cours",
    downloadBadge: "Télécharger Badge GoodCashew",
    farmStory: "Code QR Histoire Ferme",
    annualReview: "Révision Annuelle Certification",
    traceabilityScore: "Score Traçabilité",
    esgReports: "Rapports ESG",
    auditReports: "Rapports d'Audit",
    productionReports: "Rapports de Production",
    downloadReport: "Télécharger Rapport",
    viewQR: "Voir Code QR",
    nextReview: "Prochaine Révision",
    requirements: "Exigences Satisfaites",
  },
}

export function ReportsAndCertification({ language, userRole }: ReportsAndCertificationProps) {
  const t = translations[language]

  const certificationData = {
    status: "certified",
    score: 92,
    nextReview: "2024-06-15",
    requirementsMet: 18,
    totalRequirements: 20,
  }

  const reports = [
    {
      id: 1,
      title: "Q4 2023 Production Report",
      type: "production",
      date: "2024-01-01",
      size: "2.3 MB",
    },
    {
      id: 2,
      title: "ESG Impact Assessment",
      type: "esg",
      date: "2023-12-15",
      size: "1.8 MB",
    },
    {
      id: 3,
      title: "Annual Audit Report",
      type: "audit",
      date: "2023-11-30",
      size: "4.1 MB",
    },
  ]

  const renderFarmerView = () => (
    <>
      {/* Certification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-yellow-500" />
            {t.certificationStatus}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">GoodCashew Certified</span>
            <Badge className="bg-green-500">
              <CheckCircle className="h-4 w-4 mr-1" />
              {t.certified}
            </Badge>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>{t.requirements}</span>
              <span>
                {certificationData.requirementsMet}/{certificationData.totalRequirements}
              </span>
            </div>
            <Progress
              value={(certificationData.requirementsMet / certificationData.totalRequirements) * 100}
              className="h-3"
            />
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>{t.nextReview}:</strong> {certificationData.nextReview}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Download Badge */}
      <Card>
        <CardContent className="p-4">
          <Button className="w-full h-16 flex flex-col gap-2">
            <Download className="h-8 w-8" />
            <span className="text-lg">{t.downloadBadge}</span>
          </Button>
        </CardContent>
      </Card>

      {/* Farm Story QR */}
      <Card>
        <CardContent className="p-4">
          <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
            <QrCode className="h-8 w-8" />
            <span className="text-lg">{t.farmStory}</span>
          </Button>
        </CardContent>
      </Card>
    </>
  )

  const renderRetailerView = () => (
    <>
      {/* Traceability Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-blue-500" />
            {t.traceabilityScore}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{certificationData.score}%</div>
            <p className="text-sm text-gray-600">Excellent traceability</p>
          </div>
        </CardContent>
      </Card>

      {/* Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-green-500" />
            Available Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{report.title}</h4>
                <Badge variant="outline">{report.type.toUpperCase()}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p>
                    {report.date} • {report.size}
                  </p>
                </div>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  {t.downloadReport}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  )

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600">{t.title}</h2>
      </div>

      {userRole === "farmer" || userRole === "coop-leader" ? renderFarmerView() : renderRetailerView()}
    </div>
  )
}

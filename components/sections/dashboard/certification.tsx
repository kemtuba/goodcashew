"use client"

import { Award, QrCode, MapPin, Calendar, Download, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/pages/components/ui/card"
import { Button } from "@/app/pages/components/ui/button"
import { Badge } from "@/app/pages/components/ui/badge"
import { Progress } from "@/app/pages/components/ui/progress"
import type { Language, UserRole } from "../app"

interface CertificationProps {
  language: Language
  userRole: UserRole
}

const translations = {
  en: {
    title: "Certification & Traceability",
    certificationStatus: "Certification Status",
    certified: "Certified",
    farmStory: "Farm Story",
    traceabilityProfile: "Traceability Profile",
    annualAudit: "Annual Audit",
    downloadBadge: "Download Badge",
    generateQR: "Generate QR Code",
    viewProfile: "View Profile",
    nextAudit: "Next Audit",
    location: "Location",
    harvestTimeline: "Harvest Timeline",
    methods: "Methods Used",
    batchLink: "Batch Link",
    village: "Village",
    gpsCoords: "GPS Coordinates",
    organic: "Organic",
    fairTrade: "Fair Trade",
    requirements: "Requirements Met",
  },
  twi: {
    title: "Adansedie & Nhwehwɛmu",
    certificationStatus: "Adansedie Tebea",
    certified: "Wɔadan Se",
    farmStory: "Afuo Asɛm",
    traceabilityProfile: "Nhwehwɛmu Nsɛm",
    annualAudit: "Afe Biara Nhwehwɛmu",
    downloadBadge: "Yi Badge",
    generateQR: "Yɛ QR Code",
    viewProfile: "Hwɛ Nsɛm",
    nextAudit: "Nhwehwɛmu A Ɛdi Hɔ",
    location: "Beae",
    harvestTimeline: "Otwa Bere",
    methods: "Akwan A Wɔde Di Dwuma",
    batchLink: "Nkuw Nkitahodi",
    village: "Akuraa",
    gpsCoords: "GPS Nsɛnkyerɛnne",
    organic: "Organic",
    fairTrade: "Fair Trade",
    requirements: "Ahwehwɛde A Wɔadi",
  },
  nafana: {
    title: "Tεntεrεnni & Kpεlεni",
    certificationStatus: "Tεntεrεnni Tebea",
    certified: "Tεntεrεnni",
    farmStory: "Kuoro Asεm",
    traceabilityProfile: "Kpεlεni Nsεm",
    annualAudit: "Afe Kpεlεni",
    downloadBadge: "Yi Badge",
    generateQR: "Yε QR Code",
    viewProfile: "Kpεlε Nsεm",
    nextAudit: "Kpεlεni Kεsε",
    location: "Beae",
    harvestTimeline: "Twa Bere",
    methods: "Akwan Tumani",
    batchLink: "Nkuw Nkitahodi",
    village: "Tengan",
    gpsCoords: "GPS Nsεnkyerεnne",
    organic: "Organic",
    fairTrade: "Fair Trade",
    requirements: "Ahwehwεde Diani",
  },
  fr: {
    title: "Certification & Traçabilité",
    certificationStatus: "Statut Certification",
    certified: "Certifié",
    farmStory: "Histoire Ferme",
    traceabilityProfile: "Profil Traçabilité",
    annualAudit: "Audit Annuel",
    downloadBadge: "Télécharger Badge",
    generateQR: "Générer QR Code",
    viewProfile: "Voir Profil",
    nextAudit: "Prochain Audit",
    location: "Localisation",
    harvestTimeline: "Calendrier Récolte",
    methods: "Méthodes Utilisées",
    batchLink: "Lien Lot",
    village: "Village",
    gpsCoords: "Coordonnées GPS",
    organic: "Biologique",
    fairTrade: "Commerce Équitable",
    requirements: "Exigences Satisfaites",
  },
}

export function Certification({ language, userRole }: CertificationProps) {
  const t = translations[language]

  const farmStoryData = {
    village: "Kabile",
    gpsCoords: "7.9465° N, 2.1734° W",
    harvestPeriod: "October - December 2023",
    methods: ["Organic", "Fair Trade"],
    batchId: "GC-KAB-2024-001",
  }

  const certificationData = {
    status: "certified",
    score: 92,
    nextAudit: "2024-06-15",
    requirementsMet: 18,
    totalRequirements: 20,
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600">{t.title}</h2>
      </div>

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
              <strong>{t.nextAudit}:</strong> {certificationData.nextAudit}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Farm Story Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-500" />
            {t.farmStory}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{t.village}</p>
                <p className="text-sm text-gray-600">{farmStoryData.village}</p>
              </div>
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{t.gpsCoords}</p>
                <p className="text-sm text-gray-600">{farmStoryData.gpsCoords}</p>
              </div>
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{t.harvestTimeline}</p>
                <p className="text-sm text-gray-600">{farmStoryData.harvestPeriod}</p>
              </div>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium mb-2">{t.methods}</p>
              <div className="flex gap-2">
                {farmStoryData.methods.map((method, index) => (
                  <Badge key={index} variant="secondary">
                    {method}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{t.batchLink}</p>
                <p className="text-sm text-gray-600">{farmStoryData.batchId}</p>
              </div>
              <QrCode className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-1 gap-4">
        <Button className="h-16 flex flex-col gap-2">
          <Download className="h-6 w-6" />
          <span>{t.downloadBadge}</span>
        </Button>

        <Button variant="outline" className="h-16 flex flex-col gap-2">
          <QrCode className="h-6 w-6" />
          <span>{t.generateQR}</span>
        </Button>

        <Button variant="outline" className="h-16 flex flex-col gap-2">
          <MapPin className="h-6 w-6" />
          <span>{t.viewProfile}</span>
        </Button>
      </div>
    </div>
  )
}

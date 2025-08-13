"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft, MessageCircle, Users, Eye, Phone, AlertTriangle, CheckCircle, Heart } from "lucide-react"
import Link from "next/link"

export default function SafetyGuidePage() {
  const safetyTips = [
    {
      category: "Ensimmäinen tapaaminen",
      icon: Users,
      color: "bg-blue-100 text-blue-800",
      tips: [
        "Tapaa aina julkisessa paikassa (kahvila, puisto, kauppakeskus)",
        "Kerro luotetulle henkilölle missä olet menossa ja milloin palaat",
        "Ota mukaan puhelin ja varmista että se on ladattu",
        "Luota vaistoihisi - jos jokin tuntuu väärältä, poistu tilanteesta",
        "Älä mene toisen kotiin ensimmäisellä tapaamisella",
      ],
    },
    {
      category: "Viestintä",
      icon: MessageCircle,
      color: "bg-green-100 text-green-800",
      tips: [
        "Älä jaa henkilökohtaisia tietoja (osoite, työpaikka) heti alussa",
        "Pidä keskustelut aluksi yleisellä tasolla",
        "Älä lähetä rahaa tai arvoesineitä tuntemattomille",
        "Raportoi epäilyttävä käytös välittömästi",
        "Tallenna tärkeät keskustelut kuvakaappauksina",
      ],
    },
    {
      category: "Lasten turvallisuus",
      icon: Heart,
      color: "bg-pink-100 text-pink-800",
      tips: [
        "Tapaa toisen vanhemman ensin ilman lapsia",
        "Järjestä leikkitapaamiset julkisissa paikoissa",
        "Pysy läsnä koko leikkitapaamisen ajan",
        "Kysy lapselta miltä uusi kaveri tuntui",
        "Luota lapsen reaktioihin ja vaistoihin",
      ],
    },
    {
      category: "Yksityisyys",
      icon: Eye,
      color: "bg-purple-100 text-purple-800",
      tips: [
        "Jaa vain tarvittavat tiedot profiilissasi",
        "Käytä sovelluksen yksityisyysasetuksia",
        "Älä jaa tarkkaa osoitettasi ennen tapaamista",
        "Tarkista säännöllisesti kuka näkee profiilisi",
        "Poista vanhat kuvat ja tiedot tarvittaessa",
      ],
    },
  ]

  const warningSignsData = [
    {
      title: "Liian kiireinen tutustuminen",
      description: "Haluaa tavata heti tai painostaa nopeisiin päätöksiin",
    },
    {
      title: "Välttelee julkisia paikkoja",
      description: "Ehdottaa vain yksityisiä tapaamisia tai omaa kotiaan",
    },
    {
      title: "Pyytää rahaa tai palveluksia",
      description: "Kysyy lainaa, maksuja tai kalliita palveluksia",
    },
    {
      title: "Epäjohdonmukainen tarina",
      description: "Kertoo ristiriitaisia asioita itsestään tai tilanteestaan",
    },
    {
      title: "Ei kunnioita rajoja",
      description: "Jatkaa yhteydenottoja kiellosta huolimatta",
    },
  ]

  const emergencySteps = [
    {
      step: 1,
      title: "Poistu turvallisesti",
      description: "Siirry julkiseen paikkaan tai turvalliseen tilaan",
    },
    {
      step: 2,
      title: "Soita apua",
      description: "Hätätilanteessa soita 112, muuten ota yhteyttä luotettuun henkilöön",
    },
    {
      step: 3,
      title: "Dokumentoi",
      description: "Tallenna viestit, ota kuvakaappauksia ja kirjaa tapahtumat",
    },
    {
      step: 4,
      title: "Raportoi",
      description: "Ilmoita asiasta sovelluksen kautta ja tarvittaessa viranomaisille",
    },
  ]

  return (
    <div className="min-h-screen bg-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-cyan-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Takaisin etusivulle
        </Link>

        {/* Header */}
        <Card className="bg-white border-slate-200 shadow-lg mb-6">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-slate-800 font-sans">Turvallisuusopas</CardTitle>
            <CardDescription className="text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Opi turvallisesti tutustumaan naapureihin ja rakentamaan luottamusta yhteisössä. Turvallisuutesi on meille
              tärkeintä.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Safety Tips by Category */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 font-sans">Turvallisuusvinkit</h2>
          <div className="grid gap-6">
            {safetyTips.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card key={index} className="bg-white border-slate-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <CardTitle className="text-lg text-slate-800 font-sans">{category.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Warning Signs */}
        <Card className="bg-amber-50 border-amber-200 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-amber-800 font-sans flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              Varoitusmerkit - Milloin olla varovainen
            </CardTitle>
            <CardDescription className="text-amber-700">Tunnista epäilyttävä käytös ja suojaa itsesi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {warningSignsData.map((warning, index) => (
                <div key={index} className="bg-white border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-800 mb-2">{warning.title}</h4>
                  <p className="text-sm text-amber-700 leading-relaxed">{warning.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Protocol */}
        <Card className="bg-red-50 border-red-200 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-red-800 font-sans flex items-center gap-2">
              <Phone className="w-6 h-6 text-red-600" />
              Hätätilanteessa toimiminen
            </CardTitle>
            <CardDescription className="text-red-700">Näin toimit, jos kohtaat ongelmatilanteen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {emergencySteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-800 mb-1">{step.title}</h4>
                    <p className="text-sm text-red-700 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-red-100 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-red-800">Tärkeät numerot</h4>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-red-800">Hätänumero:</span>
                  <span className="text-red-700 ml-2">112</span>
                </div>
                <div>
                  <span className="font-medium text-red-800">Poliisi (ei-kiireellinen):</span>
                  <span className="text-red-700 ml-2">0295 480 000</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Guidelines */}
        <Card className="bg-cyan-50 border-cyan-200 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-cyan-800 font-sans flex items-center gap-2">
              <Users className="w-6 h-6 text-cyan-600" />
              Yhteisön säännöt
            </CardTitle>
            <CardDescription className="text-cyan-700">
              Yhdessä luomme turvallisen ja ystävällisen yhteisön
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-cyan-800 mb-3">Sallittu käytös</h4>
                  <ul className="space-y-2 text-sm text-cyan-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Ystävällinen ja kunnioittava kommunikointi
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Aito halu auttaa ja tutustua naapureihin
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Rehellinen profiili ja tiedot
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Muiden yksityisyyden kunnioittaminen
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-3">Kielletty käytös</h4>
                  <ul className="space-y-2 text-sm text-red-700">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      Häirintä, uhkailu tai sopimaton käytös
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      Väärennetyt profiilit tai valheelliset tiedot
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      Kaupallinen toiminta ilman lupaa
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      Toisten henkilötietojen jakaminen
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/settings/safety">
            <Button className="bg-cyan-800 hover:bg-cyan-900 text-white">
              <Shield className="w-4 h-4 mr-2" />
              Turvallisuusasetukset
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-cyan-800 text-cyan-800 hover:bg-cyan-50 bg-transparent">
              Takaisin hallintapaneeliin
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

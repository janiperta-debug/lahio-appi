import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users, Heart, HandHeart } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-stone-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-700 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-amber-800 font-sans">Pihapiiri</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="ghost" className="text-stone-600 hover:text-amber-800">
                Kirjaudu sisään
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-amber-700 hover:bg-amber-800 text-white">Liity mukaan</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-stone-800 mb-6 font-sans leading-relaxed">
            Löydä ystäviä naapurustosta
          </h2>
          <p className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Yhdistämme naapureita. Löydä leikkikavereita lapsille, vapaaehtoisia apuun tai mukavia hetkiä
            lähialueeltasi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-amber-700 hover:bg-amber-800 text-white px-8">
                Liity mukaan
              </Button>
            </Link>
            <Link href="/discover">
              <Button
                size="lg"
                variant="outline"
                className="border-amber-700 text-amber-800 hover:bg-amber-50 bg-transparent"
              >
                Selaa naapureita
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Connection Types */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-stone-800 text-center mb-12 font-sans">Kolme tapaa tutustua</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-stone-200 hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-amber-700" />
                </div>
                <CardTitle className="text-xl text-stone-800 font-sans">Leikkikaverit</CardTitle>
                <CardDescription className="text-stone-600 leading-relaxed">
                  Kun kaipaat seuraa lapsille
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                  Löydä turvallisia leikkikavereita lähialueelta. Vanhemmat voivat tutustua samalla kun lapset
                  leikkivät.
                </p>
                <Link href="/categories/playdates">
                  <Button
                    variant="outline"
                    className="w-full border-amber-700 text-amber-800 hover:bg-amber-50 bg-transparent"
                  >
                    Selaa perheitä
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white border-stone-200 hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HandHeart className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl text-stone-800 font-sans">Auttavat kädet</CardTitle>
                <CardDescription className="text-stone-600 leading-relaxed">
                  Pyydä apua tai tarjoa omaasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                  Pienet askareet, ostosavut tai käsityöt. Naapurit auttavat toisiaan.
                </p>
                <Link href="/categories/help">
                  <Button
                    variant="outline"
                    className="w-full border-orange-600 text-orange-700 hover:bg-orange-50 bg-transparent"
                  >
                    Katso pyyntöjä
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white border-stone-200 hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-amber-700" />
                </div>
                <CardTitle className="text-xl text-stone-800 font-sans">Lähihetket</CardTitle>
                <CardDescription className="text-stone-600 leading-relaxed">
                  Rauhallisia tapahtumia lähellä
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                  Kirjastotapahtumat, kävelykerhot ja pienet kokoontumiset. Löydä aikasi arvoisia hetkiä.
                </p>
                <Link href="/categories/events">
                  <Button
                    variant="outline"
                    className="w-full border-amber-700 text-amber-800 hover:bg-amber-50 bg-transparent"
                  >
                    Näytä tapahtumat
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-stone-800 text-center mb-12 font-sans">Näin se toimii</h3>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-amber-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h4 className="text-lg font-semibold text-stone-800 mb-2 font-sans">Aseta kotisi</h4>
              <p className="text-stone-600 leading-relaxed">
                Merkitse kotisi kartalle ja valitse säde, jonka sisältä haluat löytää ihmisiä.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-amber-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h4 className="text-lg font-semibold text-stone-800 mb-2 font-sans">Selaa ja tutustuu</h4>
              <p className="text-stone-600 leading-relaxed">
                Tutustu naapureihin ja heidän tarpeisiinsa. Löydä sopivat ihmiset.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-amber-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h4 className="text-lg font-semibold text-stone-800 mb-2 font-sans">Ota yhteyttä</h4>
              <p className="text-stone-600 leading-relaxed">
                Lähetä ystävällinen viesti ja sovi tapaaminen turvallisessa ympäristössä.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-800 text-white px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-amber-600 rounded flex items-center justify-center">
              <Heart className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold font-sans">Pihapiiri</span>
          </div>
          <p className="text-stone-400 text-sm leading-relaxed">Yhdistämme naapureita • Tehty rakkaudella Suomessa</p>
        </div>
      </footer>
    </div>
  )
}

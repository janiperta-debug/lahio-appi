"use client"

import { useInView } from "@/hooks/use-in-view"

const pillars = [
  {
    icon: "🧒",
    iconBg: "bg-terracotta-faint",
    title: "Leikkikaverit",
    description:
      "Löydä turvallisia leikkikavereita lapsellesi lähialueelta. Tutustukaa yhdessä samalla kun lapset leikkivät — ei paineita, ei sitoumuksia.",
    link: "Selaa perheitä →",
  },
  {
    icon: "🤝",
    iconBg: "bg-sage-faint",
    title: "Naapuriapu",
    description:
      "Pienet askareet, ostosapu tai käsityöt. Naapurit auttavat toisiaan arjessa. Kysy apua tai tarjoa omaa osaamistasi.",
    link: "Katso pyyntöjä →",
  },
  {
    icon: "📅",
    iconBg: "bg-sand",
    title: "Lähihetket",
    description:
      "Kävelykerhot, kirjastotapahtumat, kyläjuhlat. Löydä pieniä mutta merkityksellisiä hetkiä juuri sinun alueeltasi.",
    link: "Näytä tapahtumat →",
  },
]

export function Pillars() {
  const { ref, isVisible } = useInView()

  return (
    <section id="ominaisuudet" className="py-24 px-6 lg:px-12">
      <div
        ref={ref}
        className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="text-xs tracking-[0.14em] uppercase text-terracotta font-semibold mb-4">
          {"Mitä Lähellä tarjoaa"}
        </div>
        <h2 className="font-serif font-semibold tracking-tight leading-tight text-lahella-text text-balance" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
          {"Kolme tapaa"}
          <br />
          {"löytää yhteys"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {pillars.map((pillar) => (
          <PillarCard key={pillar.title} {...pillar} />
        ))}
      </div>
    </section>
  )
}

function PillarCard({
  icon,
  iconBg,
  title,
  description,
  link,
}: {
  icon: string
  iconBg: string
  title: string
  description: string
  link: string
}) {
  const { ref, isVisible } = useInView()

  return (
    <div
      ref={ref}
      className={`bg-card rounded-3xl p-8 border border-border hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 ${iconBg}`}
      >
        {icon}
      </div>
      <h3 className="font-serif font-semibold text-xl mb-2 tracking-tight text-lahella-text">
        {title}
      </h3>
      <p className="text-sm text-lahella-text2 leading-relaxed mb-5">{description}</p>
      <span className="text-sm font-bold text-terracotta">{link}</span>
    </div>
  )
}

"use client"

import { useInView } from "@/hooks/use-in-view"

const steps = [
  {
    num: "01",
    title: "Aseta kotisi",
    description:
      "Merkitse kotisi kartalle ja valitse säde, jonka sisältä haluat löytää ihmisiä. Yksityisyytesi on suojattu — tarkkaa osoitettasi ei jaeta koskaan.",
  },
  {
    num: "02",
    title: "Selaa lähellä olevia",
    description:
      "Tutustu naapureihin ja heidän tarpeisiinsa. Leikkikavereita, apupyyntöjä tai tapahtumia — kaikki lähialueeltasi.",
  },
  {
    num: "03",
    title: "Ota yhteyttä",
    description:
      "Lähetä ystävällinen viesti ja sovi tapaaminen. Turvallisessa ympäristössä, omaan tahtiin — ilman paineita.",
  },
]

export function HowItWorks() {
  const { ref: headerRef, isVisible: headerVisible } = useInView()
  const { ref: gridRef, isVisible: gridVisible } = useInView()

  return (
    <section id="miten-toimii" className="bg-sand py-24 px-6 lg:px-12">
      <div
        ref={headerRef}
        className={`text-center transition-all duration-700 ${
          headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="text-xs tracking-[0.14em] uppercase text-terracotta font-semibold mb-4">
          {"Näin se toimii"}
        </div>
        <h2 className="font-serif font-semibold tracking-tight leading-tight text-lahella-text text-balance" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
          {"Kolme askelta"}
          <br />
          {"uusiin yhteyksiin"}
        </h2>
      </div>

      <div
        ref={gridRef}
        className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto transition-all duration-700 delay-200 ${
          gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {steps.map((step) => (
          <div key={step.num} className="flex flex-col gap-3">
            <div className="font-serif text-5xl font-semibold text-sand2 leading-none tracking-tight">
              {step.num}
            </div>
            <h3 className="font-serif font-semibold text-lg tracking-tight text-lahella-text">
              {step.title}
            </h3>
            <p className="text-sm text-lahella-text2 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

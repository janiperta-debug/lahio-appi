"use client"

import { useInView } from "@/hooks/use-in-view"

const benefits = [
  "Täysin ilmainen kaikille käyttäjille",
  "Toimii suoraan selaimessa — ei sovelluskauppoja",
  "Todennetut käyttäjät, turvallinen ympäristö",
  "Vain lähialueesi näkyy sinulle",
  "Ei mainoksia, ei myyntiä, ei kuplia",
]

const testimonials = [
  {
    text: "Löysimme Lähellän kautta leikkikaverin Miiolle heti ensimmäisellä viikolla. Nyt käymme yhdessä puistossa joka tiistai.",
    avatar: "👩",
    avatarBg: "#fde8dc",
    name: "Tiina M.",
    loc: "Hyvinkää · 2 lapsen äiti",
  },
  {
    text: "Naapuri auttoi minua lumitöissä kun selkäni oli kipeä. En olisi uskaltanut pyytää ilman Lähellää. Nyt me molemmat autamme toisiamme.",
    avatar: "👴",
    avatarBg: "#e8f0e8",
    name: "Erkki V.",
    loc: "Järvenpää · Eläkeläinen",
  },
  {
    text: "Muutimme uuteen kaupunginosaan ja tunsimme olevamme yksin. Lähellän kautta löysimme koko naapuruston.",
    avatar: "👨‍👩‍👧",
    avatarBg: "#e8ecf5",
    name: "Mäkinen-perhe",
    loc: "Kerava · Muuttanut 3kk sitten",
  },
]

export function WhySection() {
  const { ref: leftRef, isVisible: leftVisible } = useInView()
  const { ref: rightRef, isVisible: rightVisible } = useInView()

  return (
    <section className="py-24 px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center max-w-7xl mx-auto">
      {/* Left */}
      <div
        ref={leftRef}
        className={`transition-all duration-700 ${
          leftVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="text-xs tracking-[0.14em] uppercase text-terracotta font-semibold mb-4">
          {"Miksi Lähellä"}
        </div>
        <h2 className="font-serif font-semibold tracking-tight leading-[1.2] mb-5 text-lahella-text text-balance" style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)" }}>
          {"Naapuruus on"}
          <br />
          {"katoava taito."}
          <br />
          <em className="italic text-terracotta">{"Palautetaan se."}</em>
        </h2>
        <p className="text-base text-lahella-text2 leading-relaxed mb-8">
          {"Modernissa kaupunkielämässä naapureita ei enää tunneta. Lapset leikkivät sisällä, apua ei uskalleta pyytää, yhteisö puuttuu. Lähellä muuttaa tämän."}
        </p>
        <ul className="flex flex-col gap-3">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3 text-sm text-lahella-text2">
              <div className="w-5 h-5 rounded-full bg-sage-faint border border-sage/30 flex items-center justify-center text-[0.65rem] text-sage flex-shrink-0 mt-0.5">
                {"✓"}
              </div>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Right - Testimonials */}
      <div
        ref={rightRef}
        className={`flex flex-col gap-4 transition-all duration-700 delay-200 ${
          rightVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="bg-card border border-border rounded-2xl p-6 shadow-[0_4px_16px_rgba(45,36,25,0.06)]"
          >
            <p className="text-sm text-lahella-text2 leading-relaxed mb-4 italic">
              {`"${t.text}"`}
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-base"
                style={{ background: t.avatarBg }}
              >
                {t.avatar}
              </div>
              <div>
                <div className="text-sm font-bold text-lahella-text">{t.name}</div>
                <div className="text-xs text-lahella-muted">{t.loc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

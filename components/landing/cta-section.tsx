import Link from "next/link"

export function CtaSection() {
  return (
    <section className="bg-terracotta py-24 px-6 lg:px-12 text-center relative overflow-hidden">
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[rgba(255,255,255,0.05)] -top-48 -right-24 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[rgba(255,255,255,0.05)] -bottom-36 -left-12 pointer-events-none" />

      <h2
        className="font-serif font-semibold text-primary-foreground tracking-tight leading-[1.1] mb-4 relative z-10 text-balance"
        style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
      >
        {"Naapurisi"}
        <br />
        {"odottavat sinua."}
      </h2>
      <p className="text-primary-foreground/75 text-base mb-10 relative z-10">
        {"Kokeile Lähellä-demoa ja tutustu lähialueesi mahdollisuuksiin."}
      </p>
      <Link
        href="/demo"
        className="inline-block bg-card text-terracotta px-8 py-3.5 rounded-full font-bold text-base hover:-translate-y-0.5 transition-transform shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] relative z-10"
      >
        {"Kokeile demoa →"}
      </Link>
      <div className="mt-5 text-sm text-primary-foreground/60 relative z-10">
        {"Toimii suoraan selaimessa · Ei sovelluskauppoja · Ilmainen"}
      </div>
    </section>
  )
}

import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { TrustBar } from "@/components/landing/trust-bar"
import { Pillars } from "@/components/landing/pillars"
import { HowItWorks } from "@/components/landing/how-it-works"
import { WhySection } from "@/components/landing/why-section"
import { CtaSection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="bg-background overflow-x-hidden scroll-smooth">
      <Navbar />
      <Hero />
      <TrustBar />
      <Pillars />
      <HowItWorks />
      <WhySection />
      <CtaSection />
      <Footer />
    </main>
  )
}

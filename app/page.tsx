import { HeroSection } from '@/components/hero-section'
import { HowItWorks } from '@/components/how-it-works'
import { PricingSection } from '@/components/pricing-section'
import { StatsSection } from '@/components/stats-section'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <HowItWorks />
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}

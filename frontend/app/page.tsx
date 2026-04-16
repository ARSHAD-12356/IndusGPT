import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/sections/hero'
import { FeaturesSection } from '@/components/features-section'
import { HowItWorksSection } from '@/components/how-it-works-section'
import { WhyIndusGPTSection } from '@/components/why-section'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="bg-[#05050a]">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WhyIndusGPTSection />
      <CTASection />
      <Footer />
    </main>
  )
}

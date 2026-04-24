'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/sections/hero'
import { FeaturesSection } from '@/components/features-section'
import { HowItWorksSection } from '@/components/how-it-works-section'
import { WhyIndusGPTSection } from '@/components/why-section'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

export default function Home() {
  return (
    <div className="bg-background">
      <Navbar />
      <main className="mt-0">
        <HeroSection />
        
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          variants={fadeInUp}
        >
          <FeaturesSection />
        </motion.div>
        
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          variants={fadeInUp}
        >
          <HowItWorksSection />
        </motion.div>
        
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          variants={fadeInUp}
        >
          <WhyIndusGPTSection />
        </motion.div>
        
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          variants={fadeInUp}
        >
          <CTASection />
        </motion.div>
        
        <Footer />
      </main>
    </div>
  )
}

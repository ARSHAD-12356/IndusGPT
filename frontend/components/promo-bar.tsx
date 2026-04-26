'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export function PromoBar() {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
  }

  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault()
    const pricingSection = document.getElementById('pricing')
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="relative w-full bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-md z-[60] overflow-hidden"
        >
          <div className="max-w-[88rem] mx-auto px-4 h-10 flex items-center justify-center relative">
            
            {/* Center Content */}
            <div className="flex items-center gap-2 sm:gap-3 text-white text-[11px] sm:text-xs md:text-sm font-medium w-full sm:w-auto justify-center pr-8 sm:pr-0">
              <span className="truncate">
                🚀 Upgrade to IndusGPT Pro — Unlock unlimited AI power
              </span>
              <button 
                onClick={scrollToPricing}
                className="group relative px-2.5 py-1 sm:px-3 bg-white/20 hover:bg-white/30 rounded-full text-[10px] sm:text-xs font-bold transition-all shrink-0 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-1 group-hover:scale-105 transition-transform">
                  Learn More
                  <span className="animate-pulse">✨</span>
                </span>
                <div className="absolute inset-0 bg-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>

            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute right-4 p-1 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all"
              aria-label="Close promo bar"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

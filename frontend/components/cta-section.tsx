'use client'

import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'

export function CTASection() {
  return (
    <section className="relative py-28 bg-[#07070f] overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-600/8 rounded-full blur-[80px] pointer-events-none" />

      {/* Decorative grid fades */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)'
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-gray-400 mb-8">
          ✦ Join 100K+ users already using IndusGPT
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-5 leading-[1.1]">
          Start using AI{' '}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            the smarter way.
          </span>
        </h2>

        {/* Subtext */}
        <p className="text-gray-400 text-lg mb-10 max-w-xl leading-relaxed">
          Built for learners, developers, and data-driven minds.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/signup">
            <button className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-sm
              bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500
              shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.03]
              transition-all duration-300">
              Get Started Free
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm text-white/80 hover:text-white
              border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/8
              transition-all duration-300">
              Launch App
              <ExternalLink size={14} />
            </button>
          </Link>
        </div>

        {/* Trust note */}
        <p className="mt-8 text-xs text-gray-500">
          No credit card required · Free plan available · Cancel anytime
        </p>
      </div>
    </section>
  )
}

'use client'

import { MessageSquare, Brain, Zap, ArrowRight } from 'lucide-react'

const STEPS = [
  {
    icon: MessageSquare,
    title: 'Ask anything',
    desc: 'Ask any question or upload your files',
    gradient: 'from-blue-500 to-indigo-600',
    step: '01',
  },
  {
    icon: Brain,
    title: 'AI understands',
    desc: 'Our multi-role AI analyzes and understands your query',
    gradient: 'from-purple-500 to-violet-600',
    step: '02',
  },
  {
    icon: Zap,
    title: 'Get instant results',
    desc: 'Get accurate, actionable answers in seconds',
    gradient: 'from-pink-500 to-rose-600',
    step: '03',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-28 bg-[#07070f] overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need, all in{' '}
            <span className="text-white font-semibold italic">one</span>{' '}
            platform.
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-0">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex flex-col lg:flex-row items-center flex-1">
              {/* Card */}
              <div className="group flex-1 w-full flex flex-col gap-4 p-7 rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm transition-all duration-300 hover:border-white/15 relative overflow-hidden">
                {/* Step number - subtle background */}
                <span className="absolute top-4 right-5 text-5xl font-black text-white/[0.04] select-none leading-none">{step.step}</span>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}>
                  <step.icon size={22} className="text-white" />
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-1.5">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>

              {/* Connector arrow */}
              {i < STEPS.length - 1 && (
                <div className="flex lg:flex-col items-center justify-center px-4 py-3 lg:py-0 lg:px-6 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <ArrowRight size={14} className="text-blue-400 lg:block hidden" />
                    <ArrowRight size={14} className="text-blue-400 lg:hidden rotate-90" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

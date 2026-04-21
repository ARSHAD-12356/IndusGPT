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
    <section id="how-it-works" className="relative pt-16 pb-28 bg-background overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need, all in{' '}
            <span className="text-foreground font-semibold italic">one</span>{' '}
            platform.
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-0">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex flex-col lg:flex-row items-center flex-1">
              {/* Card */}
              <div className="group flex-1 w-full flex flex-col gap-6 p-8 min-h-[260px] rounded-2xl border border-border bg-card/50 hover:bg-accent backdrop-blur-sm transition-all duration-300 hover:border-border/80 relative overflow-hidden">
                {/* Step number - subtle background */}
                <span className="absolute top-4 right-5 text-6xl font-black text-foreground/[0.04] select-none leading-none">{step.step}</span>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}>
                  <step.icon size={26} className="text-white" />
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>

              {/* Connector arrow */}
              {i < STEPS.length - 1 && (
                <div className="flex lg:flex-col items-center justify-center px-4 py-3 lg:py-0 lg:px-6 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-accent border border-border flex items-center justify-center">
                    <ArrowRight size={14} className="text-blue-500 lg:block hidden" />
                    <ArrowRight size={14} className="text-blue-500 lg:hidden rotate-90" />
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

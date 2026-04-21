'use client'

import { Zap, X, Check } from 'lucide-react'

const COMPARISON = [
  {
    aspect: 'Generic AI',
    others: 'Generic AI',
    indus: 'AI designed for students, devs & data analysts',
  },
  {
    aspect: 'Chat only',
    others: 'Chat only',
    indus: 'Our multi-role AI analyzes code, data instantly',
  },
  {
    aspect: 'No structure',
    others: 'No structure',
    indus: 'Task-focused, organized workflows',
  },
  {
    aspect: 'One-size-fits-all',
    others: 'One-size-fits-all',
    indus: 'Specialized modes per use case',
  },
]

export function WhyIndusGPTSection() {
  return (
    <section id="why" className="relative pt-16 pb-28 bg-[#05050a] overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Why{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              IndusGPT?
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Built for learners, developers, and data minds.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.01]">
          {/* Table header (Hidden on mobile) */}
          <div className="hidden md:grid grid-cols-3 bg-white/[0.04] border-b border-white/10">
            <div className="px-8 py-6 text-base font-semibold text-gray-400">Others</div>
            <div className="px-8 py-6 text-base font-semibold text-white flex items-center gap-2 border-x border-white/10 bg-blue-500/5">
              <Zap size={18} className="text-blue-400" /> IndusGPT
            </div>
            <div className="px-8 py-6 text-base font-semibold text-white flex items-center gap-2">
              <Zap size={18} className="text-purple-400" /> IndusGPT Pro
            </div>
          </div>

          {/* Rows */}
          {COMPARISON.map((row, i) => (
            <div
              key={i}
              className={`flex flex-col md:grid md:grid-cols-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors`}
            >
              {/* Aspect Title (Mobile only) */}
              <div className="md:hidden px-6 pt-6 pb-2 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                Feature {i + 1}
              </div>

              {/* Others */}
              <div className="px-6 py-4 md:px-8 md:py-6 flex items-start gap-3 text-sm md:text-base text-gray-400">
                <div className="md:hidden font-medium text-gray-500 min-w-[60px]">Others:</div>
                <X size={18} className="text-red-400/60 mt-0.5 shrink-0" />
                {row.others}
              </div>

              {/* IndusGPT */}
              <div className="px-6 py-4 md:px-8 md:py-6 flex items-start gap-3 text-sm md:text-base text-gray-300 border-y md:border-y-0 md:border-x border-white/5 bg-blue-500/[0.03]">
                <div className="md:hidden font-medium text-blue-400/70 min-w-[60px]">Free:</div>
                <Check size={18} className="text-blue-400 mt-0.5 shrink-0" />
                {row.indus}
              </div>

              {/* IndusGPT Pro */}
              <div className="px-6 py-4 md:px-8 md:py-6 flex items-start gap-3 text-sm md:text-base text-gray-300">
                <div className="md:hidden font-medium text-purple-400/70 min-w-[60px]">Pro:</div>
                <Check size={18} className="text-purple-400 mt-0.5 shrink-0" />
                {i === 0 ? 'Multi-role AI, no features missing' :
                 i === 1 ? 'Multiple modes for study, code, data' :
                 i === 2 ? 'Task-focused, organized workflows' :
                 'Custom modes built for your workflow'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

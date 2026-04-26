'use client'

import { motion, Variants } from 'framer-motion'
import { Zap, X, Check } from 'lucide-react'

const COMPARISON = [
  {
    aspect: 'Generic AI',
    others: 'Generic AI',
    indus: 'AI designed for real-world professional workflows',
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
    <section id="why" className="relative py-20 md:py-28 bg-white dark:bg-slate-900 overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Why{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              IndusGPT?
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Built for professionals across every industry.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="rounded-2xl overflow-hidden border border-border bg-card/10"
        >
          {/* Table header (Hidden on mobile) */}
          <div className="hidden md:grid grid-cols-3 bg-accent border-b border-border">
            <div className="px-8 py-6 text-base font-semibold text-muted-foreground">Others</div>
            <div className="px-8 py-6 text-base font-semibold text-foreground flex items-center gap-2 border-x border-border bg-blue-500/5">
              <Zap size={18} className="text-blue-500" /> IndusGPT
            </div>
            <div className="px-8 py-6 text-base font-semibold text-foreground flex items-center gap-2">
              <Zap size={18} className="text-purple-500" /> IndusGPT Pro
            </div>
          </div>

          {/* Rows */}
          {COMPARISON.map((row, i) => (
            <div
              key={i}
              className={`flex flex-col md:grid md:grid-cols-3 border-b border-border last:border-0 hover:bg-accent/50 transition-colors`}
            >
              {/* Aspect Title (Mobile only) */}
              <div className="md:hidden px-6 pt-6 pb-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                Feature {i + 1}
              </div>

              {/* Others */}
              <div className="px-6 py-4 md:px-8 md:py-6 flex items-start gap-3 text-sm md:text-base text-muted-foreground">
                <div className="md:hidden font-medium text-muted-foreground min-w-[60px]">Others:</div>
                <X size={18} className="text-red-500 mt-0.5 shrink-0" />
                {row.others}
              </div>

              {/* IndusGPT */}
              <div className="px-6 py-4 md:px-8 md:py-6 flex items-start gap-3 text-sm md:text-base text-foreground border-y md:border-y-0 md:border-x border-border bg-blue-500/5">
                <div className="md:hidden font-medium text-blue-500 min-w-[60px]">Free:</div>
                <Check size={18} className="text-blue-500 mt-0.5 shrink-0" />
                {row.indus}
              </div>

              {/* IndusGPT Pro */}
              <div className="px-6 py-4 md:px-8 md:py-6 flex items-start gap-3 text-sm md:text-base text-foreground">
                <div className="md:hidden font-medium text-purple-500 min-w-[60px]">Pro:</div>
                <Check size={18} className="text-purple-500 mt-0.5 shrink-0" />
                {i === 0 ? 'Multi-role AI, no features missing' :
                 i === 1 ? 'Multiple modes for study, code, data' :
                 i === 2 ? 'Task-focused, organized workflows' :
                 'Custom modes built for your workflow'}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

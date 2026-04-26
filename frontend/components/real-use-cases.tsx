'use client'

import { motion, Variants } from 'framer-motion'
import { Bug, BookOpen, LineChart, PenTool, Calculator, Activity } from 'lucide-react'

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

const USE_CASES = [
  {
    icon: Bug,
    title: 'Debugging takes too long?',
    desc: 'Instantly find errors and fix code with AI-powered suggestions.',
    gradient: 'from-blue-500 to-indigo-600',
    glow: 'group-hover:shadow-blue-500/20',
    border: 'group-hover:border-blue-500/30',
  },
  {
    icon: BookOpen,
    title: 'Struggling with assignments or research?',
    desc: 'Summarize content, generate answers, and understand concepts quickly.',
    gradient: 'from-purple-500 to-violet-600',
    glow: 'group-hover:shadow-purple-500/20',
    border: 'group-hover:border-purple-500/30',
  },
  {
    icon: LineChart,
    title: 'Manual data analysis is slow?',
    desc: 'Upload data and get instant insights, charts, and summaries.',
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'group-hover:shadow-cyan-500/20',
    border: 'group-hover:border-cyan-500/30',
  },
  {
    icon: PenTool,
    title: 'Writing content takes hours?',
    desc: 'Generate blogs, posts, and scripts in seconds.',
    gradient: 'from-pink-500 to-rose-600',
    glow: 'group-hover:shadow-pink-500/20',
    border: 'group-hover:border-pink-500/30',
  },
  {
    icon: Calculator,
    title: 'Engineering calculations are complex?',
    desc: 'Solve formulas, analyze problems, and get accurate results instantly.',
    gradient: 'from-amber-500 to-orange-600',
    glow: 'group-hover:shadow-amber-500/20',
    border: 'group-hover:border-amber-500/30',
  },
  {
    icon: Activity,
    title: 'Need quick medical insights?',
    desc: 'Summarize medical data and assist in faster understanding.',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'group-hover:shadow-emerald-500/20',
    border: 'group-hover:border-emerald-500/30',
  },
]

export function RealUseCasesSection() {
  return (
    <section className="relative py-20 md:py-28 bg-white dark:bg-slate-900 overflow-hidden border-t border-border/50">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-[88rem] mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Solve Real Problems Faster
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See how IndusGPT helps professionals save time and work smarter.
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {USE_CASES.map((useCase) => (
            <motion.div
              variants={item}
              key={useCase.title}
              className={`group relative flex flex-col gap-5 p-8 min-h-[220px] rounded-2xl border border-border bg-card/40 hover:bg-accent/40 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-default overflow-hidden ${useCase.glow} hover:shadow-xl ${useCase.border}`}
            >
              <div className={`absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`} />

              <div className="flex items-center gap-4 mb-2">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${useCase.gradient} flex items-center justify-center shadow-lg shrink-0`}>
                  <useCase.icon size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground leading-snug">{useCase.title}</h3>
              </div>

              <div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-14 relative">
                  <span className="absolute left-4 top-1.5 w-1.5 h-1.5 rounded-full bg-border" />
                  <span className="text-foreground/90 font-medium">Solution:</span> {useCase.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

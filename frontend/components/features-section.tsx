'use client'

import { motion, Variants } from 'framer-motion'
import { MessageSquare, Code2, BarChart3, FileText } from 'lucide-react'

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

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'Study Assistant',
    desc: 'Summarize notes, solve doubts, and explain concepts with ease.',
    gradient: 'from-blue-500 to-indigo-600',
    glow: 'group-hover:shadow-blue-500/20',
    border: 'group-hover:border-blue-500/30',
  },
  {
    icon: Code2,
    title: 'Code Assistant',
    desc: 'Write, debug, and optimize code instantly in any language.',
    gradient: 'from-purple-500 to-violet-600',
    glow: 'group-hover:shadow-purple-500/20',
    border: 'group-hover:border-purple-500/30',
  },
  {
    icon: BarChart3,
    title: 'Data Analyst Mode',
    desc: 'Upload data, visualize trends, and get instant insights from your files.',
    gradient: 'from-pink-500 to-rose-600',
    glow: 'group-hover:shadow-pink-500/20',
    border: 'group-hover:border-pink-500/30',
  },
  {
    icon: FileText,
    title: 'Content Generator',
    desc: 'Generate LinkedIn posts, blogs, assignments, and more effortlessly.',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'group-hover:shadow-emerald-500/20',
    border: 'group-hover:border-emerald-500/30',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative pt-16 pb-28 bg-background overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-[88rem] mx-auto px-6">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            What can you do with{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              IndusGPT?
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">Everything you need, all in one platform.</p>
        </motion.div>

        {/* Feature cards */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {FEATURES.map((f) => (
            <motion.div
              variants={item}
              key={f.title}
              className={`group relative flex flex-col gap-6 p-8 min-h-[260px] rounded-2xl border border-border bg-card/50 hover:bg-accent backdrop-blur-sm shadow-xl transition-all duration-300 cursor-default overflow-hidden ${f.glow} hover:shadow-2xl ${f.border}`}
            >
              {/* Glow spot */}
              <div className={`absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`} />

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-lg`}>
                <f.icon size={24} className="text-white" />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{f.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

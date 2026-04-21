'use client'

import { MessageSquare, Code2, BarChart3, FileText } from 'lucide-react'

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
    <section id="features" className="relative pt-16 pb-28 bg-[#05050a] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            What can you do with{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              IndusGPT?
            </span>
          </h2>
          <p className="text-gray-400 text-lg">Everything you need, all in one platform.</p>
        </div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`group relative flex flex-col gap-6 p-8 min-h-[260px] rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm shadow-xl transition-all duration-300 cursor-default overflow-hidden ${f.glow} hover:shadow-2xl ${f.border}`}
            >
              {/* Glow spot */}
              <div className={`absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`} />

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-lg`}>
                <f.icon size={24} className="text-white" />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">{f.title}</h3>
                <p className="text-base text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

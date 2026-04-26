'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Sarah Jenkins',
    role: 'Software Engineer',
    content: 'IndusGPT completely changed how I debug. It’s like having a senior engineer sitting next to me 24/7.',
    avatar: 'SJ'
  },
  {
    name: 'Dr. Alan Carter',
    role: 'Medical Researcher',
    content: 'The ability to quickly summarize complex research papers and extract key insights is invaluable for my daily work.',
    avatar: 'AC'
  },
  {
    name: 'Emily Chen',
    role: 'Computer Science Student',
    content: 'From explaining data structures to helping me write better essays, this platform is the ultimate study companion.',
    avatar: 'EC'
  }
]

export function SocialProofSection() {
  return (
    <section className="relative py-20 md:py-28 bg-white dark:bg-slate-900 overflow-hidden border-b border-border/50">
      <div className="relative z-10 max-w-[88rem] mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <p className="text-sm font-semibold text-blue-500 mb-4 uppercase tracking-wider">Trusted by professionals across industries</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Loved by people who build the future</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-8 rounded-2xl border border-border bg-card/50 hover:bg-accent/50 backdrop-blur-sm transition-colors"
            >
              <div className="flex gap-1 mb-6 text-yellow-500">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">"{t.content}"</p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center text-blue-500 font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

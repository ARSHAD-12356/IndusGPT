'use client'

import Link from 'next/link'
import { ArrowRight, Play, MessageSquare, Sparkles, Zap } from 'lucide-react'
import { AnimatedWord } from './animated-headline'

const CHAT_MESSAGES = [
  { role: 'user', text: 'Explain binary search trees to me' },
  { role: 'ai', text: 'A binary search tree (BST) is a node-based data structure where each node has at most two children...' },
  { role: 'user', text: 'Can you write the code in Python?' },
  { role: 'ai', text: "Sure! Here's a clean BST implementation in Python with insert and search methods." },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#05050a]">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* ── TWO-COLUMN HERO ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pt-24 lg:pt-28 pb-10 flex flex-col lg:flex-row lg:items-center lg:gap-16 gap-14">

        {/* ── LEFT: Content ── */}
        <div className="flex-1 flex flex-col items-start text-left max-w-xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs text-gray-400 mb-8">
            <Zap size={12} className="text-blue-400" />
            <span>Powered by advanced multi-role AI models</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-bold text-white leading-[1.08] tracking-tight mb-6">
            AI for Students,{' '}
            <span className="block">Developers &</span>
            <AnimatedWord />
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl font-semibold text-white/80 mb-3 leading-snug">
            Solve doubts. Write code. Analyze data —{' '}
            <span className="text-white">all in one place.</span>
          </p>

          {/* Description */}
          <p className="text-sm text-gray-400 mb-10 leading-relaxed max-w-sm">
            IndusGPT helps you learn faster, debug smarter, and generate insights instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link href="/signup">
              <button className="group flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm
                bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500
                shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.03]
                transition-all duration-300">
                Get Started Free
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm text-white/80 hover:text-white
              border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10
              transition-all duration-300">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                <Play size={8} className="ml-0.5 fill-current" />
              </div>
              View Demo
            </button>
          </div>
        </div>

        {/* ── RIGHT: Glass AI Chat Card ── */}
        <div className="flex-1 flex items-center justify-center lg:justify-end relative">
          {/* Glow behind card */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[480px] h-[380px] bg-blue-600/15 rounded-full blur-[80px]" />
            <div className="absolute w-[360px] h-[260px] bg-purple-600/10 rounded-full blur-[60px]" />
          </div>

          {/* Floating card */}
          <div
            className="animate-float relative w-full max-w-[540px] rounded-2xl border border-white/12 bg-white/[0.05] backdrop-blur-2xl shadow-2xl shadow-black/70 overflow-hidden ring-1 ring-white/5"
          >
            {/* Card header (traffic lights) */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/10 bg-white/[0.04]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              <div className="flex items-center gap-2 ml-2">
                <MessageSquare size={13} className="text-blue-400" />
                <span className="text-xs text-gray-400 font-medium">IndusGPT — Study Session</span>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-[11px] text-green-400 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Online
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex flex-col gap-3.5 p-6">
              {CHAT_MESSAGES.map((msg, i) => (
                <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-blue-500/30">
                      <Sparkles size={12} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600/35 border border-blue-500/30 text-blue-100 rounded-tr-sm'
                      : 'bg-white/[0.06] border border-white/10 text-gray-300 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                  <Sparkles size={12} className="text-white" />
                </div>
                <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-white/[0.06] border border-white/10 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>

            {/* Card input bar */}
            <div className="px-6 pb-5">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="text-xs text-gray-500 flex-1">Ask anything...</span>
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <ArrowRight size={11} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-10 pb-20 mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/8 bg-white/[0.02] backdrop-blur-md">
          {[
            { icon: '🎓', value: '10,000+', label: 'learners', prefix: 'Built for' },
            { icon: '⚡', value: '5M+', label: 'prompts run', prefix: '' },
            { icon: '👥', value: '100K+', label: 'users', prefix: '' },
            { icon: '🔄', value: '99.9%', label: 'uptime', prefix: '' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3 px-6 py-5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600/25 to-purple-600/25 border border-white/10 flex items-center justify-center text-base shrink-0">
                {stat.icon}
              </div>
              <div>
                <div className="text-sm font-light text-gray-400">
                  {stat.prefix && <span>{stat.prefix} </span>}
                  <span className="font-bold text-white text-base">{stat.value}</span>
                </div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}

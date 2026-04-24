'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, MessageSquare, Sparkles, Zap } from 'lucide-react'
import { AnimatedWord } from './animated-headline'

const CHAT_STEPS = [
  {
    prompt: 'Explain binary search trees to me',
    reply: 'A binary search tree stores sorted data where left nodes are smaller and right nodes are larger.'
  },
  {
    prompt: 'Can you write Python code for insert?',
    reply: 'Sure. Define a Node class, then recursively place values left or right based on comparisons.'
  },
  {
    prompt: 'How do I search efficiently in BST?',
    reply: 'At each step, compare target with current node and move left or right until found or null.'
  },
  {
    prompt: 'When should I use AVL or Red-Black tree?',
    reply: 'Use self-balancing trees when frequent inserts can skew depth and you need predictable O(log n).'
  },
]

export function HeroSection() {
  const MAX_VISIBLE_TURNS = 2
  const [activeStep, setActiveStep] = useState(0)
  const [inputDraft, setInputDraft] = useState('')
  const [visibleTurns, setVisibleTurns] = useState<Array<{ prompt: string; reply: string }>>([])
  const [isReplyTyping, setIsReplyTyping] = useState(false)
  const [isSendPulsing, setIsSendPulsing] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [visibleTurns, isReplyTyping])

  useEffect(() => {
    let isCancelled = false
    const step = CHAT_STEPS[activeStep]
    let promptIndex = 0
    const promptSpeedMin = 26
    const promptSpeedMax = 42
    const replySpeedMin = 18
    const replySpeedMax = 30
    const pauseAfterPrompt = 260
    const pauseAfterReply = 1400
    const pauseBeforeReplyTyping = 250

    setInputDraft('')
    setIsReplyTyping(false)

    const randomDelay = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min

    const typePrompt = () => {
      const tick = () => {
        if (isCancelled) return
        promptIndex += 1
        setInputDraft(step.prompt.slice(0, promptIndex))
        if (promptIndex >= step.prompt.length) {
          window.setTimeout(() => {
            if (isCancelled) return
            setIsSendPulsing(true)
            setVisibleTurns((prev) => {
              const next = [...prev, { prompt: step.prompt, reply: '' }]
              return next.slice(-MAX_VISIBLE_TURNS)
            })
            setInputDraft('')
            window.setTimeout(() => {
              if (isCancelled) return
              setIsSendPulsing(false)
            }, 220)
            window.setTimeout(() => {
              if (isCancelled) return
              setIsReplyTyping(true)
              typeReply()
            }, pauseBeforeReplyTyping)
          }, pauseAfterPrompt)
          return
        }
        window.setTimeout(tick, randomDelay(promptSpeedMin, promptSpeedMax))
      }

      tick()
    }

    const typeReply = () => {
      let replyIndex = 0
      const tick = () => {
        if (isCancelled) return
        replyIndex += 1
        const partialReply = step.reply.slice(0, replyIndex)
        setVisibleTurns((prev) => {
          if (prev.length === 0) return prev
          const next = [...prev]
          next[next.length - 1] = { ...next[next.length - 1], reply: partialReply }
          return next
        })
        if (replyIndex >= step.reply.length) {
          setIsReplyTyping(false)
          window.setTimeout(() => {
            if (isCancelled) return
            setActiveStep((prev) => (prev + 1) % CHAT_STEPS.length)
          }, pauseAfterReply)
          return
        }
        window.setTimeout(tick, randomDelay(replySpeedMin, replySpeedMax))
      }

      tick()
    }

    typePrompt()

    return () => {
      isCancelled = true
    }
  }, [activeStep, MAX_VISIBLE_TURNS])

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-background">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* ── TWO-COLUMN HERO ── */}
      <div className="relative z-10 w-full max-w-[88rem] mx-auto px-4 lg:px-6 pt-16 lg:pt-10 pb-10 flex flex-col lg:flex-row lg:items-center lg:gap-16 gap-14">

        {/* ── LEFT: Content ── */}
        <div className="flex-1 flex flex-col items-start text-left max-w-xl">

          {/* Badge */}
          <div className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-accent/50 backdrop-blur-sm text-xs text-muted-foreground mb-5">
            <Zap size={12} className="text-blue-500" />
            <span>Powered by advanced multi-role AI models</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-bold text-foreground leading-[1.08] tracking-tight mb-6">
            AI for Students,{' '}
            <span className="block">Developers &</span>
            <AnimatedWord />
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl font-semibold text-foreground/80 mb-3 leading-snug">
            Solve doubts. Write code. Analyze data —{' '}
            <span className="text-foreground">all in one place.</span>
          </p>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-10 leading-relaxed max-w-sm">
            IndusGPT helps you learn faster, debug smarter, and generate insights instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link href="/signup">
              <button className="group flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-white text-sm
                bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500
                shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.03]
                transition-all duration-300">
                Get Started Free
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button className="flex items-center gap-2.5 px-7 py-3.5 rounded-lg font-semibold text-sm text-foreground/80 hover:text-foreground
              border border-border hover:border-border/80 bg-accent/50 hover:bg-accent
              transition-all duration-300">
              <div className="w-5 h-5 rounded-full bg-accent/80 flex items-center justify-center">
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
            className="animate-float relative w-full max-w-[540px] rounded-2xl border border-border bg-card/80 backdrop-blur-2xl shadow-2xl overflow-hidden ring-1 ring-border/5"
          >
            {/* Card header (traffic lights) */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-accent/30">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              <div className="flex items-center gap-2 ml-2">
                <MessageSquare size={13} className="text-blue-500" />
                <span className="text-xs text-muted-foreground font-medium">IndusGPT — Study Session</span>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-[11px] text-green-500 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Online
              </div>
            </div>

            {/* Chat messages */}
            <div 
              ref={scrollContainerRef}
              className="h-[300px] overflow-y-auto scrollbar-hide flex flex-col gap-3.5 p-6"
            >
              {visibleTurns.map((turn, i) => (
                <div key={`${turn.prompt}-${i}`} className="flex flex-col gap-3.5 transition-all duration-500">
                  <div className={`flex items-start gap-3 flex-row-reverse ${i === visibleTurns.length - 1 ? 'animate-in fade-in slide-in-from-bottom-2 duration-300' : ''}`}>
                    <div className="max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed bg-blue-600/20 border border-blue-500/30 text-blue-600 dark:text-blue-100 rounded-tr-sm">
                      {turn.prompt}
                    </div>
                  </div>
                  {turn.reply && (
                    <div className={`flex items-start gap-3 ${i === visibleTurns.length - 1 ? 'animate-in fade-in slide-in-from-bottom-2 duration-300' : ''}`}>
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-blue-500/30">
                        <Sparkles size={12} className="text-white" />
                      </div>
                      <div className="max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed bg-accent border border-border text-foreground rounded-tl-sm">
                        {turn.reply}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isReplyTyping && visibleTurns[visibleTurns.length - 1] && !visibleTurns[visibleTurns.length - 1].reply && (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                    <Sparkles size={12} className="text-white" />
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-accent border border-border flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Card input bar */}
            <div className="px-6 pb-5">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-accent border border-border">
                <span className="text-xs text-muted-foreground flex-1 truncate">{inputDraft || 'Ask anything...'}</span>
                <div className={`w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transition-transform duration-200 ${isSendPulsing ? 'scale-110' : 'scale-100'}`}>
                  <ArrowRight size={11} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="relative z-10 w-full max-w-[88rem] mx-auto px-6 pb-20 mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-border bg-accent/50 backdrop-blur-md">
          {[
            { icon: '🎓', value: '10,000+', label: 'learners', prefix: 'Built for' },
            { icon: '⚡', value: '5M+', label: 'prompts run', prefix: '' },
            { icon: '👥', value: '100K+', label: 'users', prefix: '' },
            { icon: '🔄', value: '99.9%', label: 'uptime', prefix: '' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3 px-6 py-5 bg-card hover:bg-accent transition-colors">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600/25 to-purple-600/25 border border-border flex items-center justify-center text-base shrink-0">
                {stat.icon}
              </div>
              <div>
                <div className="text-sm font-light text-muted-foreground">
                  {stat.prefix && <span>{stat.prefix} </span>}
                  <span className="font-bold text-foreground text-base">{stat.value}</span>
                </div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}

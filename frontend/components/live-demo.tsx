'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Sparkles, ArrowRight, Code } from 'lucide-react'

const DEMO_STEPS = [
  {
    role: 'Student',
    prompt: 'Can you summarize the process of photosynthesis simply?',
    reply: 'Photosynthesis is how plants make food. They use sunlight, water, and carbon dioxide to produce oxygen and energy in the form of sugar.'
  },
  {
    role: 'Developer',
    prompt: 'How to optimize a large list rendering in React?',
    reply: 'Use virtual scrolling with @tanstack/react-virtual. It only renders items currently visible in the viewport, drastically improving performance.'
  },
  {
    role: 'Data Analyst',
    prompt: 'What is the best way to handle missing values in Pandas?',
    reply: 'You can use df.fillna() to replace them with mean/median, or df.dropna() to remove them depending on the dataset size and importance.'
  },
  {
    role: 'Mechanical Engineer',
    prompt: 'How do I calculate the bending stress of a cantilever beam?',
    reply: 'Use the flexure formula: σ = (M * y) / I. M is the bending moment, y is the distance to the neutral axis, and I is the moment of inertia.'
  },
  {
    role: 'Civil Engineer',
    prompt: 'What are the key factors for designing a retaining wall?',
    reply: 'Consider lateral earth pressure, bearing capacity of soil, sliding resistance, and proper drainage (weep holes) to prevent water buildup.'
  },
  {
    role: 'Electrical Engineer',
    prompt: 'How do I reduce power loss in long transmission lines?',
    reply: 'Increase the transmission voltage. Power loss is proportional to the square of the current (I²R), so stepping up voltage significantly reduces current.'
  },
  {
    role: 'Doctor',
    prompt: 'What are the differentials for acute lower right quadrant pain?',
    reply: 'Common differentials include appendicitis, ectopic pregnancy, ovarian torsion, renal colic, and mesenteric adenitis. Further imaging is recommended.'
  },
  {
    role: 'Patient',
    prompt: 'What should I do if I missed a dose of my blood pressure medication?',
    reply: 'Take it as soon as you remember. However, if it is almost time for your next dose, skip the missed one. Do not double the dose.'
  }
]

export function LiveDemoSection() {
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
    const step = DEMO_STEPS[activeStep]
    let promptIndex = 0
    const promptSpeedMin = 30
    const promptSpeedMax = 50
    const replySpeedMin = 20
    const replySpeedMax = 35
    const pauseAfterPrompt = 300
    const pauseAfterReply = 2500
    const pauseBeforeReplyTyping = 300

    setInputDraft('')
    setIsReplyTyping(false)
    setVisibleTurns([]) // Clear chat for new profession

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
            setVisibleTurns([{ prompt: step.prompt, reply: '' }])
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
        setVisibleTurns([{ prompt: step.prompt, reply: partialReply }])
        if (replyIndex >= step.reply.length) {
          setIsReplyTyping(false)
          window.setTimeout(() => {
            if (isCancelled) return
            setActiveStep((prev) => (prev + 1) % DEMO_STEPS.length)
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
  }, [activeStep])

  const currentRole = DEMO_STEPS[activeStep].role

  return (
    <section className="relative py-20 md:py-28 bg-gray-50 dark:bg-slate-800 overflow-hidden border-b border-border/50">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-[88rem] mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            See IndusGPT in Action
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See how IndusGPT solves real-world problems instantly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="w-full rounded-2xl border border-border bg-card/60 backdrop-blur-2xl shadow-2xl overflow-hidden ring-1 ring-border/5">
            {/* Window Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-accent/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Code size={14} className="text-purple-500" />
                <span className="text-sm text-muted-foreground font-medium transition-all duration-300">
                  Workspace — {currentRole}
                </span>
              </div>
            </div>

            {/* Chat Body - Fixed Height */}
            <div 
              ref={scrollContainerRef}
              className="h-[320px] md:h-[400px] overflow-y-auto scrollbar-hide p-6 md:p-10 flex flex-col gap-6"
            >
              {visibleTurns.map((turn, i) => (
                <div key={i} className="flex flex-col gap-6">
                  {/* User Message */}
                  <div className="flex items-start gap-4 flex-row-reverse animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="max-w-[85%] md:max-w-[70%] px-5 py-4 rounded-2xl text-sm leading-relaxed bg-blue-600/20 border border-blue-500/30 text-blue-600 dark:text-blue-100 rounded-tr-sm">
                      {turn.prompt}
                    </div>
                  </div>

                  {/* AI Response */}
                  {turn.reply && (
                    <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30 mt-1">
                        <Sparkles size={14} className="text-white" />
                      </div>
                      <div className="max-w-[85%] md:max-w-[70%] px-5 py-4 rounded-2xl text-sm leading-relaxed bg-accent border border-border text-foreground rounded-tl-sm">
                        {turn.reply}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isReplyTyping && visibleTurns.length > 0 && !visibleTurns[0].reply && (
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30 mt-1">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-accent border border-border flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-6 pt-2 bg-card/30">
              <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-accent border border-border">
                <span className="text-sm text-muted-foreground flex-1 truncate">{inputDraft || 'Ask anything...'}</span>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transition-transform duration-200 ${isSendPulsing ? 'scale-110' : 'scale-100'}`}>
                  <ArrowRight size={14} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

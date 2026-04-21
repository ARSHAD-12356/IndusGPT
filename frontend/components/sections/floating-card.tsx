'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

const PROMPTS = [
  {
    prompt: 'Explain machine learning in simple words',
    response: 'Machine learning is when computers learn patterns from data without being explicitly programmed. They improve at tasks by seeing examples, just like humans learn from experience.'
  },
  {
    prompt: 'Write a Python function to reverse a string',
    response: 'def reverse_string(s):\n    return s[::-1]\n\ntext = "hello"\nprint(reverse_string(text))  # Output: olleh'
  },
  {
    prompt: 'Give 5 startup ideas using AI',
    response: 'AI-powered content creation studio, personalized learning platforms, intelligent customer support automation, predictive healthcare analytics, and smart document processing tools.'
  },
  {
    prompt: 'Write a LinkedIn post about learning React',
    response: 'Excited to share that I\'ve started learning React! 🚀 Building interactive UIs with components and hooks is incredibly rewarding. Looking forward to mastering state management and hooks.'
  },
  {
    prompt: 'Create a daily productivity routine',
    response: '1. Morning: Plan 3 goals (8am)\n2. Deep work: 2-hour focused session (9-11am)\n3. Break: Walk & lunch (11am-12pm)\n4. Meetings: Collaboration (1-3pm)\n5. Review: Track progress (4-5pm)'
  },
  {
    prompt: 'Summarize the concept of blockchain',
    response: 'Blockchain is a distributed ledger technology that records transactions in a chain of encrypted blocks. Each block references the previous one, creating an immutable, transparent record.'
  },
  {
    prompt: 'How can I improve my coding skills?',
    response: 'Build projects daily, contribute to open source, read others\' code, practice algorithmic challenges, take online courses, and join developer communities. Consistency is key.'
  },
  {
    prompt: 'Explain the difference between frontend and backend',
    response: 'Frontend is what users see and interact with (UI, buttons, forms). Backend handles server logic, databases, and business logic. Together they create a complete web application.'
  },
  {
    prompt: 'What is cloud computing?',
    response: 'Cloud computing delivers computing services over the internet: storage, processing power, and applications. Benefits include scalability, flexibility, cost savings, and no physical infrastructure needed.'
  },
  {
    prompt: 'Create a weekly learning schedule for web development',
    response: 'Monday-Tuesday: HTML/CSS fundamentals, Wednesday-Thursday: JavaScript core concepts, Friday: Practice with projects, Weekend: Build one complete project, Review and plan next week.'
  }
]

export function FloatingCards() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayedPrompt, setDisplayedPrompt] = useState('')
  const [displayedResponse, setDisplayedResponse] = useState('')
  const [phase, setPhase] = useState<'TYPING_PROMPT' | 'PAUSE_AFTER_PROMPT' | 'THINKING' | 'TYPING_RESPONSE' | 'PAUSED'>('TYPING_PROMPT')

  const currentPrompt = PROMPTS[currentIndex]

  // Typing animation with thinking dots
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (phase === 'TYPING_PROMPT') {
      if (displayedPrompt.length < currentPrompt.prompt.length) {
        timer = setTimeout(() => {
          setDisplayedPrompt((prev) => prev + currentPrompt.prompt[displayedPrompt.length])
        }, 30) // type prompt faster
      } else {
        setPhase('PAUSE_AFTER_PROMPT')
      }
    } else if (phase === 'PAUSE_AFTER_PROMPT') {
      timer = setTimeout(() => {
        setPhase('THINKING')
      }, 500)
    } else if (phase === 'THINKING') {
      timer = setTimeout(() => {
        setPhase('TYPING_RESPONSE')
      }, 1000) // thinking duration
    } else if (phase === 'TYPING_RESPONSE') {
      if (displayedResponse.length < currentPrompt.response.length) {
        timer = setTimeout(() => {
          setDisplayedResponse((prev) => prev + currentPrompt.response[displayedResponse.length])
        }, 15) // Faster typing for premium feel
      } else {
        setPhase('PAUSED')
      }
    } else if (phase === 'PAUSED') {
      timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % PROMPTS.length)
        setDisplayedPrompt('')
        setDisplayedResponse('')
        setPhase('TYPING_PROMPT')
      }, 3000) // 3 second pause between prompts
    }

    return () => clearTimeout(timer)
  }, [phase, displayedPrompt, displayedResponse, currentPrompt, currentIndex])

  return (
    <div className="relative h-[500px] w-full flex items-center justify-end perspective">
      {/* Animated background gradient elements */}
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-shimmer-gradient" />
      <div className="absolute -bottom-20 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl opacity-50" />

      {/* Single Floating Card - Right Aligned */}
      <div className="relative z-10 w-full max-w-md pr-6 lg:pr-0">
        <div className="relative p-8 backdrop-blur-xl bg-white/8 border border-white/15 rounded-3xl hover:border-white/25 transition-all duration-500 animate-subtle-float shadow-2xl shadow-blue-600/20 hover:shadow-blue-500/40 group overflow-hidden">
          {/* Subtle glow border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          {/* Card header - relative to keep above gradient */}
          <div className="relative z-10 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">AI Prompt</span>
            </div>
            <p className="text-white text-sm font-medium leading-relaxed">
              {displayedPrompt}
              {phase === 'TYPING_PROMPT' && (
                <span className="inline-block w-1 h-4 ml-0.5 bg-white animate-pulse" />
              )}
            </p>
          </div>

          {/* Thinking dots - shows before typing starts */}
          {phase === 'THINKING' && (
            <div className="relative z-10 flex items-center gap-2 mb-4">
              <span className="text-xs text-gray-400">Thinking</span>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          )}

          {/* Typing animation response */}
          <div className="relative z-10 text-gray-200 text-sm leading-relaxed min-h-20 font-light whitespace-pre-wrap">
            <span>{displayedResponse}</span>
            {phase === 'TYPING_RESPONSE' && (
              <span className="inline-block w-1 h-4 ml-0.5 bg-blue-400 animate-pulse" />
            )}
          </div>

          {/* Footer with progress indicators */}
          <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10 mt-6">
            <span className="text-xs text-gray-400">IndusGPT AI</span>
            <div className="flex gap-1.5">
              {PROMPTS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'bg-blue-400 w-5' : 'bg-gray-600/40 w-1.5'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

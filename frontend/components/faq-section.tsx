'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    question: 'Is it free to use?',
    answer: 'Yes, we offer a generous Free plan that gives you access to standard models, enough for basic daily usage. For advanced features and unlimited access, you can upgrade to our Pro plan.'
  },
  {
    question: 'Which AI models are used?',
    answer: 'IndusGPT utilizes a multi-role architecture, seamlessly switching between industry-leading models like GPT-4o, Claude 3.5 Sonnet, and specialized open-source models depending on the complexity of your task to ensure the highest quality results.'
  },
  {
    question: 'Is my data safe and private?',
    answer: 'Absolutely. We employ enterprise-grade encryption for all data in transit and at rest. We do not use your personal workspace data to train our public models without explicit consent.'
  },
  {
    question: 'Can I use IndusGPT for professional work?',
    answer: 'Yes, IndusGPT is designed for real-world tasks including coding, data analysis, research, and industry-specific workflows.'
  },
  {
    question: 'Which industries does IndusGPT support?',
    answer: 'IndusGPT supports multiple industries including software development, engineering, healthcare, data analytics, and content creation.'
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="relative py-20 md:py-28 bg-gray-50 dark:bg-slate-800">
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about the product and billing.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="border border-border bg-card/30 rounded-2xl overflow-hidden transition-colors hover:bg-card/50"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="font-semibold text-foreground">{faq.question}</span>
                <ChevronDown 
                  className={`text-muted-foreground transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-blue-500' : ''}`} 
                  size={20} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

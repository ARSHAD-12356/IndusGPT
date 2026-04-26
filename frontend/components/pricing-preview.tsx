'use client'

import { motion } from 'framer-motion'
import { Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for exploring AI capabilities and light usage.',
    features: [
      'Access to standard AI models',
      '100 queries per day',
      'Basic code & text generation',
      'Community support'
    ],
    buttonText: 'Get Started Free',
    isPro: false
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/mo',
    description: 'For professionals who need maximum power and no limits. Best for professionals and teams.',
    features: [
      'Access to advanced multi-role models',
      'Unlimited queries',
      'Priority processing speed',
      'Advanced data analysis & vision',
      'Premium email support'
    ],
    buttonText: 'Upgrade to Pro',
    isPro: true
  }
]

export function PricingPreviewSection() {
  return (
    <section id="pricing" className="relative py-20 md:py-28 bg-gradient-to-b from-purple-50 to-white dark:from-slate-800 dark:to-slate-900 overflow-hidden border-t border-border/50">
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-[88rem] mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the plan that fits your professional needs. No hidden fees. <span className="font-medium text-foreground">No credit card required.</span>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col p-8 rounded-2xl border ${plan.isPro ? 'border-blue-500/50 bg-card/80 shadow-2xl shadow-blue-500/10' : 'border-border bg-card/40'} backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 overflow-hidden`}
            >
              {plan.isPro && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                  <Zap size={12} className="fill-white" /> Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-semibold text-foreground mb-2">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-6 h-10">{plan.description}</p>
              
              <div className="mb-8">
                <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground font-medium">{plan.period}</span>}
              </div>

              <div className="flex flex-col gap-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.isPro ? 'bg-blue-500/20 text-blue-500' : 'bg-accent text-muted-foreground'}`}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                className={`w-full py-6 rounded-xl font-semibold text-base transition-all duration-300 ${plan.isPro ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40' : 'bg-accent hover:bg-accent/80 text-foreground border border-border'}`}
              >
                {plan.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

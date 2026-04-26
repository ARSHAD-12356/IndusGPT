'use client'

import Link from 'next/link'
import { Zap, Twitter, Github, Linkedin, Mail } from 'lucide-react'

const FOOTER_LINKS = {
  Product: ['Features', 'AI Capabilities', 'Integrations', 'Pricing', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
  Resources: ['Documentation', 'API Reference', 'Tutorials', 'Community', 'Support'],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative dark bg-slate-900 text-white border-t border-white/10 overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      <div className="max-w-[88rem] mx-auto px-6 py-16">
        <div className="grid md:grid-cols-5 gap-12 mb-14">

          {/* Brand column */}
          <div className="md:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap size={15} className="text-white fill-white" />
              </div>
              <span className="text-foreground font-bold text-xl tracking-tight">
                Indus<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">GPT</span>
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Your intelligent AI assistant for students, developers, and data analysts. Think faster. Build smarter.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Twitter, href: '#' },
                { icon: Github, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Mail, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-xl border border-border bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/80 hover:border-border transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground tracking-wide">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} IndusGPT. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

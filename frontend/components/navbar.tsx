'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  Menu,
  X,
  Zap,
  Sparkles,
  Brain,
  Plug,
  GraduationCap,
  Code,
  LineChart,
  FileText,
  Newspaper,
  Terminal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'

const NAV_ITEMS = [
  {
    label: 'Product',
    dropdown: [
      { id: 'features', label: 'Features', desc: 'Explore all AI tools and capabilities', icon: Sparkles },
      { id: 'ai-models', label: 'AI Capabilities', desc: 'State-of-the-art intelligent models', icon: Brain },
      { id: 'integrations', label: 'Integrations', desc: 'Connect seamlessly with your stack', icon: Plug },
    ]
  },
  {
    label: 'Solutions',
    dropdown: [
      { id: 'students', label: 'For Students', desc: 'Study smarter, not harder', icon: GraduationCap },
      { id: 'developers', label: 'For Developers', desc: 'Ship code blazingly fast', icon: Code },
      { id: 'data-analysts', label: 'For Data Analysts', desc: 'Generate instant insights', icon: LineChart },
    ]
  },
  {
    label: 'Pricing',
    href: '#pricing'
  },
  {
    label: 'Resources',
    dropdown: [
      { id: 'docs', label: 'Documentation', desc: 'Everything you need to build', icon: FileText },
      { id: 'blog', label: 'Blog', desc: 'Latest updates & product news', icon: Newspaper },
      { id: 'tutorials', label: 'Tutorials', desc: 'Step-by-step technical guides', icon: Terminal },
    ]
  }
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Mobile submenu state: track which dropdown is currently open
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-2xl'
        : 'bg-transparent border-b border-transparent'
        }`}
    >
      <div className="max-w-[88rem] mx-auto px-6 py-3.5 flex items-center justify-between gap-8">
        
        {/* ─── Logo ─── */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow duration-300">
            <Zap size={16} className="text-white fill-white" />
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="text-foreground font-bold text-xl tracking-tight">
            Indus<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">GPT</span>
          </span>
        </Link>

        {/* ─── Desktop Navigation ─── */}
        <div className="hidden lg:flex items-center gap-2 flex-1 justify-center">
          {NAV_ITEMS.map((item) => (
            item.dropdown ? (
              <div key={item.label} className="relative group">
                <button
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    className="opacity-60 group-hover:rotate-180 group-hover:text-white transition-transform duration-300"
                  />
                </button>

                {/* Hover Dropdown panel */}
                <div className="absolute top-[90%] left-1/2 -translate-x-1/2 pt-4 opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                  <div className="w-[340px] rounded-2xl bg-popover backdrop-blur-3xl border border-border shadow-2xl p-2.5 relative overflow-hidden ring-1 ring-border/5">
                    {/* Subtle gradient effect inside dropdown */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-50 pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col gap-1">
                      {item.dropdown.map((subItem) => (
                        <Link 
                          href={`#${subItem.id}`}
                          key={subItem.label}
                          className="flex items-start gap-4 px-4 py-3 rounded-[14px] hover:bg-accent transition-all duration-200 group/item"
                        >
                          <div className="mt-0.5 w-9 h-9 rounded-xl bg-accent/50 border border-border flex items-center justify-center shrink-0 group-hover/item:border-border/80 transition-all shadow-sm">
                            <subItem.icon size={16} className="text-muted-foreground group-hover/item:text-blue-500 transition-colors" />
                          </div>
                          <div>
                            <div className="text-[14px] font-semibold text-foreground group-hover/item:text-foreground transition-colors">{subItem.label}</div>
                            <div className="text-[13px] text-muted-foreground mt-0.5 leading-snug">{subItem.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href || '#'}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
              >
                {item.label}
              </Link>
            )
          ))}
        </div>

        {/* ─── Desktop CTA ─── */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link href="/login">
            <Button
              className="bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent text-sm font-medium h-9 px-4 transition-all duration-300 rounded-lg shadow-none"
            >
              Login
            </Button>
          </Link>
          <ModeToggle />
          <Link href="/signup">
            <Button
              className="relative h-9 px-5 text-sm font-semibold text-white overflow-hidden rounded-[10px]
                bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600
                hover:from-blue-500 hover:via-blue-400 hover:to-purple-500
                border-0 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40
                transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started Free
            </Button>
          </Link>
        </div>

        {/* ─── Mobile Menu Toggle ─── */}
        <div className="lg:hidden flex items-center gap-2">
          <ModeToggle />
          <button
            className="text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ─── Mobile Menu ─── */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-background/95 backdrop-blur-2xl border-t border-border ${isMobileMenuOpen ? 'max-h-[85vh] opacity-100 border-t' : 'max-h-0 opacity-0 border-t-transparent'
          }`}
      >
        <div className="px-6 py-6 flex flex-col gap-4 overflow-y-auto max-h-[85vh]">
          {NAV_ITEMS.map((item) => (
            item.dropdown ? (
              <div key={item.label} className="flex flex-col border-b border-white/5 pb-2 last:border-0 last:pb-0">
                <button 
                  onClick={() => setOpenMobileMenu(openMobileMenu === item.label ? null : item.label)}
                  className="flex items-center justify-between w-full py-2.5 text-left"
                >
                  <span className="text-[15px] font-semibold text-foreground">{item.label}</span>
                  <ChevronDown size={18} className={`text-muted-foreground transition-transform duration-200 ${openMobileMenu === item.label ? 'rotate-180' : ''}`} />
                </button>
                <div className={`flex flex-col gap-1 overflow-hidden transition-all duration-300 ${openMobileMenu === item.label ? 'max-h-[400px] mt-2 mb-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                    {item.dropdown.map(subItem => (
                      <Link 
                        key={subItem.label} 
                        href={`#${subItem.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-accent transition-colors"
                      >
                         <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                           <subItem.icon size={16} className="text-blue-500" />
                         </div>
                         <div className="flex flex-col">
                           <span className="text-[14px] font-medium text-foreground">{subItem.label}</span>
                           <span className="text-[12px] text-muted-foreground">{subItem.desc}</span>
                         </div>
                      </Link>
                    ))}
                </div>
              </div>
            ) : (
               <Link
                key={item.label}
                href={item.href || '#'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-[15px] font-semibold text-foreground border-b border-border last:border-0"
              >
                {item.label}
              </Link>
            )
          ))}
          
          {/* Mobile CTAs */}
          <div className="flex flex-col gap-3 pt-6 mt-2 border-t border-white/10">
            <Link href="/login" className="w-full">
              <Button
                variant="outline"
                className="w-full border-border text-foreground bg-transparent hover:bg-accent transition-colors h-11 rounded-xl font-medium"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup" className="w-full">
              <Button
                className="w-full text-[15px] font-semibold text-white h-11 rounded-xl
                  bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600
                  hover:from-blue-500 hover:via-blue-400 hover:to-purple-500
                  border-0 shadow-lg shadow-blue-500/25 transition-all duration-200"
              >
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}


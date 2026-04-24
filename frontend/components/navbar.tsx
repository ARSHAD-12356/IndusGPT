'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'

const NAV_LINKS = [
  { label: 'Features', href: '/features' },
  { label: 'Use Cases', href: '/use-cases' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
]

export function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const openDrawer = () => {
    setIsMobileMenuVisible(true)
    setTimeout(() => setIsMobileMenuOpen(true), 10)
  }

  const closeDrawer = () => {
    setIsMobileMenuOpen(false)
    setTimeout(() => setIsMobileMenuVisible(false), 300)
  }

  const isActive = (href: string) => pathname === href

  return (
    <>
      <nav
        className={`sticky top-0 mt-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm' 
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[88rem] mx-auto px-6 h-20 flex items-center justify-between relative">
          
          {/* LEFT: Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                <Zap size={20} className="text-white fill-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                Indus<span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">GPT</span>
              </span>
            </Link>
          </div>

          {/* CENTER: Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 gap-12">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-all duration-200 relative group/link ${
                  isActive(href) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${
                  isActive(href) ? 'w-full' : 'w-0 group-hover/link:w-full'
                }`} />
              </Link>
            ))}
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden lg:flex items-center gap-6 mr-2">
              <ModeToggle />
              <Link href="/login" className="text-sm font-semibold text-white px-6 h-11 flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all">
                Login
              </Link>
            </div>
            
            <Link href="/signup" className="hidden lg:block">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-6 h-11 rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all">
                Get Started Free
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center gap-3">
              <ModeToggle />
              <button
                onClick={openDrawer}
                className="p-2 text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuVisible && (
        <div 
          className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeDrawer}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
          
          <div 
            className={`absolute top-0 right-0 h-full w-[85%] max-w-[360px] bg-background/95 backdrop-blur-2xl shadow-[-10px_0_30px_rgba(0,0,0,0.2)] border-l border-white/10 p-0 flex flex-col transition-transform duration-500 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header with Background Glow */}
            <div className="relative overflow-hidden px-8 py-10 border-b border-border/50">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl" />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Zap size={16} className="text-white fill-white" />
                  </div>
                  <span className="text-lg font-bold">IndusGPT</span>
                </div>
                <button 
                  onClick={closeDrawer} 
                  className="p-2.5 hover:bg-accent rounded-full transition-all duration-200 hover:rotate-90 active:scale-90"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Menu Links */}
            <div className="flex flex-col py-6 px-4">
              <div className="px-4 mb-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Navigation</div>
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeDrawer}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                      isActive(href) 
                        ? 'bg-blue-500/10 text-blue-500 font-bold shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]' 
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <span className="text-base">{label}</span>
                    <ArrowRight size={16} className={`transition-transform duration-300 ${isActive(href) ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="mt-auto p-8 bg-accent/30 border-t border-border/50">
              <div className="flex flex-col gap-4">
                <Link 
                  href="/login" 
                  onClick={closeDrawer} 
                  className="flex items-center justify-center py-4 rounded-xl font-bold text-foreground border border-border bg-background hover:bg-accent transition-all duration-300 shadow-sm active:scale-[0.98]"
                >
                  Sign In
                </Link>
                <Link href="/signup" onClick={closeDrawer}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 h-14 rounded-xl text-white font-bold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 active:scale-[0.98]">
                    Get Started Free
                  </Button>
                </Link>
                <p className="text-center text-[11px] text-muted-foreground/50 mt-2 font-medium">
                  © 2024 IndusGPT AI. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

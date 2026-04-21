'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Zap, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Login failed')
                setIsLoading(false)
                return
            }

            localStorage.setItem('currentUser', JSON.stringify(data.user))
            
            setTimeout(() => {
                setIsLoading(false)
                router.push('/dashboard')
            }, 500)
        } catch (err) {
            setError('Something went wrong. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">

            {/* Back Button */}
            <Link 
                href="/" 
                className="fixed top-8 left-8 flex items-center text-muted-foreground hover:text-foreground transition-colors z-50 group"
            >
                <div className="w-10 h-10 rounded-full bg-accent border border-border flex items-center justify-center group-hover:bg-accent/80 group-hover:border-border transition-all">
                    <ArrowLeft size={20} />
                </div>
            </Link>

            {/* Subtle ambient blobs */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/6 rounded-full blur-3xl pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/6 rounded-full blur-3xl pointer-events-none" />

            {/* Card */}
            <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden border border-border shadow-2xl flex lg:h-[600px] md:h-[550px]">

                {/* Left Panel */}
                <div className="hidden md:flex flex-col items-center justify-center w-1/2 relative overflow-hidden bg-background">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-background to-purple-950/20" />
                    <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    <div className="relative z-10 flex flex-col items-center gap-6 px-10 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-blue-600/40">
                            <Zap size={28} className="text-white fill-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-foreground tracking-tight">
                                Indus<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">GPT</span>
                            </h2>
                            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                                Your intelligent AI assistant.<br />Think faster. Build smarter.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 mt-4 w-full">
                            {['⚡ AI-powered answers', '💻 Code generation', '🔍 Research assistant'].map((f) => (
                                <div key={f} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent border border-border text-sm text-foreground/80">
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-full md:w-1/2 flex flex-col justify-between bg-card px-8 sm:px-12 py-10">
                    <div className="flex md:hidden items-center gap-3 mb-8">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-600/40">
                            <Zap size={16} className="text-white fill-white" />
                        </div>
                        <span className="text-foreground font-bold text-xl">Indus<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">GPT</span></span>
                    </div>

                    <div className="my-auto">
                        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-2">Welcome back.</h1>
                        <p className="text-muted-foreground text-sm mb-10">Sign in to your account to continue.</p>

                        {error && (
                            <div className="mb-4 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-5 py-3.5 rounded-xl bg-accent border border-border text-foreground placeholder-muted-foreground text-sm outline-none focus:border-blue-500/60 focus:bg-accent/80 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                            />
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-5 py-3.5 pr-12 rounded-xl bg-accent border border-border text-foreground placeholder-muted-foreground text-sm outline-none focus:border-blue-500/60 focus:bg-accent/80 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <div className="flex justify-end">
                                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-blue-400 hover:to-purple-500 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 mt-1"
                            >
                                {isLoading ? 'Signing in…' : 'Continue'}
                            </button>
                        </form>

                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs text-muted-foreground">or continue with</span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                        <div className="flex gap-3">
                            <button type="button" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-accent hover:bg-accent/80 text-muted-foreground hover:text-foreground text-sm font-medium transition-all duration-200">
                                <span className="font-bold">G</span> Google
                            </button>
                            <button type="button" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-accent hover:bg-accent/80 text-muted-foreground hover:text-foreground text-sm font-medium transition-all duration-200">
                                <span className="font-bold">⌥</span> GitHub
                            </button>
                        </div>

                        <p className="text-center text-sm text-muted-foreground mt-8">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">Sign up free</Link>
                        </p>
                    </div>

                    <div className="flex gap-4 justify-center mt-8">
                        <a href="#" className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">Terms of Use</a>
                        <span className="text-border">|</span>
                        <a href="#" className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

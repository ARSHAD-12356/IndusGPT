'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Zap, ArrowLeft } from 'lucide-react'

export default function SignupPage() {
    const router = useRouter()
    const [name, setName] = useState('')
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
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Signup failed')
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
        <div className="min-h-screen bg-black flex items-center justify-center p-4">

            {/* Back Button */}
            <Link 
                href="/" 
                className="fixed top-8 left-8 flex items-center text-gray-400 hover:text-white transition-colors z-50 group"
            >
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                    <ArrowLeft size={20} />
                </div>
            </Link>

            {/* Subtle ambient blobs */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/6 rounded-full blur-3xl pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/6 rounded-full blur-3xl pointer-events-none" />

            {/* Card */}
            <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/80 flex lg:h-[600px] md:h-[550px]">

                {/* Left Panel */}
                <div className="hidden md:flex flex-col items-center justify-center w-1/2 relative overflow-hidden bg-black">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-black to-purple-950" />
                    <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    <div className="relative z-10 flex flex-col items-center gap-6 px-10 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-blue-600/40">
                            <Zap size={28} className="text-white fill-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">
                                Indus<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">GPT</span>
                            </h2>
                            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                                Your intelligent AI assistant.<br />Think faster. Build smarter.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 mt-4 w-full">
                            {['⚡ AI-powered answers', '💻 Code generation', '🔍 Research assistant'].map((f) => (
                                <div key={f} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-gray-300">
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-full md:w-1/2 flex flex-col justify-between bg-[#0d0d0f] px-8 sm:px-12 py-8">
                    <div className="flex md:hidden items-center gap-3 mb-8">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-600/40">
                            <Zap size={16} className="text-white fill-white" />
                        </div>
                        <span className="text-white font-bold text-xl">Indus<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">GPT</span></span>
                    </div>

                    <div className="my-auto">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-2">Join IndusGPT.</h1>
                        <p className="text-gray-400 text-sm mb-6">Start your free trial today.</p>

                        {error && (
                            <div className="mb-4 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                            <input
                                type="text"
                                placeholder="Full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/12 text-white placeholder-gray-500 text-sm outline-none focus:border-blue-500/60 focus:bg-white/8 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                            />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/12 text-white placeholder-gray-500 text-sm outline-none focus:border-blue-500/60 focus:bg-white/8 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                            />
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-5 py-3 pr-12 rounded-xl bg-white/5 border border-white/12 text-white placeholder-gray-500 text-sm outline-none focus:border-blue-500/60 focus:bg-white/8 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            <p className="text-[11px] text-gray-500 leading-relaxed px-1">By signing up, you agree to our Terms of Service and Privacy Policy.</p>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-blue-400 hover:to-purple-500 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 mt-2"
                            >
                                {isLoading ? 'Creating account…' : 'Get started free'}
                            </button>
                        </form>

                        <div className="flex items-center gap-3 my-5">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-xs text-gray-500">or join with</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        <div className="flex gap-3">
                            <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all duration-200">
                                <span className="font-bold">G</span> Google
                            </button>
                            <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all duration-200">
                                <span className="font-bold">⌥</span> GitHub
                            </button>
                        </div>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign in</Link>
                        </p>
                    </div>

                    <div className="flex gap-4 justify-center mt-4">
                        <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Terms of Use</a>
                        <span className="text-gray-700">|</span>
                        <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

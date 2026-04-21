"use client"

import React from 'react'
import { X, Apple, Phone } from 'lucide-react'

interface LoginSignupModalProps {
    isOpen: boolean;
    onClose: () => void;
    themeColor?: string;
}

export function LoginSignupModal({ isOpen, onClose, themeColor = '#3b82f6' }: LoginSignupModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-[#171717] border border-black/5 dark:border-white/10 rounded-[32px] w-full max-w-[440px] p-10 relative animate-in zoom-in-95 slide-in-from-bottom-8 duration-700 ease-out shadow-2xl">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="text-center space-y-3 mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Log in or sign up</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-base font-medium px-4">
                        You'll get smarter responses and can upload files, images, and more.
                    </p>
                </div>

                <div className="space-y-3">
                    <button className="w-full h-14 flex items-center justify-center gap-3 bg-gray-100 dark:bg-[#2f2f2f] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] text-gray-900 dark:text-white font-semibold rounded-full transition-all border border-black/5 dark:border-white/5">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                    </button>
                    <button className="w-full h-14 flex items-center justify-center gap-3 bg-gray-100 dark:bg-[#2f2f2f] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] text-gray-900 dark:text-white font-semibold rounded-full transition-all border border-black/5 dark:border-white/5">
                        <Apple size={20} className="fill-current text-gray-900 dark:text-white" />
                        Continue with Apple
                    </button>
                    <button className="w-full h-14 flex items-center justify-center gap-3 bg-gray-100 dark:bg-[#2f2f2f] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] text-gray-900 dark:text-white font-semibold rounded-full transition-all border border-black/5 dark:border-white/5">
                        <Phone size={20} className="text-gray-900 dark:text-white" />
                        Continue with phone
                    </button>
                </div>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-black/10 dark:border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-[#171717] px-4 text-gray-400 dark:text-gray-500 font-bold tracking-widest">OR</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Email address"
                        className="w-full h-14 bg-gray-50 dark:bg-[#212121] border border-black/5 dark:border-white/5 rounded-2xl px-5 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    <button 
                        className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}

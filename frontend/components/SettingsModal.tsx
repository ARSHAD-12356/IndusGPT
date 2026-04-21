"use client"

import React, { useState } from 'react'
import { X, Sparkles, PencilLine, User, Settings, Brain, Trash2, Check, ExternalLink } from 'lucide-react'

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    user: any;
    onClearChats: () => void;
}

export function SettingsModal({ isOpen, onClose, activeTab, setActiveTab, user, onClearChats }: SettingsModalProps) {
    const [instructions, setInstructions] = useState("")
    const [systemInstructions, setSystemInstructions] = useState("")
    const [isSaved, setIsSaved] = useState(false)

    if (!isOpen) return null;

    const handleSavePersonalization = () => {
        // Here you could save instructions to localStorage or backend
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 2000)
    }

    const tabs = [
        { id: 'upgrade', label: 'Upgrade plan', icon: <Sparkles size={18} /> },
        { id: 'personalization', label: 'Personalization', icon: <PencilLine size={18} /> },
        { id: 'profile', label: 'Profile', icon: <User size={18} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
        { id: 'help', label: 'Help', icon: <Brain size={18} /> },
    ]

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-4xl h-[80vh] flex overflow-hidden shadow-2xl animate-fade-in-up">
                
                {/* Sidebar */}
                <div className="w-64 bg-[#0d0d0f]/50 border-r border-white/5 p-4 flex flex-col gap-2">
                    <h2 className="text-white font-semibold text-lg px-3 py-2 mb-2">Settings</h2>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                                activeTab === tab.id 
                                    ? 'bg-white/10 text-white' 
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col relative bg-[#161618]">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors z-10"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex-1 overflow-y-auto p-8">
                        {activeTab === 'upgrade' && (
                            <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-bold text-white">Choose your plan</h3>
                                    <p className="text-gray-400">Unlock the full potential of IndusGPT</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Free Tier */}
                                    <div className="border border-white/10 rounded-2xl p-6 bg-white/5">
                                        <h4 className="text-xl font-semibold text-white mb-2">Free</h4>
                                        <div className="text-3xl font-bold text-white mb-6">$0<span className="text-sm font-normal text-gray-400">/month</span></div>
                                        <ul className="space-y-3 mb-8 text-sm text-gray-300">
                                            <li className="flex gap-2"><Check size={16} className="text-green-500" /> Standard AI text model</li>
                                            <li className="flex gap-2"><Check size={16} className="text-green-500" /> Regular response speed</li>
                                            <li className="flex gap-2"><Check size={16} className="text-green-500" /> Basic image generation</li>
                                        </ul>
                                        <button className="w-full py-2.5 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors" disabled>
                                            Current Plan
                                        </button>
                                    </div>
                                    {/* Pro Tier */}
                                    <div className="border border-purple-500/50 rounded-2xl p-6 bg-gradient-to-b from-purple-500/10 to-transparent relative">
                                        <div className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">Most Popular</div>
                                        <h4 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                                            <Sparkles size={20} className="text-purple-400" /> Pro
                                        </h4>
                                        <div className="text-3xl font-bold text-white mb-6">$20<span className="text-sm font-normal text-gray-400">/month</span></div>
                                        <ul className="space-y-3 mb-8 text-sm text-gray-300">
                                            <li className="flex gap-2"><Check size={16} className="text-purple-400" /> Advanced image generation (Stable Diffusion XL)</li>
                                            <li className="flex gap-2"><Check size={16} className="text-purple-400" /> Priority response speed</li>
                                            <li className="flex gap-2"><Check size={16} className="text-purple-400" /> Early access to new features</li>
                                        </ul>
                                        <button 
                                            onClick={() => alert("Payment gateway integration coming soon!")}
                                            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity"
                                        >
                                            Upgrade to Pro
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'personalization' && (
                            <div className="max-w-2xl space-y-8 animate-fade-in">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Custom Instructions</h3>
                                    <p className="text-gray-400 text-sm">Tailor how IndusGPT responds to your queries to better match your preferences.</p>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-200">What would you like IndusGPT to know about you to provide better responses?</label>
                                        <textarea 
                                            value={instructions}
                                            onChange={(e) => setInstructions(e.target.value)}
                                            placeholder="e.g., I'm a software developer based in Mumbai. I prefer concise answers..."
                                            className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-200">How would you like IndusGPT to respond?</label>
                                        <textarea 
                                            value={systemInstructions}
                                            onChange={(e) => setSystemInstructions(e.target.value)}
                                            placeholder="e.g., Use formal language, avoid emojis, always explain code step-by-step..."
                                            className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button 
                                        onClick={handleSavePersonalization}
                                        className="px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                                    >
                                        {isSaved ? <><Check size={16} /> Saved</> : 'Save'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="max-w-2xl space-y-8 animate-fade-in">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Profile</h3>
                                    <p className="text-gray-400 text-sm">Manage your personal information.</p>
                                </div>
                                
                                <div className="flex items-center gap-6 p-6 border border-white/5 bg-white/5 rounded-2xl">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                                        {user?.name?.split(' ').map((n: string) => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white">{user?.name}</h4>
                                        <p className="text-gray-400">{user?.email || 'user@example.com'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Display Name</label>
                                        <input 
                                            type="text" 
                                            defaultValue={user?.name}
                                            disabled
                                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white opacity-60 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-gray-500">Name changes are currently disabled.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="max-w-2xl space-y-8 animate-fade-in">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">General Settings</h3>
                                    <p className="text-gray-400 text-sm">Manage your app preferences and data.</p>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-white/5 bg-white/5 rounded-xl">
                                        <div>
                                            <h4 className="text-white font-medium">Theme</h4>
                                            <p className="text-sm text-gray-400">Dark mode is currently enabled globally.</p>
                                        </div>
                                        <div className="px-3 py-1 bg-black/50 rounded-lg text-sm text-white border border-white/10">Dark</div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-red-500/20 bg-red-500/5 rounded-xl">
                                        <div>
                                            <h4 className="text-red-400 font-medium">Clear all chats</h4>
                                            <p className="text-sm text-red-400/70">Permanently delete all your chat history from this device.</p>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to delete all chats? This cannot be undone.")) {
                                                    onClearChats();
                                                    onClose();
                                                }
                                            }}
                                            className="px-4 py-2 bg-red-500/10 text-red-400 font-medium rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
                                        >
                                            <Trash2 size={16} /> Delete all
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'help' && (
                            <div className="max-w-2xl space-y-8 animate-fade-in">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Help & Support</h3>
                                    <p className="text-gray-400 text-sm">Get assistance and learn more about IndusGPT.</p>
                                </div>
                                
                                <div className="space-y-4">
                                    <a href="#" className="flex items-center justify-between p-4 border border-white/5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/5 rounded-lg text-white"><Brain size={20} /></div>
                                            <div>
                                                <h4 className="text-white font-medium">FAQ & Documentation</h4>
                                                <p className="text-sm text-gray-400">Learn how to use features and troubleshoot issues.</p>
                                            </div>
                                        </div>
                                        <ExternalLink size={18} className="text-gray-500 group-hover:text-white transition-colors" />
                                    </a>

                                    <div className="p-6 border border-white/5 bg-white/5 rounded-xl">
                                        <h4 className="text-white font-medium mb-2">About IndusGPT</h4>
                                        <p className="text-sm text-gray-400 mb-4">Version 1.0.0-beta</p>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            IndusGPT is an advanced AI chat interface designed for seamless interaction with Large Language Models and Image Generation tools. Built with Next.js, Tailwind CSS, and powered by Gemini and HuggingFace.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

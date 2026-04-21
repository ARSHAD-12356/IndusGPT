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
    if (!isOpen) return null;
    const [instructions, setInstructions] = useState("")
    const [systemInstructions, setSystemInstructions] = useState("")
    const [isSaved, setIsSaved] = useState(false)
    const [isProfileSaved, setIsProfileSaved] = useState(false)

    // Profile State
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        country: user?.country || '',
        profilePic: user?.profilePic || '',
        themeColor: user?.themeColor || '#4f46e5'
    })

    React.useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                country: user.country || '',
                profilePic: user.profilePic || '',
                themeColor: user.themeColor || '#4f46e5'
            })
        }
    }, [user])

    const handleSavePersonalization = async () => {
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, themeColor: profileData.themeColor })
            })
            if (res.ok) {
                const data = await res.json()
                localStorage.setItem('currentUser', JSON.stringify({ ...user, ...data.user, id: user.id }))
                setIsSaved(true)
                setTimeout(() => setIsSaved(false), 2000)
            }
        } catch (err) {
            console.error('Failed to save theme:', err)
        }
    }

    const handleSaveProfile = async () => {
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, ...profileData })
            })
            if (res.ok) {
                const data = await res.json()
                // Update localStorage to persist changes
                localStorage.setItem('currentUser', JSON.stringify({ ...user, ...data.user, id: user.id }))
                setIsProfileSaved(true)
                setTimeout(() => setIsProfileSaved(false), 2000)
                // Reload page or update parent state? 
                // Better to update parent state, but since it's localstorage based, a reload might be easiest or manual state update
                window.location.reload(); 
            }
        } catch (err) {
            console.error('Failed to save profile:', err)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfileData(prev => ({ ...prev, profilePic: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
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

                                    <div className="space-y-4">
                                        <label className="text-sm font-medium text-gray-200">Theme Color</label>
                                        <div className="flex flex-wrap gap-3">
                                            {['#4f46e5', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6366f1'].map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setProfileData(prev => ({ ...prev, themeColor: color }))}
                                                    className={`w-10 h-10 rounded-full border-2 transition-all ${profileData.themeColor === color ? 'border-white scale-110 shadow-lg shadow-white/20' : 'border-transparent hover:scale-105'}`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                            <div className="flex items-center gap-2 ml-2">
                                                <input 
                                                    type="color" 
                                                    value={profileData.themeColor}
                                                    onChange={(e) => setProfileData(prev => ({ ...prev, themeColor: e.target.value }))}
                                                    className="w-10 h-10 rounded-full bg-transparent border-none cursor-pointer"
                                                />
                                                <span className="text-xs text-gray-400">Custom</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 italic">This will update the primary color of your dashboard and chat elements.</p>
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
                                    <h3 className="text-2xl font-bold text-white mb-2">Profile</h3>
                                    <p className="text-gray-400 text-sm">Manage your personal information.</p>
                                </div>
                                
                                <div className="flex items-center gap-6 p-6 border border-white/5 bg-white/5 rounded-2xl">
                                    <div className="relative group">
                                        {profileData.profilePic ? (
                                            <img 
                                                src={profileData.profilePic} 
                                                alt="Profile" 
                                                className="w-24 h-24 rounded-full object-cover border-2 border-white/10"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                                                {profileData.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                                            </div>
                                        )}
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                                            <PencilLine size={20} className="text-white" />
                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-bold text-white">{profileData.name || 'User'}</h4>
                                        <p className="text-gray-400">{profileData.email || 'user@example.com'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Display Name</label>
                                        <input 
                                            type="text" 
                                            value={profileData.name}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={profileData.email}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                            placeholder="Email address"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Country</label>
                                        <input 
                                            type="text" 
                                            value={profileData.country}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                            placeholder="India"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button 
                                        onClick={handleSaveProfile}
                                        className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95"
                                    >
                                        {isProfileSaved ? <><Check size={18} /> Changes Saved</> : 'Save Profile Changes'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="max-w-2xl space-y-8 animate-fade-in">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">General Settings</h3>
                                    <p className="text-gray-400 text-sm">Manage your app preferences and data.</p>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="p-4 border border-white/5 bg-white/5 rounded-xl space-y-4">
                                        <h4 className="text-white font-medium flex items-center gap-2">
                                            <Settings size={18} className="text-gray-400" /> App Preferences
                                        </h4>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-white">Enter sends message</p>
                                                <p className="text-xs text-gray-500">Pressing Enter will send the message instead of adding a new line.</p>
                                            </div>
                                            <div className="w-10 h-5 bg-purple-600 rounded-full relative cursor-pointer">
                                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-white">Advanced Data Mode</p>
                                                <p className="text-xs text-gray-500">Enable experimental features and faster response processing.</p>
                                            </div>
                                            <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer">
                                                <div className="absolute left-1 top-1 w-3 h-3 bg-gray-500 rounded-full" />
                                            </div>
                                        </div>
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

                                    <div className="p-4 border border-white/5 bg-white/5 rounded-xl">
                                        <h4 className="text-white font-medium mb-1">Export Data</h4>
                                        <p className="text-xs text-gray-500 mb-3">Download a copy of your chat history and settings.</p>
                                        <button 
                                            onClick={() => alert("Data export started...")}
                                            className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1"
                                        >
                                            <ExternalLink size={12} /> Request JSON export
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button onClick={() => alert("Opening Documentation...")} className="flex items-center gap-3 p-4 border border-white/5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left group">
                                            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><Brain size={20} /></div>
                                            <div>
                                                <h4 className="text-white font-medium text-sm">User Guide</h4>
                                                <p className="text-xs text-gray-500">Learn how to use IndusGPT.</p>
                                            </div>
                                        </button>
                                        <button onClick={() => alert("Contacting Support...")} className="flex items-center gap-3 p-4 border border-white/5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left group">
                                            <div className="p-2 bg-green-500/10 text-green-400 rounded-lg"><MessageSquare size={20} /></div>
                                            <div>
                                                <h4 className="text-white font-medium text-sm">Contact Us</h4>
                                                <p className="text-xs text-gray-500">Get 24/7 technical support.</p>
                                            </div>
                                        </button>
                                    </div>

                                    <div className="p-6 border border-white/5 bg-white/5 rounded-xl">
                                        <h4 className="text-white font-medium mb-4">Frequently Asked Questions</h4>
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <p className="text-sm text-white font-medium">How do I generate images?</p>
                                                <p className="text-xs text-gray-500">Simply type "Create an image of..." in the chat. IndusGPT will use HuggingFace to generate it for you.</p>
                                            </div>
                                            <div className="space-y-1 pt-3 border-t border-white/5">
                                                <p className="text-sm text-white font-medium">Is my data secure?</p>
                                                <p className="text-xs text-gray-500">Yes, your conversations and personal data are encrypted and stored securely in our private database.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 border border-white/5 bg-white/5 rounded-xl">
                                        <h4 className="text-white font-medium mb-2 flex items-center justify-between">
                                            About IndusGPT
                                            <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-gray-400">v1.2.0-stable</span>
                                        </h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            IndusGPT is an advanced AI chat interface designed for seamless interaction with Large Language Models and Image Generation tools. Built with Next.js, Tailwind CSS, and powered by high-performance models.
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

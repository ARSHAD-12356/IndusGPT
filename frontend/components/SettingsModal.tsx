"use client"

import React, { useState, useEffect } from 'react'
import { X, Sparkles, PencilLine, User, Settings, Brain, Trash2, Check, ExternalLink, MessageSquare, Pencil } from 'lucide-react'

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
    const [isProfileSaved, setIsProfileSaved] = useState(false)

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        country: '',
        profilePic: '',
        themeColor: '#4f46e5'
    })

    useEffect(() => {
        if (user && isOpen) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                country: user.country || '',
                profilePic: user.profilePic || '',
                themeColor: user.themeColor || '#4f46e5'
            })
        }
    }, [user, isOpen])

    if (!isOpen) return null;

    const handleSavePersonalization = () => {
        setIsSaved(true)
        setTimeout(() => {
            setIsSaved(false)
            onClose()
        }, 800)
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
                localStorage.setItem('currentUser', JSON.stringify({ ...user, ...data.user, id: user.id }))
                setIsProfileSaved(true)
                setTimeout(() => {
                    setIsProfileSaved(false)
                    onClose()
                    window.location.reload(); 
                }, 800)
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-4xl h-[80vh] flex overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
                
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
                            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="text-center space-y-2 text-white">
                                    <h3 className="text-2xl font-bold">Choose your plan</h3>
                                    <p className="text-gray-400">Unlock the full potential of IndusGPT</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="border border-white/10 rounded-2xl p-6 bg-white/5 text-left">
                                        <h4 className="text-xl font-semibold text-white mb-2">Free</h4>
                                        <div className="text-3xl font-bold text-white mb-6">$0<span className="text-sm font-normal text-gray-400">/month</span></div>
                                        <button className="w-full py-2.5 rounded-lg bg-white/10 text-white font-medium cursor-default" disabled>Current Plan</button>
                                    </div>
                                    <div className="border border-purple-500/50 rounded-2xl p-6 bg-gradient-to-b from-purple-500/10 to-transparent relative text-left">
                                        <h4 className="text-xl font-semibold text-white mb-2">Pro</h4>
                                        <div className="text-3xl font-bold text-white mb-6">$20<span className="text-sm font-normal text-gray-400">/month</span></div>
                                        <button onClick={() => alert("Coming soon!")} className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90">Upgrade</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'personalization' && (
                            <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Personalization</h3>
                                    <p className="text-gray-400 text-sm">Customize how IndusGPT interacts with you.</p>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-200">Custom Instructions</label>
                                        <textarea 
                                            value={instructions}
                                            onChange={(e) => setInstructions(e.target.value)}
                                            placeholder="How would you like IndusGPT to respond?"
                                            className="w-full h-40 bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button 
                                        onClick={handleSavePersonalization}
                                        className="px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                                    >
                                        {isSaved ? <Check size={16} /> : null} {isSaved ? 'Saved' : 'Save Preferences'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Profile</h3>
                                    <p className="text-gray-400 text-sm">Update your account details.</p>
                                </div>
                                
                                <div className="flex items-center gap-6 p-6 border border-white/5 bg-white/5 rounded-2xl">
                                    <div className="relative group shrink-0">
                                        {profileData.profilePic ? (
                                            <img src={profileData.profilePic} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                                                {profileData.name?.[0] || 'U'}
                                            </div>
                                        )}
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                                            <Pencil size={20} className="text-white" />
                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-bold text-white">{profileData.name || 'User'}</h4>
                                        <p className="text-gray-400">{profileData.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Display Name</label>
                                        <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Email</label>
                                        <input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Phone</label>
                                        <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Country</label>
                                        <input type="text" value={profileData.country} onChange={(e) => setProfileData({...profileData, country: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none" />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button onClick={handleSaveProfile} className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:opacity-90">
                                        {isProfileSaved ? 'Saved!' : 'Save Profile'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                                <h3 className="text-2xl font-bold text-white">General Settings</h3>
                                <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-xl flex items-center justify-between">
                                    <div>
                                        <h4 className="text-red-400 font-medium">Delete History</h4>
                                        <p className="text-xs text-red-400/60">This action is irreversible.</p>
                                    </div>
                                    <button onClick={() => {if(confirm("Sure?")) onClearChats()}} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg">Clear All</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'help' && (
                            <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                                <h3 className="text-2xl font-bold text-white">Help & Support</h3>
                                <div className="p-6 border border-white/5 bg-white/5 rounded-xl">
                                    <p className="text-sm text-gray-400">Need help? Contact our support team or check the FAQ.</p>
                                    <button onClick={() => alert("Support ticket created.")} className="mt-4 px-4 py-2 bg-white/10 text-white rounded-lg">Contact Support</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

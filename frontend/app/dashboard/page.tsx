'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, Search, Image as ImageIcon, LayoutGrid, Brain, Code, 
  ChevronDown, User, Settings, LogOut, 
  Mic, Send, Globe, Sparkles, PencilLine
} from 'lucide-react'

const OPENROUTER_API_KEY = "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"

export default function Dashboard() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [isSidebarOpen] = useState(true)
    const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false)
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false)
    const [newChatName, setNewChatName] = useState('')
    const [chats, setChats] = useState<string[]>([])
    const [activeChat, setActiveChat] = useState<string | null>(null)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([])
    const [hasStarted, setHasStarted] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isTyping])

    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser')
        if (!currentUser) {
            router.push('/login')
        } else {
            setUser(JSON.parse(currentUser))
        }
    }, [router])

    if (!user) return null

    const handleCreateChat = () => {
        if (newChatName.trim()) {
            const name = newChatName.trim()
            setChats([name, ...chats])
            setActiveChat(name)
            setMessage('')
            setNewChatName('')
            setIsNewChatModalOpen(false)
            setHasStarted(false)
            setMessages([])
        }
    }

    const handleSendMessage = async () => {
        if (!message.trim()) return

        const userMsg = message.trim()
        const newMessages: { role: 'user' | 'assistant', content: string }[] = [...messages, { role: 'user', content: userMsg }]
        setMessages(newMessages)
        setMessage('')
        setHasStarted(true)
        setIsTyping(true)

        try {
            const apiMessages = newMessages.map(msg => ({
                role: msg.role,
                content: msg.content
            }))

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": window.location.href,
                    "X-Title": "IndusGPT"
                },
                body: JSON.stringify({
                    model: "openrouter/auto", 
                    messages: apiMessages
                })
            })

            if (!response.ok) {
                const errorData = await response.text()
                throw new Error(`API returned ${response.status}: ${errorData}`)
            }
            
            const data = await response.json()
            const responseText = data.choices?.[0]?.message?.content || "No response received."
            
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: responseText 
            }])
        } catch (error) {
            console.error("Gemini API Error:", error)
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: "I'm sorry, I encountered an error. Please verify the API key or try again." 
            }])
        } finally {
            setIsTyping(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className="flex h-screen bg-[#0d0d0f] text-gray-200 overflow-hidden font-sans">
            
            {/* ─── Sidebar ─── */}
            <aside className={`flex flex-col bg-[#050505] border-r border-white/5 transition-all duration-300 ${isSidebarOpen ? 'w-[260px]' : 'w-0 overflow-hidden'}`}>
                {/* Top Nav Items */}
                <div className="p-3 space-y-1">
                    <button 
                        onClick={() => setIsNewChatModalOpen(true)}
                        className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <Plus size={16} className="text-white" />
                      </div>
                      <span>New chat</span>
                    </button>
                    
                    <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm text-gray-400">
                      <Search size={18} />
                      <span>Search chats</span>
                    </button>
                </div>

                {/* Primary Tabs */}
                <div className="px-3 py-4 space-y-0.5 overflow-y-auto flex-1">
                    {[
                        { icon: <ImageIcon size={18} />, label: "Images" },
                        { icon: <LayoutGrid size={18} />, label: "Apps" },
                        { icon: <Brain size={18} />, label: "Deep research" },
                        { icon: <Code size={18} />, label: "Codex" },
                        { icon: <Sparkles size={18} />, label: "GPTs" },
                        { icon: <LayoutGrid size={18} />, label: "Projects" },
                    ].map((item) => (
                        <button key={item.label} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-400 hover:text-white">
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}

                    <div className="pt-6 pb-2 px-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Recents</div>
                    {chats.map((chat, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setActiveChat(chat)}
                            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors text-sm truncate ${activeChat === chat ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <span className="truncate">{chat}</span>
                        </button>
                    ))}
                    {chats.length === 0 && (
                        <div className="px-3 py-2 text-[10px] text-gray-600 italic">No recent chats</div>
                    )}
                </div>

                {/* Bottom Profile */}
                <div className="p-3 border-t border-white/5 relative">
                    {isProfilePopupOpen && (
                        <div className="absolute bottom-full left-3 w-64 mb-2 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-slide-up">
                            {/* Profile Info */}
                            <div className="flex items-center gap-3 px-3 py-3 mb-1 rounded-xl hover:bg-white/5 cursor-pointer">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-[10px] font-bold text-white">
                                    {user.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div className="flex-1 text-left truncate">
                                    <div className="text-sm font-medium text-white truncate">{user.name}</div>
                                    <div className="text-[10px] text-gray-500 truncate">Go</div>
                                </div>
                            </div>
                            
                            <div className="h-[1px] bg-white/5 my-1" />

                            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-400 hover:text-white">
                                <Plus size={18} />
                                <span>Add another account</span>
                            </button>

                            <div className="h-[1px] bg-white/5 my-1" />

                            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-400 hover:text-white">
                                <Sparkles size={18} />
                                <span>Upgrade plan</span>
                            </button>
                            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-400 hover:text-white">
                                <PencilLine size={18} />
                                <span>Personalization</span>
                            </button>
                            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-400 hover:text-white">
                                <User size={18} />
                                <span>Profile</span>
                            </button>
                            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-400 hover:text-white">
                                <Settings size={18} />
                                <span>Settings</span>
                            </button>

                            <div className="h-[1px] bg-white/5 my-1" />

                            <button className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-400 hover:text-white group">
                                <div className="flex items-center gap-3">
                                    <Brain size={18} />
                                    <span>Help</span>
                                </div>
                                <div className="text-[10px] text-gray-600 group-hover:text-gray-400 flex items-center gap-1">
                                    <ChevronDown size={14} className="-rotate-90" />
                                </div>
                            </button>
                            <button 
                                onClick={() => { localStorage.removeItem('currentUser'); router.push('/login'); }}
                                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-400 hover:text-white"
                            >
                                <LogOut size={18} />
                                <span>Log out</span>
                            </button>
                        </div>
                    )}
                    <button 
                        onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
                        className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm group ${isProfilePopupOpen ? 'bg-white/5' : ''}`}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                            {user.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div className="flex-1 text-left truncate">
                            <div className="font-medium text-white truncate">{user.name}</div>
                        </div>
                        <div className="w-4 h-4 rounded hover:bg-white/10 flex items-center justify-center transition-colors">
                            <Settings size={12} className="text-gray-500 group-hover:text-white transition-colors" />
                        </div>
                    </button>
                </div>
            </aside>

            {/* ─── Main Content ─── */}
            <main className="flex-1 flex flex-col relative bg-[#0d0d0f] min-w-0 overflow-hidden">
                
                {/* Top Toolbar */}
                <header className="flex items-center justify-between px-6 py-3.5 z-10">
                    <div className="flex items-center gap-2 group cursor-pointer hover:bg-white/5 px-2.5 py-1.5 rounded-lg transition-colors">
                        <span className="text-lg font-bold text-white">IndusGPT</span>
                        <ChevronDown size={14} className="text-gray-500 group-hover:text-white transition-colors" />
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors border border-white/5">
                          Open in app
                        </button>
                        <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors">
                                <Sparkles size={16} />
                             </div>
                             <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-blue-500/50 to-purple-500/50 flex items-center justify-center text-[10px] font-bold">
                                    {user.name[0]}
                                </div>
                             </div>
                        </div>
                    </div>
                </header>

                {/* Chat/Center Area */}
                <div className={`flex-1 flex flex-col min-h-0 overflow-hidden transition-all duration-500 ease-in-out ${hasStarted ? 'pt-4' : 'items-center justify-center -mt-16'}`}>
                    
                    {!hasStarted ? (
                        <>
                            <h2 className="text-4xl font-bold text-white mb-10 tracking-tight animate-slide-up">What can I help with?</h2>
                            <div className="w-full max-w-2xl px-4 relative">
                                {/* Input Container */}
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
                                    <div className="relative flex flex-col bg-[#161618] border border-white/10 rounded-2xl shadow-2xl overflow-hidden min-h-[120px] transition-all">
                                        <textarea 
                                            placeholder="Ask anything..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className="w-full bg-transparent p-5 pb-16 outline-none text-white placeholder-gray-500 resize-none h-auto max-h-[400px]"
                                            rows={1}
                                        />
                                        
                                        <div className="absolute bottom-4 left-5 flex items-center gap-1.5">
                                            <button className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors">
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-4 right-5 flex items-center gap-2">
                                             <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors">
                                                <Mic size={18} />
                                            </button>
                                            <button 
                                                onClick={handleSendMessage}
                                                className="p-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all hover:scale-105 active:scale-95"
                                            >
                                                <Send size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                                    {[
                                        { icon: <ImageIcon size={14} />, label: "Create image" },
                                        { icon: <PencilLine size={14} />, label: "Write or edit" },
                                        { icon: <Globe size={14} />, label: "Look something up" },
                                    ].map((pill) => (
                                        <button key={pill.label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-all">
                                            {pill.icon}
                                            <span>{pill.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto pb-32 min-h-0 overflow-hidden">
                            {/* Messages List */}
                            <div className="flex-1 overflow-y-auto px-4 space-y-6 scroll-smooth pt-4">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                                        <div className={`max-w-[80%] p-4 rounded-2xl ${
                                            msg.role === 'user' 
                                            ? 'bg-white/5 border border-white/10 text-white' 
                                            : 'text-gray-200'
                                        }`}>
                                            {msg.role === 'assistant' && (
                                                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-2">
                                                    <Sparkles size={12} className="text-white" />
                                                </div>
                                            )}
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start animate-pulse">
                                        <div className="max-w-[80%] p-4 rounded-2xl text-gray-400 text-sm">
                                            IndusGPT is thinking...
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} className="h-4" />
                            </div>

                            {/* Bottom Input Area */}
                            <div className="fixed bottom-0 left-0 right-0 lg:left-[260px] bg-[#0d0d0f]/80 backdrop-blur-xl border-t border-white/5 p-4 z-20">
                                <div className="max-w-3xl mx-auto relative group">
                                    <div className="relative flex items-center bg-[#161618] border border-white/10 rounded-2xl shadow-xl transition-all">
                                        <textarea 
                                            placeholder="Ask anything..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className="w-full bg-transparent px-5 py-4 outline-none text-white placeholder-gray-500 resize-none h-14 max-h-[200px]"
                                            rows={1}
                                        />
                                        <div className="flex items-center gap-2 pr-4">
                                             <button className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors">
                                                <Mic size={18} />
                                            </button>
                                            <button 
                                                onClick={handleSendMessage}
                                                className="p-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all hover:scale-105 active:scale-95"
                                            >
                                                <Send size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center mt-2">
                                    <p className="text-[10px] text-gray-600 font-medium tracking-tight">IndusGPT can make mistakes. Check important info.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* ─── New Chat Modal ─── */}
            {isNewChatModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsNewChatModalOpen(false)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative w-full max-w-md bg-[#161618] border border-white/10 rounded-3xl shadow-2xl p-8 animate-slide-up">
                        <h3 className="text-2xl font-bold text-white mb-2">Name your chat</h3>
                        <p className="text-gray-400 text-sm mb-6">Give your conversation a title to help you find it later.</p>
                        
                        <div className="space-y-6">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
                                <input 
                                    type="text"
                                    value={newChatName}
                                    onChange={(e) => setNewChatName(e.target.value)}
                                    placeholder="e.g., Project Analysis"
                                    className="relative w-full bg-[#0d0d0f] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50 transition-all"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateChat()}
                                />
                            </div>
                            
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setIsNewChatModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/5"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleCreateChat}
                                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

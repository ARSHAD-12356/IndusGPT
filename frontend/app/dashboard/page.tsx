'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
    Plus, Search, Image as ImageIcon, LayoutGrid, Brain, Code,
    ChevronDown, User, Settings, LogOut,
    Mic, Send, Globe, Sparkles, PencilLine,
    Trash2, Edit2, Check, X, MoreHorizontal, Share, Users, Pin, PinOff, Archive,
    PanelLeftClose, PanelLeft, MessageSquare, Paperclip, Lightbulb, Telescope, ChevronRight, Menu,
    Copy, RotateCcw
} from 'lucide-react'
import { SettingsModal } from '../../components/SettingsModal'
import { LoginSignupModal } from '../../components/LoginSignupModal'
import { ModeToggle } from '@/components/mode-toggle'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from '@/components/chat/code-block'
// const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""

export default function Dashboard() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false)
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false)
    const [newChatName, setNewChatName] = useState('')
    const [chats, setChats] = useState<{ _id: string; name: string; isPinned?: boolean; isArchived?: boolean }[]>([])
    const [activeChat, setActiveChat] = useState<{ _id: string; name: string } | null>(null)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string, image?: string }[]>([])
    const [hasStarted, setHasStarted] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [editingChatId, setEditingChatId] = useState<string | null>(null)
    const [editingChatName, setEditingChatName] = useState('')
    const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null)
    const [chatSearchQuery, setChatSearchQuery] = useState('')
    const [isChatSearchActive, setIsChatSearchActive] = useState(false)

    // Settings Modal State
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
    const [isLoginSignupModalOpen, setIsLoginSignupModalOpen] = useState(false)
    const [settingsActiveTab, setSettingsActiveTab] = useState('profile')
    const [isDeleteChatModalOpen, setIsDeleteChatModalOpen] = useState(false)
    const [chatIdToDelete, setChatIdToDelete] = useState<string | null>(null)
    const [isArchivedOpen, setIsArchivedOpen] = useState(false)
    const [pastedImage, setPastedImage] = useState<string | null>(null)

    const openSettings = (tab: string) => {
        setSettingsActiveTab(tab)
        setIsSettingsModalOpen(true)
        setIsProfilePopupOpen(false)
    }

    const handleClearChats = async () => {
        setChats([])
        setActiveChat(null)
        setMessages([])
        setHasStarted(false)
        try {
            await fetch(`/api/chats?userId=${user?.id}`, { method: 'DELETE' })
        } catch (e) {
            console.error('Failed to clear chats remotely', e)
        }
    }
    const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false)

    // Search State
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [highlightedMsgIdx, setHighlightedMsgIdx] = useState<number | null>(null)
    const messageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})

    const scrollToMessage = (idx: number) => {
        setHighlightedMsgIdx(idx)
        messageRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setIsSearchOpen(false)
        setTimeout(() => setHighlightedMsgIdx(null), 2000)
    }

    // Edit Message State
    const [editingMsgIdx, setEditingMsgIdx] = useState<number | null>(null)
    const [editMsgText, setEditMsgText] = useState('')

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // Optionally add toast notification here
    }

    const handleRegenerate = async (idx: number) => {
        // Find the last user message before this assistant message
        const userMsgIdx = idx - 1;
        if (userMsgIdx < 0 || messages[userMsgIdx].role !== 'user') return;

        const userMsg = messages[userMsgIdx];
        
        // Clear current content and show loading state
        setMessages(prev => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], content: "### Regenerating...\nThinking about a better response for you..." };
            return updated;
        });

        setIsTyping(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        message: userMsg.content, 
                        image: userMsg.image,
                        history: messages.slice(0, userMsgIdx) // Send history before this prompt
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to regenerate response: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const newContent = data.content || "No response received.";

            setMessages(prev => {
                const updated = [...prev];
                updated[idx] = { ...updated[idx], content: newContent };
                return updated;
            });
        } catch (error) {
            console.error("Regeneration Error:", error);
        } finally {
            setIsTyping(false);
        }
    }

    const handleDeleteMessage = async (idx: number) => {
        let updatedMsgs: any[] = [];
        setMessages(prev => {
            const newMsgs = [...prev];
            // If the next message is an assistant response, delete both
            if (newMsgs[idx + 1] && newMsgs[idx + 1].role === 'assistant') {
                newMsgs.splice(idx, 2);
            } else {
                newMsgs.splice(idx, 1);
            }
            updatedMsgs = newMsgs;
            return newMsgs;
        });

        if (activeChat?._id && updatedMsgs.length >= 0) {
            try {
                await fetch(`/api/chats/${activeChat._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: updatedMsgs })
                });
            } catch (err) {
                console.error('Failed to sync message deletion:', err);
            }
        }
    }

    const handleSaveEdit = async (idx: number) => {
        const updated = [...messages.slice(0, idx + 1)]; // Truncate history after the edited message
        updated[idx].content = editMsgText;
        setMessages(updated);
        setEditingMsgIdx(null);
        setIsTyping(true);

        try {
            // First sync the truncated history to the backend
            if (activeChat?._id) {
                await fetch(`/api/chats/${activeChat._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: updated })
                });
            }

            // Then get a new response for the edited prompt
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        message: editMsgText, 
                        image: updated[idx].image,
                        history: updated.slice(0, idx) 
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to get response: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const aiResponse = { 
                role: 'assistant' as const, 
                content: data.content || "No response received." 
            };

            const finalMessages = [...updated, aiResponse];
            setMessages(finalMessages);

            // Sync the final conversation state
            if (activeChat?._id) {
                await fetch(`/api/chats/${activeChat._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: finalMessages })
                });
            }
        } catch (err) {
            console.error('Failed to handle edit send:', err);
        } finally {
            setIsTyping(false);
        }
    }

    useEffect(() => {
        const handleClickOutside = () => setIsPlusMenuOpen(false)
        if (isPlusMenuOpen) {
            document.addEventListener('click', handleClickOutside)
        }
        return () => document.removeEventListener('click', handleClickOutside)
    }, [isPlusMenuOpen])

    useEffect(() => {
        const handleClickOutside = () => setActiveDropdownId(null)
        if (activeDropdownId) {
            document.addEventListener('click', handleClickOutside)
        }
        return () => document.removeEventListener('click', handleClickOutside)
    }, [activeDropdownId])

    useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: isTyping ? "smooth" : "auto" })
        }
    }, [messages, isTyping])

    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser')
        if (!currentUser) {
            router.push('/login')
        } else {
            const parsed = JSON.parse(currentUser)
            setUser(parsed)
            // Hard cleanup of any leftover theme styles
            const root = document.documentElement;
            root.style.removeProperty('--primary');
            root.style.removeProperty('--accent');
            root.style.removeProperty('--ring');

            // Load chats from DB for this user
            fetch(`/api/chats?userId=${parsed.id}`)
                .then(r => r.json())
                .then(data => {
                    if (data.chats) setChats(data.chats)
                })
                .catch(err => console.error('Failed to load chats:', err))
        }
    }, [router])

    if (!user) return null

    const handleCreateChat = async () => {
        if (newChatName.trim()) {
            const name = newChatName.trim()
            try {
                const res = await fetch('/api/chats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, name })
                })
                const data = await res.json()
                if (data.chat) {
                    setChats(prev => [data.chat, ...prev])
                    setActiveChat(data.chat)
                    setIsMobileSidebarOpen(false)
                }
            } catch (err) {
                console.error('Failed to create chat:', err)
            }
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
        let responseText = ""

        let currentChatId = activeChat?._id

        // Auto-create chat from first prompt if no active chat
        if (!activeChat) {
            const autoName = userMsg.length > 30 ? userMsg.slice(0, 30).trimEnd() + '…' : userMsg
            try {
                const res = await fetch('/api/chats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, name: autoName })
                })
                const data = await res.json()
                if (data.chat) {
                    setChats(prev => [data.chat, ...prev])
                    setActiveChat(data.chat)
                    currentChatId = data.chat._id
                }
            } catch (err) {
                console.error('Failed to auto-create chat:', err)
            }
        }

        const newMessages: { role: 'user' | 'assistant', content: string, image?: string }[] = [...messages, { role: 'user', content: userMsg, image: pastedImage || undefined }]
        setMessages(newMessages)
        setMessage('')
        setPastedImage(null)
        setHasStarted(true)
        setIsTyping(true)
        const startTime = Date.now()

        const isImageRequest = /(generate|create|make|draw).*image/i.test(userMsg)
        const lowerMsg = userMsg.toLowerCase().trim()

        // ─── FRONTEND IDENTITY OVERRIDE with Simulated Delay ───
        if (lowerMsg === 'who are you' || lowerMsg === 'who are you?' || lowerMsg === 'tell me about yourself') {
            responseText = "I am IndusGPT, a powerful and premium AI assistant made by ArshXCoder. I'm here to help you with everything from coding to creative writing!"
        } else if (lowerMsg === 'hii' || lowerMsg === 'hello' || lowerMsg === 'hey') {
            responseText = "Hello! I am IndusGPT, developed by Md Arshad Raza. How can I assist you today?"
        } else if (lowerMsg.includes('who made you') || lowerMsg.includes('who developed you') || lowerMsg.includes('kisne banaya') || lowerMsg.includes('creator')) {
            responseText = "I was proudly developed by Md Arshad Raza, also known as ArshXCoder. He is a passionate developer who built me to be your ultimate AI companion."
        } else if (lowerMsg.includes('what is indusgpt') || lowerMsg.includes('indusgpt kya hai')) {
            responseText = "IndusGPT is a next-generation AI platform designed for speed, accuracy, and versatility. It combines advanced language models with image generation and deep research capabilities to supercharge your productivity."
        } else if (lowerMsg.includes('what can you do') || lowerMsg.includes('features')) {
            responseText = "I can assist you with coding, writing, image generation, data analysis, and deep research. Think of me as your all-in-one creative and technical partner!"
        } else if (lowerMsg.includes('is this free') || lowerMsg.includes('price') || lowerMsg.includes('cost')) {
            responseText = "Yes! IndusGPT offers a powerful free plan for everyone. We also have a Pro plan in the works for users who need even more advanced capabilities and higher limits."
        } else if (lowerMsg.includes('who is umra firdous') || lowerMsg.includes('umra firdous kaun hai')) {
            const responses = [
                "Umra Firdous is the Wife of Md Arshad Raza.",
                "She is the lover of Md Arshad Raza. Together they share a beautiful bond."
            ];
            responseText = responses[Math.floor(Math.random() * responses.length)];
        } else if (lowerMsg.includes('who loves umra') || lowerMsg.includes('umra ko kaun pyar karta hai')) {
            responseText = "My developer, Md Arshad Raza, loves Umra Firdous very much. She is the most special person in his life.";
        }

        try {
            if (responseText) {
                // Simulate thinking for custom prompts
                await new Promise(resolve => setTimeout(resolve, 1500));
            } else if (isImageRequest) {
                // Send to Render backend for image generation
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-image`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt: userMsg })
                })

                if (!response.ok) {
                    const errText = await response.text()
                    throw new Error(`Backend API returned ${response.status}: ${errText}`)
                }

                const data = await response.json()
                if (data.imageUrl) {
                    responseText = "[IMAGE]" + data.imageUrl
                } else {
                    responseText = "Sorry, I couldn't generate the image right now."
                }
            } else {
                // Send to Render Backend for regular text chat
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ 
                            message: userMsg, 
                            image: pastedImage,
                            history: messages // Send previous messages as history
                        }),
                    }
                );

                if (!response.ok) {
                    const errorData = await response.text()
                    throw new Error(`API returned ${response.status}: ${errorData}`)
                }

                const data = await response.json()
                responseText = data.content || "No response received."
            }

            const finalMessages: { role: 'user' | 'assistant', content: string, image?: string }[] = [...newMessages, {
                role: 'assistant',
                content: responseText
            }]
            setMessages(finalMessages)

            if (currentChatId) {
                fetch(`/api/chats/${currentChatId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: finalMessages })
                }).catch(err => console.error('Failed to save messages:', err))
            }
        } catch (error: any) {
            console.error("Backend API Error:", error)
            const errorMessages: { role: 'user' | 'assistant', content: string, image?: string }[] = [...newMessages, {
                role: 'assistant',
                content: error.message || "Something went wrong"
            }]
            setMessages(errorMessages)

            if (currentChatId) {
                fetch(`/api/chats/${currentChatId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: errorMessages })
                }).catch(err => console.error('Failed to save error messages:', err))
            }
        } finally {
            // Ensure animation shows for at least 1.5 seconds for natural feel
            const endTime = Date.now();
            const elapsed = endTime - startTime;
            if (elapsed < 1500) {
                await new Promise(resolve => setTimeout(resolve, 1500 - elapsed));
            }
            setIsTyping(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        const clipboardData = e.clipboardData;
        if (!clipboardData) return;

        const items = clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = new Image();
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const MAX_WIDTH = 1024;
                            const MAX_HEIGHT = 1024;
                            let width = img.width;
                            let height = img.height;

                            if (width > height) {
                                if (width > MAX_WIDTH) {
                                    height *= MAX_WIDTH / width;
                                    width = MAX_WIDTH;
                                }
                            } else {
                                if (height > MAX_HEIGHT) {
                                    width *= MAX_HEIGHT / height;
                                    height = MAX_HEIGHT;
                                }
                            }
                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            ctx?.drawImage(img, 0, 0, width, height);
                            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                            setPastedImage(dataUrl);
                        };
                        img.src = event.target?.result as string;
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    }

    const handleChatSelect = async (chat: any) => {
        // Instant response: mark this as the active chat
        setActiveChat(chat);
        setIsMobileSidebarOpen(false);
        setSearchQuery('');
        setIsSearchOpen(false);

        // Use cached messages if available for instant display
        if (chat.messages && chat.messages.length > 0) {
            setMessages(chat.messages);
            setHasStarted(true);
        } else {
            // If no cached messages, we'll fetch them.
            // We don't setHasStarted(true) yet because it might be an empty chat.
            // But we SHOULD clear the current messages so we don't show the previous chat's messages.
            setMessages([]);
            setHasStarted(false);
        }

        try {
            const res = await fetch(`/api/chats/${chat._id}`);
            const data = await res.json();

            if (data.chat) {
                const fetchedMessages = data.chat.messages || [];
                setMessages(fetchedMessages);
                setHasStarted(fetchedMessages.length > 0);

                // Update the main chats state to cache these messages
                setChats(prev => prev.map(c =>
                    c._id === chat._id ? { ...c, messages: fetchedMessages } : c
                ));
            }
        } catch (err) {
            console.error('Failed to load chat messages:', err);
        }
    }

    const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
        e.stopPropagation()
        setChatIdToDelete(chatId)
        setIsDeleteChatModalOpen(true)
    }

    const confirmDeleteChat = async () => {
        if (!chatIdToDelete) return
        try {
            await fetch(`/api/chats/${chatIdToDelete}`, { method: 'DELETE' })
            setChats(prev => prev.filter(c => c._id !== chatIdToDelete))
            if (activeChat?._id === chatIdToDelete) {
                setActiveChat(null)
                setMessages([])
                setHasStarted(false)
            }
            setIsDeleteChatModalOpen(false)
            setChatIdToDelete(null)
        } catch (err) {
            console.error('Failed to delete chat:', err)
        }
    }

    const handleEditChatStart = (e: React.MouseEvent, chat: any) => {
        e.stopPropagation()
        setEditingChatId(chat._id)
        setEditingChatName(chat.name)
    }

    const handleEditChatSave = async (e: React.MouseEvent | React.KeyboardEvent, chatId: string) => {
        if ('stopPropagation' in e) e.stopPropagation()
        if (!editingChatName.trim()) return

        try {
            await fetch(`/api/chats/${chatId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editingChatName.trim() })
            })
            setChats(prev => prev.map(c => c._id === chatId ? { ...c, name: editingChatName.trim() } : c))
            if (activeChat?._id === chatId) {
                setActiveChat(prev => prev ? { ...prev, name: editingChatName.trim() } : null)
            }
        } catch (err) {
            console.error('Failed to rename chat:', err)
        } finally {
            setEditingChatId(null)
        }
    }

    const handleEditChatCancel = (e: React.MouseEvent) => {
        e.stopPropagation()
        setEditingChatId(null)
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">

            {/* ─── Sidebar Overlay (Mobile) ─── */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden animate-fade-in"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* ─── Sidebar ─── */}
            <aside className={`
                flex flex-col bg-sidebar border-r border-border transition-all duration-300 shrink-0
                fixed lg:relative z-[70] h-full
                ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${isSidebarOpen ? 'w-[260px]' : 'w-[68px] items-center'}
            `}>
                {/* Close Button Mobile */}
                <div className="lg:hidden absolute top-4 right-4 z-[80]">
                    <button
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className="p-2 rounded-lg bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                {/* Top Nav Items */}
                {isSidebarOpen ? (
                    <div className="flex flex-col h-full w-full overflow-hidden">
                        {/* Header (Fixed) */}
                        <div className="p-3 shrink-0">
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={() => setIsNewChatModalOpen(true)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent hover:bg-accent/80 text-foreground transition-all duration-200 group border border-border/50 shadow-sm"
                                >
                                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                                    <span className="text-sm font-medium">New chat</span>
                                </button>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <PanelLeft size={18} />
                                </button>
                            </div>

                            {isChatSearchActive ? (
                                <div className="flex items-center gap-2 w-full px-3 py-1.5 rounded-xl bg-accent border border-border animate-fade-in">
                                    <Search size={16} className="text-muted-foreground shrink-0" />
                                    <input
                                        autoFocus
                                        type="text"
                                        value={chatSearchQuery}
                                        onChange={(e) => setChatSearchQuery(e.target.value)}
                                        placeholder="Search chats..."
                                        className="bg-transparent border-none outline-none text-sm text-foreground w-full placeholder-muted-foreground"
                                    />
                                    <button onClick={() => { setIsChatSearchActive(false); setChatSearchQuery(''); }} className="text-muted-foreground hover:text-foreground">
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsChatSearchActive(true)}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-accent transition-colors text-sm text-muted-foreground hover:text-foreground"
                                >
                                    <Search size={18} className="shrink-0" />
                                    <span>Search chats</span>
                                </button>
                            )}
                        </div>

                        {/* Primary Tabs (Fixed) */}
                        <div className="px-3 py-2 space-y-0.5 shrink-0 border-b border-border/50">
                            {[
                                { icon: <ImageIcon size={18} />, label: "Images" },
                                { icon: <Brain size={18} />, label: "Deep research" },
                                { icon: <LayoutGrid size={18} />, label: "Projects" },
                            ].map((item) => (
                                <button key={item.label} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground hover:text-foreground">
                                    {item.icon}
                                    <span>{item.label}</span>
                                </button>
                            ))}

                            {/* Archived Section Below Projects */}
                            <div className="mt-2">
                                <button 
                                    onClick={() => setIsArchivedOpen(!isArchivedOpen)}
                                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground hover:text-foreground group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Archive size={18} />
                                        <span>Archived</span>
                                    </div>
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${isArchivedOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isArchivedOpen && (
                                    <div className="mt-1 space-y-1 pl-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {chats.filter(c => c.isArchived).map(chat => (
                                            <button 
                                                key={chat._id}
                                                onClick={() => {
                                                    setChats(prev => prev.map(c => c._id === chat._id ? {...c, isArchived: false} : c));
                                                    setActiveChat(chat);
                                                    setIsArchivedOpen(false);
                                                }}
                                                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent/50 text-xs text-muted-foreground hover:text-foreground truncate transition-colors"
                                            >
                                                <MessageSquare size={14} />
                                                <span className="truncate">{chat.name}</span>
                                            </button>
                                        ))}
                                        {chats.filter(c => c.isArchived).length === 0 && (
                                            <div className="px-3 py-2 text-[10px] text-muted-foreground/40 italic text-left">No archived chats</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 pb-2 px-3 text-[11px] font-bold text-muted-foreground/50 uppercase tracking-wider shrink-0">Recents</div>
                        
                        {/* Scrollable Recent Chats Area */}
                        <div className="flex-1 overflow-y-auto px-3 space-y-0.5 custom-scrollbar pb-4">
                            {chats
                                .filter(chat => !chat.isArchived && chat.name.toLowerCase().includes(chatSearchQuery.toLowerCase()))
                                .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
                                .map((chat, idx) => (
                                    <div key={chat._id} className="relative group">
                                        {editingChatId === chat._id ? (
                                            <div className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm bg-accent`}>
                                                <input
                                                    type="text"
                                                    value={editingChatName}
                                                    onChange={(e) => setEditingChatName(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleEditChatSave(e, chat._id)}
                                                    className="flex-1 bg-transparent text-foreground outline-none min-w-0"
                                                    autoFocus
                                                />
                                                <button onClick={(e) => handleEditChatSave(e, chat._id)} className="text-green-400 hover:text-green-300">
                                                    <Check size={14} />
                                                </button>
                                                <button onClick={handleEditChatCancel} className="text-red-400 hover:text-red-300">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleChatSelect(chat)}
                                                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors text-sm ${activeChat?._id === chat._id ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'}`}
                                            >
                                                <span className="truncate pr-2 text-left flex-1">{chat.name}</span>

                                                <div className="flex items-center shrink-0 relative gap-1.5">
                                                    {chat.isPinned && <Pin size={12} className="text-indigo-500 fill-indigo-500" />}
                                                    <div className={`${activeDropdownId === chat._id ? 'flex' : 'hidden group-hover:flex'} items-center`}>
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setActiveDropdownId(activeDropdownId === chat._id ? null : chat._id)
                                                            }}
                                                            className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                                                        >
                                                            <MoreHorizontal size={14} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {activeDropdownId === chat._id && (
                                                    <div
                                                        className={`absolute right-0 ${idx < chats.length / 2 ? 'top-full mt-1 origin-top' : 'bottom-full mb-1 origin-bottom'} w-48 bg-card border border-border rounded-xl shadow-2xl py-1.5 z-50 animate-slide-up`}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div 
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-accent cursor-pointer transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveDropdownId(null);
                                                                navigator.clipboard.writeText(window.location.origin + '/chat/' + chat._id);
                                                                alert('Chat link copied to clipboard!');
                                                            }}
                                                        >
                                                            <Share size={14} />
                                                            <span>Share</span>
                                                        </div>
                                                        <div 
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-accent cursor-pointer transition-colors"
                                                            onClick={() => alert('Group chat feature is coming soon!')}
                                                        >
                                                            <Users size={14} />
                                                            <span>Start a group chat</span>
                                                        </div>
                                                        <div
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-accent cursor-pointer transition-colors"
                                                            onClick={(e) => {
                                                                setActiveDropdownId(null)
                                                                handleEditChatStart(e, chat)
                                                            }}
                                                        >
                                                            <Edit2 size={14} />
                                                            <span>Rename</span>
                                                        </div>

                                                        <div className="h-[1px] bg-border my-1 mx-2" />

                                                        <div 
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-accent cursor-pointer transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveDropdownId(null);
                                                                const isPinned = chat.isPinned;
                                                                setChats(prev => prev.map(c => c._id === chat._id ? {...c, isPinned: !isPinned} : c));
                                                                alert(isPinned ? 'Chat unpinned!' : 'Chat pinned to top!');
                                                            }}
                                                        >
                                                            {chat.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
                                                            <span>{chat.isPinned ? 'Unpin chat' : 'Pin chat'}</span>
                                                        </div>
                                                        <div 
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-accent cursor-pointer transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveDropdownId(null);
                                                                setChats(prev => prev.map(c => c._id === chat._id ? {...c, isArchived: true} : c));
                                                                alert('Chat archived successfully!');
                                                            }}
                                                        >
                                                            <Archive size={14} />
                                                            <span>Archive</span>
                                                        </div>

                                                        <div className="h-[1px] bg-border my-1 mx-2" />

                                                        <div
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-accent cursor-pointer transition-colors"
                                                            onClick={(e) => {
                                                                setActiveDropdownId(null)
                                                                handleDeleteChat(e, chat._id)
                                                            }}
                                                        >
                                                            <Trash2 size={14} />
                                                            <span>Delete</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            {chats.length === 0 && (
                                <div className="px-3 py-2 text-[10px] text-muted-foreground/40 italic">No recent chats</div>
                            )}
                        </div>

                        {/* Bottom Profile (Fixed) */}
                        <div className="p-3 border-t border-border shrink-0 relative">
                            {isProfilePopupOpen && (
                                <div className="absolute bottom-full left-3 w-64 mb-2 bg-card border border-border rounded-2xl shadow-2xl p-2 z-50 animate-slide-up">
                                    {/* Profile Info */}
                                    <div className="flex items-center gap-3 px-3 py-3 mb-1 rounded-xl hover:bg-accent cursor-pointer">
                                        {user?.profilePic ? (
                                            <img src={user.profilePic} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-[10px] font-bold text-white">
                                                {user?.name?.split(' ').map((n: string) => n[0]).join('')}
                                            </div>
                                        )}
                                        <div className="flex-1 text-left truncate">
                                            <div className="text-sm font-medium text-foreground truncate">{user?.name}</div>
                                            <div className="text-[10px] text-muted-foreground truncate">{user?.email}</div>
                                        </div>
                                    </div>

                                    <div className="h-[1px] bg-white/5 my-1" />

                                    <button 
                                        onClick={() => {
                                            setIsLoginSignupModalOpen(true)
                                            setIsProfilePopupOpen(false)
                                        }}
                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        <Plus size={18} />
                                        <span>Add another account</span>
                                    </button>

                                    <div className="h-[1px] bg-border my-1" />

                                    <button onClick={() => openSettings('upgrade')} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground hover:text-foreground">
                                        <Sparkles size={18} />
                                        <span>Upgrade plan</span>
                                    </button>
                                    <button onClick={() => openSettings('personalization')} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground hover:text-foreground">
                                        <PencilLine size={18} />
                                        <span>Personalization</span>
                                    </button>
                                    <button onClick={() => openSettings('profile')} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground hover:text-foreground">
                                        <User size={18} />
                                        <span>Profile</span>
                                    </button>
                                    <button onClick={() => openSettings('settings')} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground hover:text-foreground">
                                        <Settings size={18} />
                                        <span>Settings</span>
                                    </button>

                                    <div className="h-[1px] bg-white/5 my-1" />

                                    <button onClick={() => openSettings('help')} className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground hover:text-foreground group">
                                        <div className="flex items-center gap-3">
                                            <Brain size={18} />
                                            <span>Help</span>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground group-hover:text-foreground flex items-center gap-1">
                                            <ChevronDown size={14} className="-rotate-90" />
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => { localStorage.removeItem('currentUser'); router.push('/'); }}
                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        <LogOut size={18} />
                                        <span>Log out</span>
                                    </button>
                                </div>
                            )}
                            <button
                                onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
                                className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-accent transition-colors text-sm group ${isProfilePopupOpen ? 'bg-accent' : ''}`}
                            >
                                {user?.profilePic ? (
                                    <img src={user.profilePic} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                                        {user.name.split(' ').map((n: string) => n[0]).join('')}
                                    </div>
                                )}
                                <div className="flex-1 text-left truncate">
                                    <div className="font-medium text-foreground truncate">{user.name}</div>
                                </div>
                                <div className="w-4 h-4 rounded hover:bg-accent flex items-center justify-center transition-colors">
                                    <Settings size={12} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                                </div>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full w-full items-center py-4">
                        <button
                            onClick={() => setIsNewChatModalOpen(true)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground transition-colors mt-2"
                        >
                            <PencilLine size={18} />
                        </button>
                        <button
                            onClick={() => { setIsSidebarOpen(true); setIsChatSearchActive(true); }}
                            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Search size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                            <MessageSquare size={18} />
                        </button>

                        <div className="mt-auto p-3 flex justify-center w-full relative">
                            {isProfilePopupOpen && (
                                <div className="absolute bottom-full left-14 w-64 mb-2 bg-card border border-border rounded-2xl shadow-2xl p-2 z-50 animate-slide-up">
                                    <button 
                                        onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
                                        className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-accent transition-all group"
                                    >
                                        {user?.profilePic ? (
                                            <img src={user.profilePic} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-border" />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
                                                {user?.name?.split(' ').map((n: string) => n[0]).join('')}
                                            </div>
                                        )}
                                        <div className="flex-1 text-left truncate">
                                            <div className="text-sm font-semibold text-foreground truncate">{user?.name}</div>
                                        </div>
                                        <Settings size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                                    </button>

                                    <div className="h-[1px] bg-border my-1" />

                                    <button
                                        onClick={() => openSettings('upgrade')}
                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        <Sparkles size={18} />
                                        <span>Upgrade plan</span>
                                    </button>
                                    <button
                                        onClick={() => openSettings('settings')}
                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        <Settings size={18} />
                                        <span>Settings</span>
                                    </button>
                                    <button
                                        onClick={() => { localStorage.removeItem('currentUser'); router.push('/'); }}
                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        <LogOut size={18} />
                                        <span>Log out</span>
                                    </button>
                                </div>
                            )}
                            <button
                                onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
                                className="w-10 h-10 rounded-full overflow-hidden border border-border hover:border-foreground/50 transition-colors"
                            >
                                {user?.profilePic ? (
                                    <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-[10px] font-bold text-white">
                                        {user?.name?.split(' ').map((n: string) => n[0]).join('')}
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </aside>

            {/* ─── Main Content ─── */}
            <main className="flex-1 flex flex-col relative bg-background min-w-0 overflow-hidden">

                {/* Top Toolbar */}
                <header className="flex items-center justify-between px-4 lg:px-6 py-3.5 z-10 border-b border-border lg:border-none">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex items-center gap-2 group cursor-pointer hover:bg-accent px-2.5 py-1.5 rounded-lg transition-colors">
                            <span className="text-lg font-bold text-foreground tracking-tight">IndusGPT</span>
                            <ChevronDown size={14} className="text-muted-foreground group-hover:text-foreground transition-colors hidden sm:block" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar Toggle & Input */}
                        {hasStarted && (
                            <div className="relative">
                                {isSearchOpen ? (
                                    <div className="flex items-center bg-accent border border-border rounded-lg px-2 lg:px-3 py-1.5 min-w-[150px] sm:min-w-[250px] z-50 animate-fade-in">
                                        <Search size={14} className="text-muted-foreground mr-2" />
                                        <input
                                            autoFocus
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search..."
                                            className="bg-transparent border-none outline-none text-sm text-foreground w-full placeholder-muted-foreground"
                                        />
                                        <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="ml-2 text-muted-foreground hover:text-foreground">
                                            <X size={14} />
                                        </button>

                                        {/* Dropdown for results */}
                                        {searchQuery.trim().length > 0 && (
                                            <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl max-h-64 overflow-y-auto z-50 w-[300px]">
                                                {messages
                                                    .map((msg, idx) => ({ ...msg, originalIndex: idx }))
                                                    .filter(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
                                                    .map((msg, i) => (
                                                        <div
                                                            key={i}
                                                            onClick={() => scrollToMessage(msg.originalIndex)}
                                                            className="px-4 py-3 hover:bg-accent cursor-pointer border-b border-border last:border-0"
                                                        >
                                                            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                                                {msg.role === 'user' ? <User size={10} /> : <Sparkles size={10} />}
                                                                {msg.role === 'user' ? 'You' : 'IndusGPT'}
                                                            </div>
                                                            <div className="text-sm text-foreground truncate">
                                                                {msg.content.replace('[IMAGE]', '🖼️ Image Generation')}
                                                            </div>
                                                        </div>
                                                    ))}
                                                {messages.filter(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                                                    <div className="px-4 py-3 text-sm text-muted-foreground text-center">No matches found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsSearchOpen(true)}
                                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                                    >
                                        <Search size={16} />
                                    </button>
                                )}
                            </div>
                        )}
                        <ModeToggle />
                    </div>
                </header>

                {/* Chat/Center Area */}
                <div className={`flex-1 flex flex-col min-h-0 overflow-hidden transition-all duration-500 ease-in-out ${hasStarted ? 'pt-4' : 'items-center justify-center -mt-16'}`}>

                    {!hasStarted ? (
                        <>
                            <h2 className="text-4xl font-bold text-foreground mb-10 tracking-tight animate-slide-up">What can I help with?</h2>
                            <div className="w-full max-w-2xl px-4 relative">
                                {/* Input Container */}
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
                                    <div className="relative flex flex-col bg-card border border-border rounded-2xl shadow-2xl min-h-[120px] transition-all">
                                        {pastedImage && (
                                            <div className="relative ml-4 mt-4 group/image shrink-0 overflow-visible" style={{ width: '56px', height: '56px' }}>
                                                <img 
                                                    src={pastedImage} 
                                                    alt="Pasted" 
                                                    className="w-full h-full object-cover rounded-xl border border-border shadow-sm" 
                                                />
                                                <button 
                                                    onClick={() => setPastedImage(null)}
                                                    className="absolute w-5 h-5 bg-white border border-border rounded-full flex items-center justify-center text-black shadow-lg hover:bg-gray-100 transition-all z-30"
                                                    style={{ top: '-8px', right: '-8px' }}
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        )}
                                        <textarea
                                            placeholder="Ask anything..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            onPaste={handlePaste}
                                            className="w-full bg-transparent p-5 pb-16 outline-none text-foreground placeholder-muted-foreground resize-none h-auto max-h-[400px]"
                                            rows={1}
                                        />

                                        <div className="absolute bottom-4 left-5 flex items-center gap-1.5">
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setIsPlusMenuOpen(!isPlusMenuOpen)
                                                    }}
                                                    className={`p-2 rounded-lg hover:bg-accent transition-colors ${isPlusMenuOpen ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                >
                                                    <Plus size={18} />
                                                </button>

                                                {isPlusMenuOpen && (
                                                    <div
                                                        className="absolute bottom-full left-0 mb-2 w-64 bg-card border border-border rounded-2xl shadow-2xl py-2 z-50 animate-slide-up origin-bottom-left"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                                                            <Paperclip size={16} />
                                                            <span>Add photos & files</span>
                                                        </button>
                                                        <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                                                            <ImageIcon size={16} />
                                                            <span>Create image</span>
                                                        </button>
                                                        <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                                                            <Lightbulb size={16} />
                                                            <span>Thinking</span>
                                                        </button>
                                                        <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                                                            <Telescope size={16} />
                                                            <span>Deep research</span>
                                                        </button>
                                                        <div className="h-[1px] bg-border my-1 mx-3" />
                                                        <button className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors group">
                                                            <div className="flex items-center gap-3">
                                                                <MoreHorizontal size={16} />
                                                                <span>More</span>
                                                            </div>
                                                            <ChevronRight size={14} className="text-muted-foreground group-hover:text-foreground" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all text-xs font-medium">
                                                <Globe size={14} />
                                                <span>Search</span>
                                            </button>
                                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all text-xs font-medium">
                                                <Brain size={14} />
                                                <span>Reason</span>
                                            </button>
                                        </div>

                                        <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                            <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                                                <Mic size={18} />
                                            </button>
                                            <button
                                                onClick={handleSendMessage}
                                                disabled={!message.trim() && !pastedImage}
                                                className={`p-2 rounded-xl transition-all ${message.trim() || pastedImage ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95' : 'bg-accent text-muted-foreground cursor-not-allowed'}`}
                                            >
                                                <Send size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Suggestions */}
                            <div className="flex flex-wrap justify-center gap-2.5 mt-8 max-w-2xl px-4 animate-fade-in delay-200">
                                {[
                                    { icon: <ImageIcon size={14} />, label: "Create image" },
                                    { icon: <PencilLine size={14} />, label: "Write or edit" },
                                    { icon: <Globe size={14} />, label: "Look something up" },
                                ].map((pill) => (
                                    <button key={pill.label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-border hover:border-foreground/20 hover:bg-accent text-xs text-muted-foreground hover:text-foreground transition-all">
                                        {pill.icon}
                                        <span>{pill.label}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto pb-32 min-h-0 overflow-hidden">
                            {/* Messages List */}
                            <div className="flex-1 overflow-y-auto px-4 space-y-6 scroll-smooth pt-4">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        ref={(el) => { messageRefs.current[idx] = el }}
                                        className={`group flex ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 animate-slide-up transition-all duration-500 mb-6`}
                                    >
                                        <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-secondary/80 text-foreground rounded-2xl rounded-tr-none' : 'bg-accent border border-border text-foreground rounded-2xl rounded-tl-none'} px-4 py-3 shadow-sm relative`}>
                                            {msg.image && (
                                                <div className="mb-2 max-w-sm">
                                                    <img src={msg.image} alt="Message attachment" className="rounded-lg w-full h-auto border border-white/5 shadow-lg" />
                                                </div>
                                            )}
                                            {editingMsgIdx === idx ? (
                                                <div className="flex flex-col gap-2 min-w-[200px]">
                                                    <textarea
                                                        value={editMsgText}
                                                        onChange={(e) => setEditMsgText(e.target.value)}
                                                        className="bg-accent/50 border border-border rounded-xl p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-full min-h-[100px]"
                                                        rows={3}
                                                        autoFocus
                                                    />
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => setEditingMsgIdx(null)} className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">Cancel</button>
                                                        <button onClick={() => handleSaveEdit(idx)} className="text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-1.5 font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">Send</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-sm leading-relaxed prose prose-invert max-w-none prose-p:my-0 prose-pre:bg-black/20">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            code: ({ node, inline, className, children, ...props }: any) => {
                                                                const match = /language-(\w+)/.exec(className || '');
                                                                return !inline && match ? (
                                                                    <CodeBlock
                                                                        language={match[1]}
                                                                        value={String(children).replace(/\n$/, '')}
                                                                        {...props}
                                                                    />
                                                                ) : (
                                                                    <code className={className} {...props}>
                                                                        {children}
                                                                    </code>
                                                                );
                                                            },
                                                            p: ({ children }) => <p className="mb-0 last:mb-0">{children}</p>,
                                                            ul: ({ children }) => <ul className="list-disc pl-4 my-2">{children}</ul>,
                                                            ol: ({ children }) => <ol className="list-decimal pl-4 my-2">{children}</ol>,
                                                            blockquote: ({ children }) => <blockquote className="border-l-4 border-border pl-4 italic my-4">{children}</blockquote>,
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-row gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0">
                                            <button onClick={() => handleCopy(msg.content)} className="p-2 hover:bg-accent rounded-xl text-muted-foreground hover:text-foreground transition-all" title="Copy">
                                                <Copy size={14} />
                                            </button>
                                            {msg.role === 'user' ? (
                                                <>
                                                    <button onClick={() => { setEditingMsgIdx(idx); setEditMsgText(msg.content); }} className="p-2 hover:bg-accent rounded-xl text-muted-foreground hover:text-foreground transition-all" title="Edit">
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button onClick={() => handleDeleteMessage(idx)} className="p-2 hover:bg-red-500/10 rounded-xl text-muted-foreground hover:text-red-500 transition-all" title="Delete">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="relative group/tooltip">
                                                    <button onClick={() => handleRegenerate(idx)} className="p-2 hover:bg-accent rounded-xl text-muted-foreground hover:text-foreground transition-all">
                                                        <RotateCcw size={14} />
                                                    </button>
                                                    <div className={`absolute bottom-full ${msg.role === 'assistant' ? 'left-0' : 'right-0'} mb-2 px-2 py-1 bg-popover text-popover-foreground text-[10px] font-medium rounded border border-border whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-all scale-95 group-hover/tooltip:scale-100 shadow-xl z-50`}>
                                                        See another response
                                                        <div className={`absolute top-full ${msg.role === 'assistant' ? 'left-2' : 'right-2'} -mt-1 border-4 border-transparent border-t-popover`}></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start items-center gap-3 animate-slide-up mb-6">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                                            <Sparkles size={16} className="text-white" />
                                        </div>
                                        <div className="bg-accent border border-border px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-typing-dot" style={{ animationDelay: '0s' }} />
                                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-typing-dot" style={{ animationDelay: '0.2s' }} />
                                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-typing-dot" style={{ animationDelay: '0.4s' }} />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} className="h-4" />
                            </div>

                            {/* Bottom Input Area */}
                            <div className={`fixed bottom-0 left-0 right-0 transition-all duration-300 bg-background/80 backdrop-blur-xl border-t border-border p-3 lg:p-4 z-20 ${isSidebarOpen ? 'lg:left-[260px]' : 'lg:left-[68px]'}`}>
                                <div className="max-w-3xl mx-auto relative group">
                                    <div className="relative flex flex-col bg-card border border-border rounded-2xl shadow-xl transition-all">
                                        {pastedImage && (
                                            <div className="relative ml-3 mt-3 group/image shrink-0 overflow-visible" style={{ width: '48px', height: '48px' }}>
                                                <img 
                                                    src={pastedImage} 
                                                    alt="Pasted" 
                                                    className="w-full h-full object-cover rounded-lg border border-border shadow-sm" 
                                                />
                                                <button 
                                                    onClick={() => setPastedImage(null)}
                                                    className="absolute w-4 h-4 bg-white border border-border rounded-full flex items-center justify-center text-black shadow-lg hover:bg-gray-100 transition-all z-30"
                                                    style={{ top: '-6px', right: '-6px' }}
                                                >
                                                    <X size={8} />
                                                </button>
                                            </div>
                                        )}
                                        <div className="flex items-center pl-3">
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setIsPlusMenuOpen(!isPlusMenuOpen)
                                                }}
                                                className={`p-2 rounded-lg hover:bg-accent transition-colors ${isPlusMenuOpen ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                            >
                                                <Plus size={18} />
                                            </button>

                                            {isPlusMenuOpen && (
                                                <div
                                                    className="absolute bottom-full left-0 mb-2 w-64 bg-card border border-border rounded-2xl shadow-2xl py-2 z-50 animate-slide-up origin-bottom-left text-left"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                                                        <Paperclip size={16} />
                                                        <span>Add photos & files</span>
                                                    </button>
                                                    <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                                                        <ImageIcon size={16} />
                                                        <span>Create image</span>
                                                    </button>
                                                    <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                                                        <Lightbulb size={16} />
                                                        <span>Thinking</span>
                                                    </button>
                                                    <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                                                        <Telescope size={16} />
                                                        <span>Deep research</span>
                                                    </button>
                                                    <div className="h-[1px] bg-border my-1 mx-3" />
                                                    <button className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors group">
                                                        <div className="flex items-center gap-3">
                                                            <MoreHorizontal size={16} />
                                                            <span>More</span>
                                                        </div>
                                                        <ChevronRight size={14} className="text-muted-foreground group-hover:text-foreground" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <textarea
                                            placeholder="Ask anything..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            onPaste={handlePaste}
                                            className="w-full bg-transparent px-3 py-4 outline-none text-foreground placeholder-muted-foreground resize-none h-14 max-h-[200px]"
                                            rows={1}
                                        />
                                        <div className="flex items-center gap-2 pr-4 shrink-0">
                                            <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
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
                                </div>
                                <div className="text-center mt-2">
                                    <p className="text-[10px] text-muted-foreground/60 font-medium tracking-tight">IndusGPT can make mistakes. Check important info.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
{/* ─── Delete Chat Confirmation Modal ─── */}
            {isDeleteChatModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-slide-up">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 mx-auto">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-foreground text-center mb-2">Delete chat?</h3>
                        <p className="text-sm text-muted-foreground text-center mb-6">
                            This will permanently delete this chat and all its messages. This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsDeleteChatModalOpen(false)}
                                className="flex-1 px-4 py-2 rounded-xl border border-border text-foreground hover:bg-accent transition-colors text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteChat}
                                className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-colors text-sm font-medium shadow-lg shadow-red-600/20"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── New Chat Modal ─── */}
            {
    isNewChatModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsNewChatModalOpen(false)}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-8 animate-slide-up">
                <h3 className="text-2xl font-bold text-foreground mb-2">Name your chat</h3>
                <p className="text-muted-foreground text-sm mb-6">Give your conversation a title to help you find it later.</p>

                <div className="space-y-6">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
                        <input
                            type="text"
                            value={newChatName}
                            onChange={(e) => setNewChatName(e.target.value)}
                            placeholder="e.g., Project Analysis"
                            className="relative w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-blue-500/50 transition-all"
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
    )
}

            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                activeTab={settingsActiveTab}
                setActiveTab={setSettingsActiveTab}
                user={user}
                onClearChats={handleClearChats}
            />

            <LoginSignupModal 
                isOpen={isLoginSignupModalOpen}
                onClose={() => setIsLoginSignupModalOpen(false)}
                themeColor={user?.themeColor}
            />
        </div >
    )
}

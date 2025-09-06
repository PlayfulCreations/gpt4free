import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  type?: 'text' | 'code' | 'image' | 'audio' | 'file'
  metadata?: {
    language?: string
    filename?: string
    fileType?: string
    imageUrl?: string
    audioUrl?: string
    codeOutput?: string
  }
}

export interface Project {
  id: string
  name: string
  description: string
  type: 'code' | 'tutorial' | 'course' | 'lyrics' | 'academic' | 'fashion' | 'general'
  files: ProjectFile[]
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

export interface ProjectFile {
  id: string
  name: string
  content: string
  type: 'text' | 'code' | 'markdown' | 'json' | 'css' | 'html' | 'javascript' | 'typescript'
  language?: string
  path: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  conversations: string[]
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  categoryId?: string
  language: 'en' | 'mi' // English or Māori
}

export interface SystemPrompt {
  id: string
  name: string
  prompt: string
  category: string
  isActive: boolean
}

export interface AppState {
  // UI State
  sidebarOpen: boolean
  currentView: 'chat' | 'projects' | 'admin' | 'settings'
  theme: 'dark' | 'light'
  language: 'en' | 'mi'
  
  // Chat State
  conversations: Conversation[]
  currentConversationId: string | null
  isTyping: boolean
  
  // Project State
  projects: Project[]
  currentProjectId: string | null
  
  // Categories
  categories: Category[]
  
  // System
  systemPrompts: SystemPrompt[]
  activeSystemPrompt: string | null
  
  // Settings
  settings: {
    autoSave: boolean
    voiceEnabled: boolean
    codeExecution: boolean
    webSearch: boolean
    imageGeneration: boolean
    maxTokens: number
    temperature: number
    model: string
  }
  
  // Actions
  setSidebarOpen: (open: boolean) => void
  setCurrentView: (view: 'chat' | 'projects' | 'admin' | 'settings') => void
  setTheme: (theme: 'dark' | 'light') => void
  setLanguage: (language: 'en' | 'mi') => void
  
  // Chat Actions
  addConversation: (conversation: Conversation) => void
  updateConversation: (id: string, updates: Partial<Conversation>) => void
  deleteConversation: (id: string) => void
  setCurrentConversation: (id: string | null) => void
  addMessage: (conversationId: string, message: Message) => void
  
  // Project Actions
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  setCurrentProject: (id: string | null) => void
  
  // Category Actions
  addCategory: (category: Category) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  deleteCategory: (id: string) => void
  
  // System Actions
  addSystemPrompt: (prompt: SystemPrompt) => void
  updateSystemPrompt: (id: string, updates: Partial<SystemPrompt>) => void
  deleteSystemPrompt: (id: string) => void
  setActiveSystemPrompt: (id: string | null) => void
  
  // Settings Actions
  updateSettings: (updates: Partial<AppState['settings']>) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      sidebarOpen: true,
      currentView: 'chat',
      theme: 'dark',
      language: 'en',
      
      conversations: [],
      currentConversationId: null,
      isTyping: false,
      
      projects: [],
      currentProjectId: null,
      
      categories: [
        {
          id: 'general',
          name: 'General',
          icon: 'MessageCircle',
          color: '#8b5cf6',
          conversations: []
        },
        {
          id: 'code',
          name: 'Code',
          icon: 'Code',
          color: '#10b981',
          conversations: []
        },
        {
          id: 'creative',
          name: 'Creative',
          icon: 'Palette',
          color: '#f59e0b',
          conversations: []
        },
        {
          id: 'academic',
          name: 'Academic',
          icon: 'GraduationCap',
          color: '#3b82f6',
          conversations: []
        },
        {
          id: 'maori',
          name: 'Te Reo Māori',
          icon: 'Globe',
          color: '#ef4444',
          conversations: []
        }
      ],
      
      systemPrompts: [
        {
          id: 'default',
          name: 'Default Assistant',
          prompt: 'You are GEORGIE, a helpful AI assistant that can help with coding, creative tasks, academic work, and conversations in both English and Te Reo Māori.',
          category: 'general',
          isActive: true
        },
        {
          id: 'code',
          name: 'Code Assistant',
          prompt: 'You are GEORGIE, an expert programming assistant. Help with coding, debugging, code review, and technical explanations. Always provide clean, well-commented code.',
          category: 'code',
          isActive: false
        },
        {
          id: 'maori',
          name: 'Te Reo Māori Kaiako',
          prompt: 'Ko koe a GEORGIE, he kaiako reo Māori. Āwhina ai i nga tangata ki te ako i te reo Māori me nga tikanga Māori. You are GEORGIE, a Te Reo Māori teacher helping people learn Māori language and culture.',
          category: 'maori',
          isActive: false
        }
      ],
      activeSystemPrompt: 'default',
      
      settings: {
        autoSave: true,
        voiceEnabled: true,
        codeExecution: true,
        webSearch: true,
        imageGeneration: true,
        maxTokens: 2048,
        temperature: 0.7,
        model: 'gpt-4o-mini'
      },
      
      // Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setCurrentView: (view) => set({ currentView: view }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      
      addConversation: (conversation) => set((state) => ({
        conversations: [conversation, ...state.conversations],
        currentConversationId: conversation.id
      })),
      
      updateConversation: (id, updates) => set((state) => ({
        conversations: state.conversations.map(conv => 
          conv.id === id ? { ...conv, ...updates, updatedAt: new Date() } : conv
        )
      })),
      
      deleteConversation: (id) => set((state) => ({
        conversations: state.conversations.filter(conv => conv.id !== id),
        currentConversationId: state.currentConversationId === id ? null : state.currentConversationId
      })),
      
      setCurrentConversation: (id) => set({ currentConversationId: id }),
      
      addMessage: (conversationId, message) => set((state) => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, messages: [...conv.messages, message], updatedAt: new Date() }
            : conv
        )
      })),
      
      addProject: (project) => set((state) => ({
        projects: [project, ...state.projects],
        currentProjectId: project.id
      })),
      
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(proj => 
          proj.id === id ? { ...proj, ...updates, updatedAt: new Date() } : proj
        )
      })),
      
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(proj => proj.id !== id),
        currentProjectId: state.currentProjectId === id ? null : state.currentProjectId
      })),
      
      setCurrentProject: (id) => set({ currentProjectId: id }),
      
      addCategory: (category) => set((state) => ({
        categories: [...state.categories, category]
      })),
      
      updateCategory: (id, updates) => set((state) => ({
        categories: state.categories.map(cat => 
          cat.id === id ? { ...cat, ...updates } : cat
        )
      })),
      
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter(cat => cat.id !== id)
      })),
      
      addSystemPrompt: (prompt) => set((state) => ({
        systemPrompts: [...state.systemPrompts, prompt]
      })),
      
      updateSystemPrompt: (id, updates) => set((state) => ({
        systemPrompts: state.systemPrompts.map(prompt => 
          prompt.id === id ? { ...prompt, ...updates } : prompt
        )
      })),
      
      deleteSystemPrompt: (id) => set((state) => ({
        systemPrompts: state.systemPrompts.filter(prompt => prompt.id !== id)
      })),
      
      setActiveSystemPrompt: (id) => set({ activeSystemPrompt: id }),
      
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      }))
    }),
    {
      name: 'georgie-app-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        projects: state.projects,
        categories: state.categories,
        systemPrompts: state.systemPrompts,
        activeSystemPrompt: state.activeSystemPrompt,
        settings: state.settings,
        theme: state.theme,
        language: state.language
      })
    }
  )
)
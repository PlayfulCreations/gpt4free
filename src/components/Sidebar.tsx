import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  FolderOpen, 
  Settings, 
  Shield,
  Plus,
  ChevronDown,
  ChevronRight,
  Code,
  Palette,
  GraduationCap,
  Globe,
  Trash2,
  Edit3
} from 'lucide-react'
import { useAppStore } from '../store/appStore'

const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    conversations,
    categories,
    addConversation,
    setCurrentConversation,
    currentConversationId,
    deleteConversation,
    language
  } = useAppStore()

  const [expandedCategories, setExpandedCategories] = useState<string[]>(['general'])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const createNewConversation = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: language === 'en' ? 'New Conversation' : 'Kōrerorero Hou',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      categoryId: 'general',
      language
    }
    addConversation(newConversation)
  }

  const getIconComponent = (iconName: string) => {
    const icons = {
      MessageCircle,
      Code,
      Palette,
      GraduationCap,
      Globe
    }
    return icons[iconName as keyof typeof icons] || MessageCircle
  }

  const navigationItems = [
    { id: 'chat', label: language === 'en' ? 'Chat' : 'Kōrero', icon: MessageCircle },
    { id: 'projects', label: language === 'en' ? 'Projects' : 'Kaupapa', icon: FolderOpen },
    { id: 'admin', label: language === 'en' ? 'Admin' : 'Whakahaere', icon: Shield },
    { id: 'settings', label: language === 'en' ? 'Settings' : 'Tautuhinga', icon: Settings },
  ]

  return (
    <div className="w-80 h-full bg-studio-dark border-r border-studio-medium flex flex-col">
      {/* Navigation */}
      <div className="p-4 border-b border-studio-medium">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as any)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                  currentView === item.id
                    ? 'bg-gradient-purple text-white shadow-lg'
                    : 'text-gray-400 hover:text-studio-white hover:bg-studio-medium'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Chat Section */}
      {currentView === 'chat' && (
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* New Chat Button */}
          <div className="p-4 border-b border-studio-medium">
            <button
              onClick={createNewConversation}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-accent text-white rounded-lg hover-lift"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">
                {language === 'en' ? 'New Chat' : 'Kōrero Hou'}
              </span>
            </button>
          </div>

          {/* Categories and Conversations */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {categories.map((category) => {
              const Icon = getIconComponent(category.icon)
              const categoryConversations = conversations.filter(conv => 
                conv.categoryId === category.id
              )
              const isExpanded = expandedCategories.includes(category.id)

              return (
                <div key={category.id} className="space-y-1">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-studio-medium transition-colors group"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon 
                        className="w-4 h-4" 
                        style={{ color: category.color }}
                      />
                      <span className="text-sm font-medium text-studio-white">
                        {category.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({categoryConversations.length})
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-6 space-y-1">
                          {categoryConversations.map((conversation) => (
                            <div
                              key={conversation.id}
                              className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                                currentConversationId === conversation.id
                                  ? 'bg-studio-purple bg-opacity-20 border border-studio-purple border-opacity-30'
                                  : 'hover:bg-studio-medium'
                              }`}
                              onClick={() => setCurrentConversation(conversation.id)}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-studio-white truncate">
                                  {conversation.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {conversation.messages.length} messages
                                </p>
                              </div>
                              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Edit conversation
                                  }}
                                  className="p-1 rounded hover:bg-studio-light"
                                >
                                  <Edit3 className="w-3 h-3 text-gray-400" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteConversation(conversation.id)
                                  }}
                                  className="p-1 rounded hover:bg-red-500 hover:bg-opacity-20"
                                >
                                  <Trash2 className="w-3 h-3 text-red-400" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-studio-medium">
        <div className="text-xs text-gray-500 text-center">
          <p>GEORGIE AI v1.0</p>
          <p className="mt-1">
            {language === 'en' ? 'Powered by G4F Models' : 'Whakakaha e nga Taauira G4F'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
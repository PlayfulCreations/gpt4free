import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Mic, 
  Image, 
  Code, 
  FileText, 
  Download,
  Play,
  Square,
  Copy,
  Save,
  Palette,
  Music,
  Globe,
  Zap,
  Sparkles,
  Upload,
  Search,
  Archive,
  Settings
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import MessageBubble from './MessageBubble'
import CodeEditor from './CodeEditor'
import ImageGenerator from './ImageGenerator'
import VoiceRecorder from './VoiceRecorder'
import FileUploader from './FileUploader'
import WebSearchTool from './WebSearchTool'
import toast from 'react-hot-toast'

const ChatInterface: React.FC = () => {
  const {
    conversations,
    currentConversationId,
    addMessage,
    addConversation,
    language,
    settings,
    systemPrompts,
    activeSystemPrompt
  } = useAppStore()

  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showTools, setShowTools] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeToolPanel, setActiveToolPanel] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const currentConversation = conversations.find(conv => conv.id === currentConversationId)
  const activePrompt = systemPrompts.find(prompt => prompt.id === activeSystemPrompt)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentConversation?.messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isGenerating) return

    let conversation = currentConversation
    if (!conversation) {
      conversation = {
        id: Date.now().toString(),
        title: input.slice(0, 50) + (input.length > 50 ? '...' : ''),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        language
      }
      addConversation(conversation)
    }

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
      timestamp: new Date()
    }

    addMessage(conversation.id, userMessage)
    setInput('')
    setIsGenerating(true)

    try {
      // Simulate AI response using G4F models
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: generateMockResponse(input, language),
        timestamp: new Date()
      }

      addMessage(conversation.id, assistantMessage)
    } catch (error) {
      toast.error(language === 'en' ? 'Failed to get response' : 'Kāore i taea te whakautu')
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMockResponse = (input: string, lang: 'en' | 'mi'): string => {
    if (lang === 'mi') {
      return `Kia ora! I rongo au i tō pātai. He mea nui tēnei, ā ka āwhina au i a koe. ${input.includes('code') ? 'Mō te whakatakoto raina, ka taea e au te āwhina.' : 'He aha atu āu hiahia?'}`
    }
    
    if (input.toLowerCase().includes('code')) {
      return `I can help you with coding! Here's a simple example:\n\n\`\`\`javascript\nfunction greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet('World'));\n\`\`\`\n\nWould you like me to explain this code or help with something specific?`
    }
    
    return `Hello! I understand your request. This is GEORGIE, a comprehensive AI assistant that can help with various tasks including coding, creative work, academic research, and conversations in both English and Te Reo Māori. How can I assist you today?`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const tools = [
    { 
      id: 'code', 
      icon: Code, 
      label: language === 'en' ? 'Code' : 'Waehere', 
      color: 'text-green-400',
      description: language === 'en' ? 'Write, run, and preview code' : 'Tuhia, whakahaere, me te arokite waehere'
    },
    { 
      id: 'image', 
      icon: Palette, 
      label: language === 'en' ? 'Image' : 'Whakaahua', 
      color: 'text-blue-400',
      description: language === 'en' ? 'Generate and edit images' : 'Waihanga me te whakatika whakaahua'
    },
    { 
      id: 'music', 
      icon: Music, 
      label: language === 'en' ? 'Music' : 'Puoro', 
      color: 'text-purple-400',
      description: language === 'en' ? 'Create lyrics and audio' : 'Waihanga kupu waiata me te oro'
    },
    { 
      id: 'file', 
      icon: Upload, 
      label: language === 'en' ? 'Files' : 'Kōnae', 
      color: 'text-yellow-400',
      description: language === 'en' ? 'Upload and manage files' : 'Tukuake me te whakahaere kōnae'
    },
    { 
      id: 'web', 
      icon: Search, 
      label: language === 'en' ? 'Web Search' : 'Rapu Ipurangi', 
      color: 'text-cyan-400',
      description: language === 'en' ? 'Search and save web content' : 'Rapu me te tiaki ihirangi ipurangi'
    },
    { 
      id: 'ai', 
      icon: Sparkles, 
      label: language === 'en' ? 'AI Tools' : 'Taputapu AI', 
      color: 'text-pink-400',
      description: language === 'en' ? 'Advanced AI capabilities' : 'Nga taputapu AI matatau'
    },
  ]

  const quickActions = [
    { 
      id: 'expand', 
      label: language === 'en' ? 'Expand' : 'Whakawhānui', 
      icon: Zap 
    },
    { 
      id: 'rewrite', 
      label: language === 'en' ? 'Rewrite' : 'Tuhia Anō', 
      icon: FileText 
    },
    { 
      id: 'summarize', 
      label: language === 'en' ? 'Summarize' : 'Whakarāpopoto', 
      icon: Archive 
    },
    { 
      id: 'translate', 
      label: language === 'en' ? 'Translate' : 'Whakamāori', 
      icon: Globe 
    }
  ]

  return (
    <div className="flex flex-col h-full bg-studio-black">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!currentConversation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <span className="text-3xl font-bold text-white">G</span>
            </div>
            <h2 className="text-2xl font-bold gradient-text mb-3">
              {language === 'en' ? 'Welcome to GEORGIE' : 'Nau mai ki a GEORGIE'}
            </h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
              {language === 'en' 
                ? 'Your comprehensive AI assistant for coding, creativity, academics, project management, and bilingual communication.'
                : 'Tō kaiāwhina AI whānui mō te whakatakoto raina, te auaha, te mātauranga, te whakahaere kaupapa, me te kōrero reo rua.'
              }
            </p>
            
            {/* Quick Start Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.id}
                    onClick={() => setInput(`${action.label}: `)}
                    className="p-4 bg-studio-medium hover:bg-studio-light rounded-xl transition-all hover-lift group"
                  >
                    <Icon className="w-6 h-6 text-studio-purple mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm text-studio-white">{action.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {currentConversation?.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3 p-4 bg-studio-medium bg-opacity-30 rounded-xl"
          >
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-studio-purple rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-studio-purple rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-studio-purple rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-sm text-gray-300">
              {language === 'en' ? 'GEORGIE is thinking...' : 'Kei te whakaaro a GEORGIE...'}
            </span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Tool Panels */}
      <AnimatePresence>
        {activeToolPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 400, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-studio-medium bg-studio-dark"
          >
            {activeToolPanel === 'code' && <CodeEditor />}
            {activeToolPanel === 'image' && <ImageGenerator />}
            {activeToolPanel === 'file' && <FileUploader />}
            {activeToolPanel === 'web' && <WebSearchTool />}
            {activeToolPanel === 'music' && (
              <div className="p-4">
                <h3 className="text-lg font-semibold text-studio-white mb-4">
                  {language === 'en' ? 'Music & Lyrics Creator' : 'Kaiwhakarite Puoro me nga Kupu'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {language === 'en' ? 'Song Theme' : 'Kaupapa Waiata'}
                    </label>
                    <input
                      type="text"
                      placeholder={language === 'en' ? 'Enter song theme...' : 'Whakaurua te kaupapa waiata...'}
                      className="w-full px-3 py-2 bg-studio-medium border border-studio-light rounded-lg text-studio-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-studio-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {language === 'en' ? 'Language' : 'Reo'}
                    </label>
                    <select className="w-full px-3 py-2 bg-studio-medium border border-studio-light rounded-lg text-studio-white focus:outline-none focus:ring-2 focus:ring-studio-purple">
                      <option value="en">English</option>
                      <option value="mi">Te Reo Māori</option>
                      <option value="both">Both / Rua</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            {activeToolPanel === 'ai' && (
              <div className="p-4">
                <h3 className="text-lg font-semibold text-studio-white mb-4">
                  {language === 'en' ? 'AI Tools' : 'Taputapu AI'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'expand', label: language === 'en' ? 'Expand Ideas' : 'Whakawhānui Whakaaro' },
                    { id: 'rewrite', label: language === 'en' ? 'Rewrite Content' : 'Tuhia Anō' },
                    { id: 'summarize', label: language === 'en' ? 'Summarize' : 'Whakarāpopoto' },
                    { id: 'analyze', label: language === 'en' ? 'Analyze' : 'Tātari' },
                    { id: 'translate', label: language === 'en' ? 'Translate' : 'Whakamāori' },
                    { id: 'optimize', label: language === 'en' ? 'Optimize' : 'Whakapai' },
                    { id: 'template', label: language === 'en' ? 'Create Template' : 'Waihanga Tauira' },
                    { id: 'variants', label: language === 'en' ? 'Get Variants' : 'Whiwhi Taupe' }
                  ].map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setInput(`${tool.label}: ${input}`)}
                      className="p-3 bg-studio-medium hover:bg-studio-light rounded-lg transition-all hover-lift text-sm text-studio-white"
                    >
                      {tool.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="border-t border-studio-medium bg-studio-dark">
        {/* Tools Bar */}
        <AnimatePresence>
          {showTools && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-4 border-b border-studio-medium"
            >
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {tools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveToolPanel(activeToolPanel === tool.id ? null : tool.id)}
                      className={`p-3 rounded-xl transition-all hover-lift group ${
                        activeToolPanel === tool.id 
                          ? 'bg-studio-purple bg-opacity-20 border border-studio-purple border-opacity-30' 
                          : 'bg-studio-medium hover:bg-studio-light'
                      }`}
                      title={tool.description}
                    >
                      <Icon className={`w-5 h-5 mx-auto mb-1 ${tool.color} group-hover:scale-110 transition-transform`} />
                      <span className="text-xs text-studio-white block">{tool.label}</span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Input */}
        <div className="p-4">
          <div className="flex items-end space-x-3">
            {/* Tools Toggle */}
            <button
              onClick={() => setShowTools(!showTools)}
              className={`p-3 rounded-xl transition-all ${
                showTools 
                  ? 'bg-studio-purple text-white' 
                  : 'bg-studio-medium hover:bg-studio-light text-gray-400 hover:text-studio-white'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Input Field */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  language === 'en' 
                    ? 'Ask GEORGIE anything... Code, create, learn, or chat in English or Te Reo Māori'
                    : 'Pātai atu ki a GEORGIE... Waehere, waihanga, ako, kōrero rānei i te reo Pākehā, reo Māori rānei'
                }
                className="w-full px-4 py-3 bg-studio-medium border border-studio-light rounded-xl text-studio-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-studio-purple resize-none min-h-[48px] max-h-32"
                rows={1}
                style={{ 
                  height: 'auto',
                  minHeight: '48px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = Math.min(target.scrollHeight, 128) + 'px'
                }}
              />
              
              {/* Active System Prompt Indicator */}
              {activePrompt && (
                <div className="absolute -top-8 left-0 text-xs text-gray-500">
                  {language === 'en' ? 'Using:' : 'Whakamahi:'} {activePrompt.name}
                </div>
              )}
            </div>

            {/* Voice Recording */}
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`p-3 rounded-xl transition-all ${
                isRecording 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-studio-medium hover:bg-studio-light text-gray-400 hover:text-studio-white'
              }`}
              disabled={!settings.voiceEnabled}
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isGenerating}
              className="p-3 bg-gradient-accent text-white rounded-xl hover-lift disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Model Info */}
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>
              {language === 'en' ? 'Model:' : 'Taauira:'} {settings.model}
            </span>
            <span>
              {language === 'en' ? 'Tokens:' : 'Tohu:'} {settings.maxTokens}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
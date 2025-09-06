import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Plus, 
  Edit3, 
  Trash2, 
  Settings, 
  Zap,
  Brain,
  Database,
  Activity,
  Users,
  BarChart3,
  Cog
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import toast from 'react-hot-toast'

const AdminPanel: React.FC = () => {
  const { 
    systemPrompts, 
    addSystemPrompt, 
    updateSystemPrompt, 
    deleteSystemPrompt,
    setActiveSystemPrompt,
    activeSystemPrompt,
    language,
    settings,
    updateSettings
  } = useAppStore()

  const [showCreatePrompt, setShowCreatePrompt] = useState(false)
  const [newPrompt, setNewPrompt] = useState({
    name: '',
    prompt: '',
    category: 'general'
  })
  const [activeTab, setActiveTab] = useState('prompts')

  const tabs = [
    { id: 'prompts', name: language === 'en' ? 'System Prompts' : 'Tohutohu Pūnaha', icon: Brain },
    { id: 'models', name: language === 'en' ? 'Models' : 'Taauira', icon: Database },
    { id: 'tools', name: language === 'en' ? 'Tools' : 'Taputapu', icon: Zap },
    { id: 'analytics', name: language === 'en' ? 'Analytics' : 'Tātari', icon: BarChart3 },
    { id: 'settings', name: language === 'en' ? 'Settings' : 'Tautuhinga', icon: Cog },
  ]

  const createSystemPrompt = () => {
    if (!newPrompt.name.trim() || !newPrompt.prompt.trim()) {
      toast.error(language === 'en' ? 'Please fill in all fields' : 'Whakakiia nga āpure katoa')
      return
    }

    const prompt = {
      id: Date.now().toString(),
      name: newPrompt.name,
      prompt: newPrompt.prompt,
      category: newPrompt.category,
      isActive: false
    }

    addSystemPrompt(prompt)
    setNewPrompt({ name: '', prompt: '', category: 'general' })
    setShowCreatePrompt(false)
    toast.success(language === 'en' ? 'System prompt created' : 'Kua waihanga te tohutohu pūnaha')
  }

  const availableModels = [
    'gpt-4o-mini',
    'gpt-4o',
    'claude-3.5-sonnet',
    'llama-3.3-70b',
    'gemini-2.5-flash',
    'deepseek-r1',
    'qwen-3-235b'
  ]

  return (
    <div className="h-full flex flex-col bg-studio-black">
      {/* Header */}
      <div className="p-6 border-b border-studio-medium">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-studio-purple" />
          <h1 className="text-2xl font-bold gradient-text">
            {language === 'en' ? 'Admin Panel' : 'Papa Whakahaere'}
          </h1>
        </div>
        <p className="text-gray-400 mt-2">
          {language === 'en' 
            ? 'Manage system prompts, models, and advanced settings'
            : 'Whakahaere tohutohu pūnaha, taauira, me nga tautuhinga matatau'
          }
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-studio-medium">
        <div className="flex space-x-1 p-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-studio-purple text-white'
                    : 'text-gray-400 hover:text-studio-white hover:bg-studio-medium'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'prompts' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-studio-white">
                {language === 'en' ? 'System Prompts' : 'Tohutohu Pūnaha'}
              </h2>
              <button
                onClick={() => setShowCreatePrompt(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-accent text-white rounded-lg hover-lift"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'en' ? 'New Prompt' : 'Tohutohu Hou'}</span>
              </button>
            </div>

            <div className="space-y-4">
              {systemPrompts.map((prompt) => (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border transition-all ${
                    activeSystemPrompt === prompt.id
                      ? 'border-studio-purple bg-studio-purple bg-opacity-10'
                      : 'border-studio-medium bg-studio-medium hover:bg-studio-light'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-studio-white">{prompt.name}</h3>
                      <p className="text-xs text-gray-400 capitalize">{prompt.category}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setActiveSystemPrompt(prompt.id)}
                        className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                          activeSystemPrompt === prompt.id
                            ? 'bg-studio-purple text-white'
                            : 'bg-studio-light text-gray-400 hover:bg-studio-purple hover:text-white'
                        }`}
                      >
                        {activeSystemPrompt === prompt.id 
                          ? (language === 'en' ? 'Active' : 'Whakangāwari')
                          : (language === 'en' ? 'Activate' : 'Whakahohe')
                        }
                      </button>
                      <button
                        onClick={() => deleteSystemPrompt(prompt.id)}
                        className="p-1.5 bg-studio-light hover:bg-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2">{prompt.prompt}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'models' && (
          <div>
            <h2 className="text-lg font-semibold text-studio-white mb-6">
              {language === 'en' ? 'Model Configuration' : 'Whirihoranga Taauira'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === 'en' ? 'Default Model' : 'Taauira Taunoa'}
                </label>
                <select
                  value={settings.model}
                  onChange={(e) => updateSettings({ model: e.target.value })}
                  className="w-full px-3 py-2 bg-studio-medium border border-studio-light rounded-lg text-studio-white focus:outline-none focus:ring-2 focus:ring-studio-purple"
                >
                  {availableModels.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === 'en' ? 'Max Tokens' : 'Tohu Mōrahi'}
                </label>
                <input
                  type="number"
                  value={settings.maxTokens}
                  onChange={(e) => updateSettings({ maxTokens: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-studio-medium border border-studio-light rounded-lg text-studio-white focus:outline-none focus:ring-2 focus:ring-studio-purple"
                  min="100"
                  max="8192"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === 'en' ? 'Temperature' : 'Wera'}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0</span>
                  <span>{settings.temperature}</span>
                  <span>2</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div>
            <h2 className="text-lg font-semibold text-studio-white mb-6">
              {language === 'en' ? 'Tool Management' : 'Whakahaere Taputapu'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: language === 'en' ? 'Code Execution' : 'Whakahaere Waehere', enabled: settings.codeExecution },
                { name: language === 'en' ? 'Web Search' : 'Rapu Ipurangi', enabled: settings.webSearch },
                { name: language === 'en' ? 'Image Generation' : 'Waihanga Whakaahua', enabled: settings.imageGeneration },
                { name: language === 'en' ? 'Voice Features' : 'Nga Ahuatanga Reo', enabled: settings.voiceEnabled },
                { name: language === 'en' ? 'Auto Save' : 'Tiaki Aunoa', enabled: settings.autoSave },
              ].map((tool, index) => (
                <div
                  key={index}
                  className="p-4 bg-studio-medium rounded-lg border border-studio-light"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-studio-white">{tool.name}</span>
                    <button
                      onClick={() => {
                        const key = Object.keys(settings)[index + 1] as keyof typeof settings
                        updateSettings({ [key]: !tool.enabled } as any)
                      }}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        tool.enabled ? 'bg-studio-purple' : 'bg-studio-light'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          tool.enabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-lg font-semibold text-studio-white mb-6">
              {language === 'en' ? 'Usage Analytics' : 'Tātari Whakamahi'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[
                { 
                  label: language === 'en' ? 'Total Conversations' : 'Tapeke Kōrerorero', 
                  value: '127', 
                  icon: Users,
                  color: 'text-blue-400'
                },
                { 
                  label: language === 'en' ? 'Code Executions' : 'Whakahaere Waehere', 
                  value: '89', 
                  icon: Zap,
                  color: 'text-green-400'
                },
                { 
                  label: language === 'en' ? 'Images Generated' : 'Whakaahua Kua Waihanga', 
                  value: '45', 
                  icon: Activity,
                  color: 'text-purple-400'
                },
              ].map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="p-4 bg-studio-medium rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                      <div>
                        <p className="text-2xl font-bold text-studio-white">{stat.value}</p>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Create Prompt Modal */}
      <AnimatePresence>
        {showCreatePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreatePrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-studio-dark border border-studio-medium rounded-xl p-6 w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-studio-white mb-4">
                {language === 'en' ? 'Create System Prompt' : 'Waihanga Tohutohu Pūnaha'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {language === 'en' ? 'Prompt Name' : 'Ingoa Tohutohu'}
                  </label>
                  <input
                    type="text"
                    value={newPrompt.name}
                    onChange={(e) => setNewPrompt(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-studio-medium border border-studio-light rounded-lg text-studio-white focus:outline-none focus:ring-2 focus:ring-studio-purple"
                    placeholder={language === 'en' ? 'Enter prompt name...' : 'Whakaurua te ingoa tohutohu...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {language === 'en' ? 'Category' : 'Rōpū'}
                  </label>
                  <select
                    value={newPrompt.category}
                    onChange={(e) => setNewPrompt(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-studio-medium border border-studio-light rounded-lg text-studio-white focus:outline-none focus:ring-2 focus:ring-studio-purple"
                  >
                    <option value="general">{language === 'en' ? 'General' : 'Whānui'}</option>
                    <option value="code">{language === 'en' ? 'Code' : 'Waehere'}</option>
                    <option value="creative">{language === 'en' ? 'Creative' : 'Auaha'}</option>
                    <option value="academic">{language === 'en' ? 'Academic' : 'Mātauranga'}</option>
                    <option value="maori">{language === 'en' ? 'Te Reo Māori' : 'Te Reo Māori'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {language === 'en' ? 'System Prompt' : 'Tohutohu Pūnaha'}
                  </label>
                  <textarea
                    value={newPrompt.prompt}
                    onChange={(e) => setNewPrompt(prev => ({ ...prev, prompt: e.target.value }))}
                    className="w-full px-3 py-2 bg-studio-medium border border-studio-light rounded-lg text-studio-white focus:outline-none focus:ring-2 focus:ring-studio-purple resize-none"
                    rows={6}
                    placeholder={language === 'en' ? 'Enter system prompt...' : 'Whakaurua te tohutohu pūnaha...'}
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreatePrompt(false)}
                  className="flex-1 px-4 py-2 bg-studio-medium hover:bg-studio-light text-studio-white rounded-lg transition-colors"
                >
                  {language === 'en' ? 'Cancel' : 'Whakakore'}
                </button>
                <button
                  onClick={createSystemPrompt}
                  className="flex-1 px-4 py-2 bg-gradient-accent text-white rounded-lg hover-lift"
                >
                  {language === 'en' ? 'Create' : 'Waihanga'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminPanel
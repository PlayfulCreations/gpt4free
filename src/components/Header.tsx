import React from 'react'
import { motion } from 'framer-motion'
import { 
  Menu, 
  Settings, 
  User, 
  Globe,
  Mic,
  MicOff,
  Search,
  Bell
} from 'lucide-react'
import { useAppStore } from '../store/appStore'

const Header: React.FC = () => {
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    language, 
    setLanguage,
    settings,
    updateSettings
  } = useAppStore()

  const toggleVoice = () => {
    updateSettings({ voiceEnabled: !settings.voiceEnabled })
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'mi' : 'en')
  }

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 bg-studio-dark border-b border-studio-medium flex items-center justify-between px-4 lg:px-6"
    >
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-studio-medium transition-colors"
        >
          <Menu className="w-5 h-5 text-studio-white" />
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-white">G</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold gradient-text">GEORGIE</h1>
            <p className="text-xs text-gray-400">AI Assistant</p>
          </div>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations, projects..."
            className="w-full pl-10 pr-4 py-2 bg-studio-medium border border-studio-light rounded-lg text-studio-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-studio-purple"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {/* Voice Toggle */}
        <button
          onClick={toggleVoice}
          className={`p-2 rounded-lg transition-colors ${
            settings.voiceEnabled 
              ? 'bg-studio-purple text-white' 
              : 'hover:bg-studio-medium text-gray-400'
          }`}
          title={settings.voiceEnabled ? 'Disable Voice' : 'Enable Voice'}
        >
          {settings.voiceEnabled ? (
            <Mic className="w-4 h-4" />
          ) : (
            <MicOff className="w-4 h-4" />
          )}
        </button>

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="p-2 rounded-lg hover:bg-studio-medium transition-colors group"
          title={language === 'en' ? 'Switch to Te Reo Māori' : 'Switch to English'}
        >
          <Globe className="w-4 h-4 text-gray-400 group-hover:text-studio-white" />
          <span className="ml-1 text-xs text-gray-400 group-hover:text-studio-white">
            {language === 'en' ? 'EN' : 'MI'}
          </span>
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-studio-medium transition-colors relative">
          <Bell className="w-4 h-4 text-gray-400" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-studio-yellow rounded-full text-xs flex items-center justify-center text-black">
            2
          </span>
        </button>

        {/* User Menu */}
        <button className="p-2 rounded-lg hover:bg-studio-medium transition-colors">
          <User className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </motion.header>
  )
}

export default Header
import React from 'react'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon, 
  User, 
  Palette, 
  Globe, 
  Shield,
  Download,
  Upload,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import toast from 'react-hot-toast'

const Settings: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    theme, 
    setTheme, 
    settings, 
    updateSettings,
    conversations,
    projects
  } = useAppStore()

  const exportData = () => {
    const data = {
      conversations,
      projects,
      settings,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `georgie-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(language === 'en' ? 'Data exported' : 'Kua kaweake nga raraunga')
  }

  const settingSections = [
    {
      title: language === 'en' ? 'General' : 'Whānui',
      icon: SettingsIcon,
      settings: [
        {
          key: 'autoSave',
          label: language === 'en' ? 'Auto Save' : 'Tiaki Aunoa',
          description: language === 'en' ? 'Automatically save conversations and projects' : 'Tiaki aunoa nga kōrerorero me nga kaupapa',
          type: 'toggle'
        },
        {
          key: 'maxTokens',
          label: language === 'en' ? 'Max Tokens' : 'Tohu Mōrahi',
          description: language === 'en' ? 'Maximum tokens per response' : 'Nga tohu mōrahi ia whakautu',
          type: 'number',
          min: 100,
          max: 8192
        },
        {
          key: 'temperature',
          label: language === 'en' ? 'Temperature' : 'Wera',
          description: language === 'en' ? 'Controls response creativity' : 'Whakahaere auaha whakautu',
          type: 'range',
          min: 0,
          max: 2,
          step: 0.1
        }
      ]
    },
    {
      title: language === 'en' ? 'Features' : 'Ahuatanga',
      icon: Shield,
      settings: [
        {
          key: 'voiceEnabled',
          label: language === 'en' ? 'Voice Features' : 'Ahuatanga Reo',
          description: language === 'en' ? 'Enable voice recording and playback' : 'Whakahohe hopukina reo me te whakatangi',
          type: 'toggle'
        },
        {
          key: 'codeExecution',
          label: language === 'en' ? 'Code Execution' : 'Whakahaere Waehere',
          description: language === 'en' ? 'Allow running code in the browser' : 'Whakāherea te whakahaere waehere i te tirotiro',
          type: 'toggle'
        },
        {
          key: 'webSearch',
          label: language === 'en' ? 'Web Search' : 'Rapu Ipurangi',
          description: language === 'en' ? 'Enable web search functionality' : 'Whakahohe rapu ipurangi',
          type: 'toggle'
        },
        {
          key: 'imageGeneration',
          label: language === 'en' ? 'Image Generation' : 'Waihanga Whakaahua',
          description: language === 'en' ? 'Enable AI image generation' : 'Whakahohe waihanga whakaahua AI',
          type: 'toggle'
        }
      ]
    }
  ]

  const renderSetting = (setting: any) => {
    const value = settings[setting.key as keyof typeof settings]

    switch (setting.type) {
      case 'toggle':
        return (
          <button
            onClick={() => updateSettings({ [setting.key]: !value } as any)}
            className={`w-12 h-6 rounded-full transition-colors ${
              value ? 'bg-studio-purple' : 'bg-studio-light'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transition-transform ${
                value ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        )
      
      case 'number':
        return (
          <input
            type="number"
            value={value as number}
            onChange={(e) => updateSettings({ [setting.key]: parseInt(e.target.value) } as any)}
            min={setting.min}
            max={setting.max}
            className="w-24 px-3 py-1 bg-studio-medium border border-studio-light rounded-lg text-studio-white text-sm focus:outline-none focus:ring-2 focus:ring-studio-purple"
          />
        )
      
      case 'range':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min={setting.min}
              max={setting.max}
              step={setting.step}
              value={value as number}
              onChange={(e) => updateSettings({ [setting.key]: parseFloat(e.target.value) } as any)}
              className="flex-1"
            />
            <span className="text-sm text-gray-400 w-8">{value}</span>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-studio-black p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold gradient-text mb-2">
          {language === 'en' ? 'Settings' : 'Tautuhinga'}
        </h1>
        <p className="text-gray-400">
          {language === 'en' 
            ? 'Customize your GEORGIE experience'
            : 'Whakaritea tō wheako GEORGIE'
          }
        </p>
      </div>

      {/* Language & Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-studio-medium rounded-xl">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-5 h-5 text-studio-purple" />
            <h3 className="text-lg font-semibold text-studio-white">
              {language === 'en' ? 'Language' : 'Reo'}
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { id: 'en', name: 'English', flag: '🇳🇿' },
              { id: 'mi', name: 'Te Reo Māori', flag: '🏴' }
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id as 'en' | 'mi')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  language === lang.id
                    ? 'bg-studio-purple text-white'
                    : 'bg-studio-light hover:bg-studio-purple hover:bg-opacity-20 text-gray-300'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-studio-medium rounded-xl">
          <div className="flex items-center space-x-3 mb-4">
            <Palette className="w-5 h-5 text-studio-purple" />
            <h3 className="text-lg font-semibold text-studio-white">
              {language === 'en' ? 'Theme' : 'Atahua'}
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { id: 'dark', name: language === 'en' ? 'Dark Mode' : 'Aratau Ā-ā', preview: 'bg-studio-black' },
              { id: 'light', name: language === 'en' ? 'Light Mode' : 'Aratau Mārama', preview: 'bg-white' }
            ].map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id as 'dark' | 'light')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  theme === themeOption.id
                    ? 'bg-studio-purple text-white'
                    : 'bg-studio-light hover:bg-studio-purple hover:bg-opacity-20 text-gray-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${themeOption.preview} border border-gray-600`} />
                <span className="font-medium">{themeOption.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingSections.map((section) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-studio-medium rounded-xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Icon className="w-5 h-5 text-studio-purple" />
                <h3 className="text-lg font-semibold text-studio-white">{section.title}</h3>
              </div>

              <div className="space-y-4">
                {section.settings.map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-studio-white">{setting.label}</h4>
                      <p className="text-xs text-gray-400 mt-1">{setting.description}</p>
                    </div>
                    <div className="ml-4">
                      {renderSetting(setting)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Data Management */}
      <div className="mt-8 p-6 bg-studio-medium rounded-xl">
        <h3 className="text-lg font-semibold text-studio-white mb-4">
          {language === 'en' ? 'Data Management' : 'Whakahaere Raraunga'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={exportData}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-studio-light hover:bg-studio-purple rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">{language === 'en' ? 'Export Data' : 'Kaweake Raraunga'}</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-studio-light hover:bg-studio-purple rounded-lg transition-colors">
            <Upload className="w-4 h-4" />
            <span className="text-sm">{language === 'en' ? 'Import Data' : 'Kawemai Raraunga'}</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
            <span className="text-sm">{language === 'en' ? 'Clear All' : 'Ūkui Katoa'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
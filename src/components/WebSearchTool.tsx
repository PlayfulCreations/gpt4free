import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Globe, Bookmark, Download, ExternalLink } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import toast from 'react-hot-toast'

interface SearchResult {
  id: string
  title: string
  url: string
  snippet: string
  saved: boolean
}

const WebSearchTool: React.FC = () => {
  const { language } = useAppStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [savedMemos, setSavedMemos] = useState<SearchResult[]>([])

  const performSearch = async () => {
    if (!query.trim()) {
      toast.error(language === 'en' ? 'Please enter a search query' : 'Whakaurua he pātai rapu')
      return
    }

    setIsSearching(true)
    
    try {
      // Simulate web search (replace with actual search API)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'Understanding AI and Machine Learning',
          url: 'https://example.com/ai-ml',
          snippet: 'A comprehensive guide to artificial intelligence and machine learning concepts...',
          saved: false
        },
        {
          id: '2',
          title: 'Te Reo Māori Language Resources',
          url: 'https://example.com/te-reo',
          snippet: 'Learn Te Reo Māori with interactive lessons and cultural context...',
          saved: false
        },
        {
          id: '3',
          title: 'Modern Web Development Practices',
          url: 'https://example.com/web-dev',
          snippet: 'Best practices for building modern web applications with React and TypeScript...',
          saved: false
        }
      ]
      
      setResults(mockResults)
      toast.success(language === 'en' ? 'Search completed' : 'Kua oti te rapu')
    } catch (error) {
      toast.error(language === 'en' ? 'Search failed' : 'Kāore i pai te rapu')
    } finally {
      setIsSearching(false)
    }
  }

  const saveToMemos = (result: SearchResult) => {
    const updatedResult = { ...result, saved: true }
    setSavedMemos(prev => [...prev, updatedResult])
    setResults(prev => prev.map(r => r.id === result.id ? updatedResult : r))
    toast.success(language === 'en' ? 'Saved to memos' : 'Kua tiakina ki nga memo')
  }

  const removeMemo = (id: string) => {
    setSavedMemos(prev => prev.filter(memo => memo.id !== id))
    setResults(prev => prev.map(r => r.id === id ? { ...r, saved: false } : r))
    toast.success(language === 'en' ? 'Removed from memos' : 'Kua tangohia i nga memo')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch()
    }
  }

  return (
    <div className="h-full flex flex-col bg-studio-dark">
      {/* Header */}
      <div className="p-4 border-b border-studio-medium">
        <div className="flex items-center space-x-3 mb-4">
          <Search className="w-5 h-5 text-studio-purple" />
          <h3 className="text-lg font-semibold text-studio-white">
            {language === 'en' ? 'Web Search & Memos' : 'Rapu Ipurangi me nga Memo'}
          </h3>
        </div>

        {/* Search Input */}
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                language === 'en' 
                  ? 'Search the web...'
                  : 'Rapu i te ipurangi...'
              }
              className="w-full pl-10 pr-4 py-2 bg-studio-medium border border-studio-light rounded-lg text-studio-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-studio-purple"
            />
          </div>
          <button
            onClick={performSearch}
            disabled={isSearching || !query.trim()}
            className="px-4 py-2 bg-gradient-accent text-white rounded-lg hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              language === 'en' ? 'Search' : 'Rapu'
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Search Results */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">
              {language === 'en' ? 'Search Results' : 'Nga Hua Rapu'}
            </h4>
            
            {results.length > 0 ? (
              <div className="space-y-3">
                {results.map((result) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-studio-medium rounded-lg hover:bg-studio-light transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="text-sm font-medium text-studio-white group-hover:text-studio-purple transition-colors">
                        {result.title}
                      </h5>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => window.open(result.url, '_blank')}
                          className="p-1 bg-studio-light hover:bg-studio-purple rounded transition-colors"
                          title={language === 'en' ? 'Open link' : 'Whakatuwhera hono'}
                        >
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                        </button>
                        <button
                          onClick={() => saveToMemos(result)}
                          disabled={result.saved}
                          className="p-1 bg-studio-light hover:bg-studio-purple rounded transition-colors disabled:opacity-50"
                          title={language === 'en' ? 'Save to memos' : 'Tiaki ki nga memo'}
                        >
                          <Bookmark className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{result.url}</p>
                    <p className="text-sm text-gray-300">{result.snippet}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <Globe className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm text-center">
                  {language === 'en' 
                    ? 'Search results will appear here'
                    : 'Ka kitea nga hua rapu i konei'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Saved Memos */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">
              {language === 'en' ? 'Saved Memos' : 'Nga Memo Kua Tiakina'}
            </h4>
            
            {savedMemos.length > 0 ? (
              <div className="space-y-3">
                {savedMemos.map((memo) => (
                  <motion.div
                    key={memo.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-studio-medium rounded-lg border border-studio-purple border-opacity-30 group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="text-sm font-medium text-studio-white">
                        {memo.title}
                      </h5>
                      <button
                        onClick={() => removeMemo(memo.id)}
                        className="p-1 bg-studio-light hover:bg-red-500 rounded transition-colors opacity-0 group-hover:opacity-100"
                        title={language === 'en' ? 'Remove memo' : 'Tango memo'}
                      >
                        <Trash2 className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{memo.url}</p>
                    <p className="text-sm text-gray-300">{memo.snippet}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <Bookmark className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm text-center">
                  {language === 'en' 
                    ? 'Saved memos will appear here'
                    : 'Ka kitea nga memo kua tiakina i konei'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebSearchTool
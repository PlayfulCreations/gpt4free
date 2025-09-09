import React from 'react'
import Dashboard from './components/Dashboard'
import { useAppStore } from './store/appStore'

function App() {
  const { theme } = useAppStore()

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <Dashboard />
    </div>
  )
}

export default App
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ChatInterface from './components/ChatInterface'
import ProjectManager from './components/ProjectManager'
import AdminPanel from './components/AdminPanel'
import Settings from './components/Settings'
import { useAppStore } from './store/appStore'

function App() {
  const { theme } = useAppStore()

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-studio-black' : 'bg-white'}`}>
      <Layout>
        <Routes>
          <Route path="/" element={<ChatInterface />} />
          <Route path="/projects" element={<ProjectManager />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </div>
  )
}

export default App
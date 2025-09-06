import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Square, Download, Save, Copy, FileText, Terminal } from 'lucide-react'
import Editor from '@monaco-editor/react'
import { useAppStore } from '../store/appStore'
import toast from 'react-hot-toast'

const CodeEditor: React.FC = () => {
  const { language, settings } = useAppStore()
  const [code, setCode] = useState('// Welcome to GEORGIE Code Editor\nconsole.log("Hello, World!");')
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [fileName, setFileName] = useState('main.js')
  const editorRef = useRef<any>(null)

  const languages = [
    { id: 'javascript', name: 'JavaScript', ext: '.js' },
    { id: 'typescript', name: 'TypeScript', ext: '.ts' },
    { id: 'python', name: 'Python', ext: '.py' },
    { id: 'html', name: 'HTML', ext: '.html' },
    { id: 'css', name: 'CSS', ext: '.css' },
    { id: 'json', name: 'JSON', ext: '.json' },
    { id: 'markdown', name: 'Markdown', ext: '.md' },
  ]

  const runCode = async () => {
    setIsRunning(true)
    setOutput('')
    
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (selectedLanguage === 'javascript') {
        // Simple JavaScript execution simulation
        const result = eval(code)
        setOutput(result?.toString() || 'Code executed successfully')
      } else {
        setOutput(`Code executed in ${selectedLanguage}:\n\n${code.slice(0, 100)}...`)
      }
      
      toast.success(language === 'en' ? 'Code executed successfully' : 'I pai ai te whakahaere waehere')
    } catch (error) {
      setOutput(`Error: ${error}`)
      toast.error(language === 'en' ? 'Code execution failed' : 'Kāore i pai te whakahaere waehere')
    } finally {
      setIsRunning(false)
    }
  }

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
    toast.success(language === 'en' ? 'Code saved' : 'Kua tiakina te waehere')
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success(language === 'en' ? 'Code copied' : 'Kua kape te waehere')
    } catch (error) {
      toast.error(language === 'en' ? 'Failed to copy' : 'Kāore i taea te kape')
    }
  }

  return (
    <div className="h-full flex flex-col bg-studio-dark">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-studio-medium">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-studio-white">
            {language === 'en' ? 'Code Editor' : 'Kaitito Waehere'}
          </h3>
          
          <select
            value={selectedLanguage}
            onChange={(e) => {
              setSelectedLanguage(e.target.value)
              const lang = languages.find(l => l.id === e.target.value)
              if (lang) {
                setFileName(`main${lang.ext}`)
              }
            }}
            className="px-3 py-1 bg-studio-medium border border-studio-light rounded-lg text-studio-white text-sm focus:outline-none focus:ring-2 focus:ring-studio-purple"
          >
            {languages.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>

          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="px-3 py-1 bg-studio-medium border border-studio-light rounded-lg text-studio-white text-sm focus:outline-none focus:ring-2 focus:ring-studio-purple w-32"
            placeholder="filename"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="text-sm">
              {isRunning 
                ? (language === 'en' ? 'Running...' : 'Kei te oma...') 
                : (language === 'en' ? 'Run' : 'Whakahaere')
              }
            </span>
          </button>

          <button
            onClick={copyCode}
            className="p-1.5 bg-studio-medium hover:bg-studio-light rounded-lg transition-colors"
            title={language === 'en' ? 'Copy code' : 'Kape waehere'}
          >
            <Copy className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={saveCode}
            className="p-1.5 bg-studio-medium hover:bg-studio-light rounded-lg transition-colors"
            title={language === 'en' ? 'Save file' : 'Tiaki kōnae'}
          >
            <Save className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Editor and Output */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 border-r border-studio-medium">
          <Editor
            height="100%"
            language={selectedLanguage}
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={(editor) => {
              editorRef.current = editor
            }}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              folding: true,
              lineDecorationsWidth: 10,
              lineNumbersMinChars: 3,
              glyphMargin: false,
            }}
          />
        </div>

        {/* Output Panel */}
        <div className="w-1/3 flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-studio-medium bg-studio-medium bg-opacity-30">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-studio-white">
                {language === 'en' ? 'Output' : 'Putanga'}
              </span>
            </div>
          </div>
          
          <div className="flex-1 p-4 bg-studio-black font-mono text-sm text-green-400 overflow-y-auto">
            {output ? (
              <pre className="whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="text-gray-500 italic">
                {language === 'en' ? 'Run code to see output...' : 'Whakahaere waehere kia kite ai i te putanga...'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeEditor
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Download, Play, Edit3, Trash2, ThumbsUp, ThumbsDown } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { Message } from '../store/appStore'
import { useAppStore } from '../store/appStore'
import toast from 'react-hot-toast'

interface MessageBubbleProps {
  message: Message
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { language } = useAppStore()
  const [showActions, setShowActions] = useState(false)
  const isUser = message.role === 'user'

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(language === 'en' ? 'Copied to clipboard' : 'Kua kape ki te papatopenga')
    } catch (error) {
      toast.error(language === 'en' ? 'Failed to copy' : 'Kāore i taea te kape')
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'en' ? 'en-NZ' : 'mi-NZ', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Message Content */}
        <div
          className={`relative px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-gradient-accent text-white ml-auto'
              : 'bg-studio-medium text-studio-white'
          } shadow-lg`}
        >
          {/* Message Text */}
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const language = match ? match[1] : ''
                  
                  if (!inline && language) {
                    return (
                      <div className="relative group">
                        <SyntaxHighlighter
                          style={oneDark}
                          language={language}
                          PreTag="div"
                          className="rounded-lg !bg-studio-black !mt-2 !mb-2"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                        <button
                          onClick={() => copyToClipboard(String(children))}
                          className="absolute top-2 right-2 p-1 bg-studio-medium rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    )
                  }
                  
                  return (
                    <code className="bg-studio-light px-1 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  )
                },
                img({ src, alt }) {
                  return (
                    <div className="my-4">
                      <img 
                        src={src} 
                        alt={alt} 
                        className="rounded-lg max-w-full h-auto shadow-lg"
                      />
                      {alt && (
                        <p className="text-xs text-gray-400 mt-2 text-center">{alt}</p>
                      )}
                    </div>
                  )
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Message Metadata */}
          {message.metadata && (
            <div className="mt-3 pt-3 border-t border-opacity-20 border-gray-400">
              {message.metadata.filename && (
                <div className="flex items-center space-x-2 text-xs opacity-75">
                  <FileText className="w-3 h-3" />
                  <span>{message.metadata.filename}</span>
                </div>
              )}
              {message.metadata.language && (
                <div className="flex items-center space-x-2 text-xs opacity-75 mt-1">
                  <span>Language: {message.metadata.language}</span>
                </div>
              )}
            </div>
          )}

          {/* Timestamp */}
          <div className={`text-xs mt-2 ${isUser ? 'text-white text-opacity-70' : 'text-gray-400'}`}>
            {formatTime(message.timestamp)}
          </div>
        </div>

        {/* Action Buttons */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex items-center space-x-1 mt-2 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <button
                onClick={() => copyToClipboard(message.content)}
                className="p-1.5 bg-studio-medium hover:bg-studio-light rounded-lg transition-colors"
                title={language === 'en' ? 'Copy message' : 'Kape kōrero'}
              >
                <Copy className="w-3 h-3 text-gray-400" />
              </button>
              
              {!isUser && (
                <>
                  <button
                    className="p-1.5 bg-studio-medium hover:bg-studio-light rounded-lg transition-colors"
                    title={language === 'en' ? 'Good response' : 'He pai te whakautu'}
                  >
                    <ThumbsUp className="w-3 h-3 text-gray-400" />
                  </button>
                  <button
                    className="p-1.5 bg-studio-medium hover:bg-studio-light rounded-lg transition-colors"
                    title={language === 'en' ? 'Poor response' : 'Kāore he pai te whakautu'}
                  >
                    <ThumbsDown className="w-3 h-3 text-gray-400" />
                  </button>
                </>
              )}
              
              <button
                className="p-1.5 bg-studio-medium hover:bg-studio-light rounded-lg transition-colors"
                title={language === 'en' ? 'Edit message' : 'Whakatika kōrero'}
              >
                <Edit3 className="w-3 h-3 text-gray-400" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default MessageBubble
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Upload, File, Image, Music, Video, Archive, Trash2, Eye } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import toast from 'react-hot-toast'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  content?: string
}

const FileUploader: React.FC = () => {
  const { language } = useAppStore()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = async (acceptedFiles: File[]) => {
    setIsProcessing(true)
    
    try {
      const newFiles: UploadedFile[] = []
      
      for (const file of acceptedFiles) {
        const url = URL.createObjectURL(file)
        let content = ''
        
        // Read text files
        if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
          content = await file.text()
        }
        
        newFiles.push({
          id: Date.now().toString() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          url,
          content
        })
      }
      
      setUploadedFiles(prev => [...prev, ...newFiles])
      toast.success(
        language === 'en' 
          ? `${newFiles.length} file(s) uploaded successfully`
          : `${newFiles.length} kōnae i tukuake pai ai`
      )
    } catch (error) {
      toast.error(language === 'en' ? 'Upload failed' : 'Kāore i pai te tukuake')
    } finally {
      setIsProcessing(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image
    if (type.startsWith('audio/')) return Music
    if (type.startsWith('video/')) return Video
    if (type.includes('zip') || type.includes('archive')) return Archive
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id))
    toast.success(language === 'en' ? 'File removed' : 'Kua tangohia te kōnae')
  }

  const previewFile = (file: UploadedFile) => {
    if (file.type.startsWith('image/')) {
      window.open(file.url, '_blank')
    } else if (file.content) {
      // Show content in a modal or new window
      const newWindow = window.open('', '_blank')
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>${file.name}</title></head>
            <body style="font-family: monospace; padding: 20px; background: #1a1a1a; color: #f8f9fa;">
              <h1>${file.name}</h1>
              <pre style="white-space: pre-wrap;">${file.content}</pre>
            </body>
          </html>
        `)
      }
    }
  }

  return (
    <div className="h-full flex flex-col bg-studio-dark p-4">
      <div className="flex items-center space-x-3 mb-6">
        <Upload className="w-5 h-5 text-studio-purple" />
        <h3 className="text-lg font-semibold text-studio-white">
          {language === 'en' ? 'File Manager' : 'Kaitiaki Kōnae'}
        </h3>
      </div>

      {/* Upload Area */}
      <motion.div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragActive 
            ? 'border-studio-purple bg-studio-purple bg-opacity-10' 
            : 'border-studio-light hover:border-studio-purple hover:bg-studio-medium hover:bg-opacity-30'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-studio-white font-medium mb-2">
          {isDragActive 
            ? (language === 'en' ? 'Drop files here...' : 'Whakataka nga kōnae ki konei...')
            : (language === 'en' ? 'Drag & drop files or click to browse' : 'Tō mai nga kōnae, pāwhiri rānei ki te kimi')
          }
        </p>
        <p className="text-sm text-gray-400">
          {language === 'en' ? 'Supports images, audio, documents, and more (max 10MB)' : 'Ka tautoko whakaahua, oro, tuhinga, me ētahi atu (10MB rawa)'}
        </p>
      </motion.div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="flex-1 mt-6 overflow-y-auto">
          <h4 className="text-sm font-medium text-gray-300 mb-3">
            {language === 'en' ? 'Uploaded Files' : 'Nga Kōnae Kua Tukuake'}
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => {
              const Icon = getFileIcon(file.type)
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-studio-medium rounded-lg hover:bg-studio-light transition-colors group"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <Icon className="w-5 h-5 text-studio-purple flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-studio-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => previewFile(file)}
                      className="p-1.5 bg-studio-light hover:bg-studio-purple rounded-lg transition-colors"
                      title={language === 'en' ? 'Preview' : 'Arokite'}
                    >
                      <Eye className="w-3 h-3 text-gray-400" />
                    </button>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1.5 bg-studio-light hover:bg-red-500 rounded-lg transition-colors"
                      title={language === 'en' ? 'Remove' : 'Tango'}
                    >
                      <Trash2 className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="flex items-center justify-center py-4">
          <div className="w-6 h-6 border-2 border-studio-purple border-t-transparent rounded-full animate-spin mr-3" />
          <span className="text-sm text-gray-400">
            {language === 'en' ? 'Processing files...' : 'Kei te tukatuka nga kōnae...'}
          </span>
        </div>
      )}
    </div>
  )
}

export default FileUploader
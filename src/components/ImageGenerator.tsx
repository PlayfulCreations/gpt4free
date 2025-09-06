import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Download, Copy, Wand2, Image as ImageIcon, Sparkles } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import toast from 'react-hot-toast'

const ImageGenerator: React.FC = () => {
  const { language } = useAppStore()
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('realistic')
  const [size, setSize] = useState('1024x1024')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])

  const styles = [
    { id: 'realistic', name: language === 'en' ? 'Realistic' : 'Pono' },
    { id: 'artistic', name: language === 'en' ? 'Artistic' : 'Toi' },
    { id: 'cartoon', name: language === 'en' ? 'Cartoon' : 'Pikitia' },
    { id: 'abstract', name: language === 'en' ? 'Abstract' : 'Atahua' },
    { id: 'maori', name: language === 'en' ? 'Māori Art' : 'Toi Māori' },
  ]

  const sizes = [
    { id: '512x512', name: '512×512' },
    { id: '1024x1024', name: '1024×1024' },
    { id: '1024x1792', name: '1024×1792' },
    { id: '1792x1024', name: '1792×1024' },
  ]

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error(language === 'en' ? 'Please enter a prompt' : 'Whakaurua he kupu tohutohu')
      return
    }

    setIsGenerating(true)
    
    try {
      // Simulate image generation (replace with actual G4F API call)
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock generated images
      const mockImages = [
        'https://picsum.photos/1024/1024?random=1',
        'https://picsum.photos/1024/1024?random=2',
        'https://picsum.photos/1024/1024?random=3',
        'https://picsum.photos/1024/1024?random=4',
      ]
      
      setGeneratedImages(mockImages)
      toast.success(language === 'en' ? 'Images generated successfully' : 'I pai ai te waihanga whakaahua')
    } catch (error) {
      toast.error(language === 'en' ? 'Failed to generate images' : 'Kāore i taea te waihanga whakaahua')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = (imageUrl: string, index: number) => {
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = `georgie-image-${index + 1}.png`
    a.click()
    toast.success(language === 'en' ? 'Image downloaded' : 'Kua tango te whakaahua')
  }

  return (
    <div className="h-full flex flex-col bg-studio-dark">
      {/* Header */}
      <div className="p-4 border-b border-studio-medium">
        <div className="flex items-center space-x-3 mb-4">
          <Palette className="w-5 h-5 text-studio-purple" />
          <h3 className="text-lg font-semibold text-studio-white">
            {language === 'en' ? 'Image Generator' : 'Kaiwaihanga Whakaahua'}
          </h3>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {language === 'en' ? 'Style' : 'Momo'}
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-2 bg-studio-medium border border-studio-light rounded-lg text-studio-white focus:outline-none focus:ring-2 focus:ring-studio-purple"
            >
              {styles.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {language === 'en' ? 'Size' : 'Rahi'}
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-3 py-2 bg-studio-medium border border-studio-light rounded-lg text-studio-white focus:outline-none focus:ring-2 focus:ring-studio-purple"
            >
              {sizes.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={generateImage}
              disabled={isGenerating || !prompt.trim()}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-accent text-white rounded-lg hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'en' ? 'Generating...' : 'Kei te waihanga...'}</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>{language === 'en' ? 'Generate' : 'Waihanga'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Prompt Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {language === 'en' ? 'Image Description' : 'Whakaahuatanga Whakaahua'}
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              language === 'en' 
                ? 'Describe the image you want to create...'
                : 'Whakaahuatia te whakaahua koe e hiahia ana ki te waihanga...'
            }
            className="w-full px-3 py-2 bg-studio-medium border border-studio-light rounded-lg text-studio-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-studio-purple resize-none"
            rows={3}
          />
        </div>
      </div>

      {/* Generated Images */}
      <div className="flex-1 overflow-y-auto p-4">
        {generatedImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {generatedImages.map((imageUrl, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group bg-studio-medium rounded-lg overflow-hidden"
              >
                <img
                  src={imageUrl}
                  alt={`Generated image ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadImage(imageUrl, index)}
                      className="p-2 bg-studio-purple rounded-lg hover:bg-opacity-80 transition-colors"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(imageUrl)}
                      className="p-2 bg-studio-purple rounded-lg hover:bg-opacity-80 transition-colors"
                    >
                      <Copy className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-center">
              {language === 'en' 
                ? 'Generated images will appear here'
                : 'Ka kitea nga whakaahua i waihanga ai i konei'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageGenerator
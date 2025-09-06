import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, Square, Play, Download, Trash2 } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import toast from 'react-hot-toast'

const VoiceRecorder: React.FC = () => {
  const { language } = useAppStore()
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [transcription, setTranscription] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      toast.success(language === 'en' ? 'Recording started' : 'Kua tīmata te hopukina')
    } catch (error) {
      toast.error(language === 'en' ? 'Failed to start recording' : 'Kāore i taea te tīmata hopukina')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      toast.success(language === 'en' ? 'Recording stopped' : 'Kua mutu te hopukina')
    }
  }

  const transcribeAudio = async () => {
    if (!audioBlob) return

    setIsTranscribing(true)
    try {
      // Simulate transcription (replace with actual speech-to-text API)
      await new Promise(resolve => setTimeout(resolve, 2000))
      setTranscription(
        language === 'en' 
          ? 'This is a sample transcription of your audio recording.'
          : 'He tauira tēnei o te whakamāori o tō hopukina oro.'
      )
      toast.success(language === 'en' ? 'Audio transcribed' : 'Kua whakamāori te oro')
    } catch (error) {
      toast.error(language === 'en' ? 'Transcription failed' : 'Kāore i pai te whakamāori')
    } finally {
      setIsTranscribing(false)
    }
  }

  const downloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement('a')
      a.href = audioUrl
      a.download = `georgie-recording-${Date.now()}.wav`
      a.click()
      toast.success(language === 'en' ? 'Audio downloaded' : 'Kua tango te oro')
    }
  }

  const clearRecording = () => {
    setAudioBlob(null)
    setAudioUrl(null)
    setTranscription('')
    toast.success(language === 'en' ? 'Recording cleared' : 'Kua ūkui te hopukina')
  }

  return (
    <div className="h-full flex flex-col bg-studio-dark p-4">
      <div className="flex items-center space-x-3 mb-6">
        <Mic className="w-5 h-5 text-studio-purple" />
        <h3 className="text-lg font-semibold text-studio-white">
          {language === 'en' ? 'Voice Recorder' : 'Kaihopu Reo'}
        </h3>
      </div>

      {/* Recording Controls */}
      <div className="flex flex-col items-center space-y-6 mb-6">
        <motion.button
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-gradient-accent hover:scale-105'
          } shadow-2xl`}
          whileTap={{ scale: 0.95 }}
        >
          {isRecording ? (
            <Square className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </motion.button>

        <p className="text-sm text-gray-400 text-center">
          {isRecording 
            ? (language === 'en' ? 'Recording... Click to stop' : 'Kei te hopu... Pāwhiri kia mutu')
            : (language === 'en' ? 'Click to start recording' : 'Pāwhiri kia tīmata te hopukina')
          }
        </p>
      </div>

      {/* Audio Playback */}
      {audioUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-studio-medium rounded-xl p-4 mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-studio-white">
              {language === 'en' ? 'Recorded Audio' : 'Oro Kua Hopukina'}
            </h4>
            <div className="flex space-x-2">
              <button
                onClick={downloadAudio}
                className="p-1.5 bg-studio-light hover:bg-studio-purple rounded-lg transition-colors"
                title={language === 'en' ? 'Download audio' : 'Tango oro'}
              >
                <Download className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={clearRecording}
                className="p-1.5 bg-studio-light hover:bg-red-500 rounded-lg transition-colors"
                title={language === 'en' ? 'Delete recording' : 'Muku hopukina'}
              >
                <Trash2 className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          
          <audio
            ref={audioRef}
            src={audioUrl}
            controls
            className="w-full"
          />

          <button
            onClick={transcribeAudio}
            disabled={isTranscribing}
            className="w-full mt-3 flex items-center justify-center space-x-2 px-4 py-2 bg-studio-purple hover:bg-opacity-80 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isTranscribing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{language === 'en' ? 'Transcribing...' : 'Kei te whakamāori...'}</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>{language === 'en' ? 'Transcribe' : 'Whakamāori'}</span>
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Transcription */}
      {transcription && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-studio-medium rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-studio-white">
              {language === 'en' ? 'Transcription' : 'Whakamāoritanga'}
            </h4>
            <button
              onClick={() => navigator.clipboard.writeText(transcription)}
              className="p-1.5 bg-studio-light hover:bg-studio-purple rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <p className="text-studio-white text-sm leading-relaxed">{transcription}</p>
        </motion.div>
      )}
    </div>
  )
}

export default VoiceRecorder
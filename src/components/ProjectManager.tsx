import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  FolderOpen, 
  Code, 
  FileText, 
  Music, 
  GraduationCap,
  Palette,
  Globe,
  Download,
  Archive,
  Edit3,
  Trash2,
  Calendar,
  Clock
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import toast from 'react-hot-toast'

const ProjectManager: React.FC = () => {
  const { 
    projects, 
    addProject, 
    updateProject, 
    deleteProject, 
    setCurrentProject,
    currentProjectId,
    language 
  } = useAppStore()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    type: 'general' as const,
    tags: [] as string[]
  })

  const projectTypes = [
    { id: 'code', name: language === 'en' ? 'Code Project' : 'Kaupapa Waehere', icon: Code, color: 'text-green-400' },
    { id: 'tutorial', name: language === 'en' ? 'Tutorial' : 'Akoranga', icon: GraduationCap, color: 'text-blue-400' },
    { id: 'course', name: language === 'en' ? 'Course Material' : 'Rauemi Akoranga', icon: FileText, color: 'text-purple-400' },
    { id: 'lyrics', name: language === 'en' ? 'Song Lyrics' : 'Kupu Waiata', icon: Music, color: 'text-pink-400' },
    { id: 'academic', name: language === 'en' ? 'Academic' : 'Mātauranga', icon: GraduationCap, color: 'text-indigo-400' },
    { id: 'fashion', name: language === 'en' ? 'Fashion' : 'Kākahu', icon: Palette, color: 'text-yellow-400' },
    { id: 'general', name: language === 'en' ? 'General' : 'Whānui', icon: FolderOpen, color: 'text-gray-400' },
  ]

  const createProject = () => {
    if (!newProject.name.trim()) {
      toast.error(language === 'en' ? 'Please enter a project name' : 'Whakaurua he ingoa kaupapa')
      return
    }

    const project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      type: newProject.type,
      files: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: newProject.tags
    }

    addProject(project)
    setNewProject({ name: '', description: '', type: 'general', tags: [] })
    setShowCreateModal(false)
    toast.success(language === 'en' ? 'Project created' : 'Kua waihanga te kaupapa')
  }

  const exportProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    if (!project) return

    // Create a simple export (in real implementation, create ZIP)
    const exportData = JSON.stringify(project, null, 2)
    const blob = new Blob([exportData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(language === 'en' ? 'Project exported' : 'Kua kaweake te kaupapa')
  }

  const getProjectIcon = (type: string) => {
    const projectType = projectTypes.find(pt => pt.id === type)
    return projectType?.icon || FolderOpen
  }

  const getProjectColor = (type: string) => {
    const projectType = projectTypes.find(pt => pt.id === type)
    return projectType?.color || 'text-gray-400'
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'en' ? 'en-NZ' : 'mi-NZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  return (
    <div className="h-full flex flex-col bg-studio-black p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold gradient-text">
            {language === 'en' ? 'Project Manager' : 'Kaitiaki Kaupapa'}
          </h1>
          <p className="text-gray-400 mt-1">
            {language === 'en' 
              ? 'Organize and manage your creative projects'
              : 'Whakarite me te whakahaere i ō kaupapa auaha'
            }
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-accent text-white rounded-lg hover-lift"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'en' ? 'New Project' : 'Kaupapa Hou'}</span>
        </button>
      </div>

      {/* Project Grid */}
      <div className="flex-1 overflow-y-auto">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const Icon = getProjectIcon(project.type)
              const color = getProjectColor(project.type)
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 bg-studio-medium rounded-xl hover:bg-studio-light transition-all hover-lift group cursor-pointer ${
                    currentProjectId === project.id ? 'ring-2 ring-studio-purple' : ''
                  }`}
                  onClick={() => setCurrentProject(project.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 bg-studio-dark rounded-lg ${color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-studio-white group-hover:text-studio-purple transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-xs text-gray-400 capitalize">
                          {projectTypes.find(pt => pt.id === project.type)?.name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          exportProject(project.id)
                        }}
                        className="p-1.5 bg-studio-dark hover:bg-studio-purple rounded-lg transition-colors"
                        title={language === 'en' ? 'Export project' : 'Kaweake kaupapa'}
                      >
                        <Download className="w-3 h-3 text-gray-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteProject(project.id)
                        }}
                        className="p-1.5 bg-studio-dark hover:bg-red-500 rounded-lg transition-colors"
                        title={language === 'en' ? 'Delete project' : 'Muku kaupapa'}
                      >
                        <Trash2 className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                    {project.description || (language === 'en' ? 'No description' : 'Kāore he whakaahuatanga')}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>{project.files.length} {language === 'en' ? 'files' : 'kōnae'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(project.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {project.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-studio-purple bg-opacity-20 text-studio-purple text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-1 bg-studio-dark text-gray-400 text-xs rounded-full">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FolderOpen className="w-16 h-16 mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">
              {language === 'en' ? 'No Projects Yet' : 'Kāore Anō He Kaupapa'}
            </h3>
            <p className="text-center mb-6">
              {language === 'en' 
                ? 'Create your first project to get started'
                : 'Waihangahia tō kaupapa tuatahi kia tīmata ai'
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-accent text-white rounded-lg hover-lift"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'en' ? 'Create Project' : 'Waihanga Kaupapa'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-studio-dark border border-studio-medium rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-studio-white mb-4">
                {language === 'en' ? 'Create New Project' : 'Waihanga Kaupapa Hou'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {language === 'en' ? 'Project Name' : 'Ingoa Kaupapa'}
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-studio-medium border border-studio-light rounded-lg text-studio-white focus:outline-none focus:ring-2 focus:ring-studio-purple"
                    placeholder={language === 'en' ? 'Enter project name...' : 'Whakaurua te ingoa kaupapa...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {language === 'en' ? 'Description' : 'Whakaahuatanga'}
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-studio-medium border border-studio-light rounded-lg text-studio-white focus:outline-none focus:ring-2 focus:ring-studio-purple resize-none"
                    rows={3}
                    placeholder={language === 'en' ? 'Describe your project...' : 'Whakaahuatia tō kaupapa...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {language === 'en' ? 'Project Type' : 'Momo Kaupapa'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {projectTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <button
                          key={type.id}
                          onClick={() => setNewProject(prev => ({ ...prev, type: type.id as any }))}
                          className={`p-3 rounded-lg border transition-all ${
                            newProject.type === type.id
                              ? 'border-studio-purple bg-studio-purple bg-opacity-20'
                              : 'border-studio-light hover:border-studio-purple hover:bg-studio-medium'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mx-auto mb-1 ${type.color}`} />
                          <span className="text-xs text-studio-white block">{type.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-studio-medium hover:bg-studio-light text-studio-white rounded-lg transition-colors"
                >
                  {language === 'en' ? 'Cancel' : 'Whakakore'}
                </button>
                <button
                  onClick={createProject}
                  className="flex-1 px-4 py-2 bg-gradient-accent text-white rounded-lg hover-lift"
                >
                  {language === 'en' ? 'Create' : 'Waihanga'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProjectManager
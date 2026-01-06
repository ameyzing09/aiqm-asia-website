import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ref, get, update, remove } from 'firebase/database'
import { ref as storageRef, deleteObject } from 'firebase/storage'
import { db, storage } from '../../../../services/firebase'
import { ValidatedInput } from '../components/ValidatedInput'
import { ValidatedTextarea } from '../components/ValidatedTextarea'
import { FormCard } from '../components/FormCard'
import { SaveBar } from '../components/SaveBar'
import { MediaUploader } from '../components/MediaUploader'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast, getErrorMessage } from '../hooks/useToast'

// Character limits
const CHAR_LIMITS = {
  name: 60,
  title: 80,
  education: 200,
  credentials: 300,
  experience: 300,
  expertise: 200,
  recognition: 300,
  message: 800,
  impactText: 100,
}

// Default director structure
const DEFAULT_DIRECTOR = {
  name: '',
  title: '',
  education: '',
  credentials: '',
  experience: '',
  recognition: '',
  photoUrl: '',
}

export function LeadershipEditor() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()
  const [activeTab, setActiveTab] = useState('director')
  const [formData, setFormData] = useState({
    director: DEFAULT_DIRECTOR,
    directorsMessage: '',
    directorImpact: {},
    faculty: {},
  })
  const [initialData, setInitialData] = useState(formData)
  const [expandedFaculty, setExpandedFaculty] = useState({})

  // Fetch leadership data
  const { data: leadershipData, isLoading: leadershipLoading } = useQuery({
    queryKey: ['siteContent', 'leadership'],
    queryFn: async () => {
      const snapshot = await get(ref(db, 'siteContent/leadership'))
      return snapshot.exists() ? snapshot.val() : {}
    },
    staleTime: 5 * 60 * 1000,
  })

  // Fetch faculty data
  const { data: facultyData, isLoading: facultyLoading } = useQuery({
    queryKey: ['siteContent', 'faculty'],
    queryFn: async () => {
      const snapshot = await get(ref(db, 'siteContent/faculty'))
      return snapshot.exists() ? snapshot.val() : {}
    },
    staleTime: 5 * 60 * 1000,
  })

  const isLoading = leadershipLoading || facultyLoading

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (newData) => {
      // Save leadership data (director + message + impact)
      await update(ref(db, 'siteContent/leadership'), {
        director: newData.director,
        directorsMessage: newData.directorsMessage,
        directorImpact: newData.directorImpact,
      })
      // Save faculty data
      await update(ref(db, 'siteContent/faculty'), newData.faculty)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent', 'leadership'] })
      queryClient.invalidateQueries({ queryKey: ['siteContent', 'faculty'] })
      queryClient.invalidateQueries({ queryKey: ['leadership'] })
    },
  })

  // Delete faculty mutation
  const deleteFacultyMutation = useMutation({
    mutationFn: async (facultyId) => {
      await remove(ref(db, `siteContent/faculty/${facultyId}`))
      // Try to delete photo from storage
      try {
        const photoRef = storageRef(storage, `faculty/${facultyId}`)
        await deleteObject(photoRef)
      } catch {
        // Photo may not exist, ignore error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent', 'faculty'] })
      queryClient.invalidateQueries({ queryKey: ['leadership'] })
    },
  })

  // Initialize form data
  useEffect(() => {
    if (leadershipData || facultyData) {
      const merged = {
        director: { ...DEFAULT_DIRECTOR, ...leadershipData?.director },
        directorsMessage: leadershipData?.directorsMessage || '',
        directorImpact: leadershipData?.directorImpact || {},
        faculty: facultyData || {},
      }
      setFormData(merged)
      setInitialData(merged)
    }
  }, [leadershipData, facultyData])

  // Check for changes
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialData)
  }, [formData, initialData])

  // Validation
  const hasErrors = useMemo(() => {
    const d = formData.director || {}
    if (String(d.name || '').length > CHAR_LIMITS.name) return true
    if (String(d.title || '').length > CHAR_LIMITS.title) return true
    if (String(d.education || '').length > CHAR_LIMITS.education) return true
    if (String(d.credentials || '').length > CHAR_LIMITS.credentials) return true
    if (String(d.experience || '').length > CHAR_LIMITS.experience) return true
    if (String(d.recognition || '').length > CHAR_LIMITS.recognition) return true
    if (String(formData.directorsMessage || '').length > CHAR_LIMITS.message) return true

    for (const faculty of Object.values(formData.faculty || {})) {
      if (String(faculty.name || '').length > CHAR_LIMITS.name) return true
      if (String(faculty.title || '').length > CHAR_LIMITS.title) return true
      if (String(faculty.experience || '').length > CHAR_LIMITS.experience) return true
      if (String(faculty.expertise || '').length > CHAR_LIMITS.expertise) return true
    }
    return false
  }, [formData])

  // Update director field
  const updateDirectorField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      director: {
        ...prev.director,
        [field]: value,
      },
    }))
  }

  // Update impact statement
  const updateImpactField = (impactId, field, value) => {
    setFormData(prev => ({
      ...prev,
      directorImpact: {
        ...prev.directorImpact,
        [impactId]: {
          ...prev.directorImpact?.[impactId],
          [field]: value,
        },
      },
    }))
  }

  // Add impact statement
  const addImpact = () => {
    const newId = `i${Object.keys(formData.directorImpact || {}).length + 1}`
    const maxOrder = Math.max(0, ...Object.values(formData.directorImpact || {}).map(i => i.order || 0))
    setFormData(prev => ({
      ...prev,
      directorImpact: {
        ...prev.directorImpact,
        [newId]: { text: '', order: maxOrder + 1 },
      },
    }))
  }

  // Delete impact statement
  const deleteImpact = (impactId) => {
    setFormData(prev => {
      const newImpact = { ...prev.directorImpact }
      delete newImpact[impactId]
      return { ...prev, directorImpact: newImpact }
    })
  }

  // Faculty array for display
  const facultyArray = useMemo(() => {
    if (!formData.faculty || typeof formData.faculty !== 'object') return []
    return Object.entries(formData.faculty)
      .map(([id, member]) => ({ id, ...member }))
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [formData.faculty])

  // Toggle faculty expansion
  const toggleFaculty = (id) => {
    setExpandedFaculty(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Update faculty field
  const updateFacultyField = (facultyId, field, value) => {
    setFormData(prev => ({
      ...prev,
      faculty: {
        ...prev.faculty,
        [facultyId]: {
          ...prev.faculty[facultyId],
          [field]: value,
        },
      },
    }))
  }

  // Add faculty member
  const addFaculty = () => {
    const newId = `faculty_${Date.now()}`
    const maxOrder = facultyArray.length > 0
      ? Math.max(...facultyArray.map(f => f.order || 0)) + 1
      : 1
    setFormData(prev => ({
      ...prev,
      faculty: {
        ...prev.faculty,
        [newId]: {
          name: 'New Faculty Member',
          title: '',
          experience: '',
          expertise: '',
          photoUrl: '',
          order: maxOrder,
        },
      },
    }))
    setExpandedFaculty(prev => ({ ...prev, [newId]: true }))
  }

  // Delete faculty member
  const handleDeleteFaculty = async (facultyId) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return

    if (initialData.faculty?.[facultyId]) {
      await deleteFacultyMutation.mutateAsync(facultyId)
    }

    setFormData(prev => {
      const newFaculty = { ...prev.faculty }
      delete newFaculty[facultyId]
      return { ...prev, faculty: newFaculty }
    })
    setInitialData(prev => {
      const newFaculty = { ...prev.faculty }
      delete newFaculty[facultyId]
      return { ...prev, faculty: newFaculty }
    })
  }

  // Save handler
  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync(formData)
      setInitialData(formData)
      success('Leadership data saved successfully!')
    } catch (err) {
      error(getErrorMessage(err))
      console.error('Failed to save leadership data:', err)
    }
  }

  // Discard handler
  const handleDiscard = () => {
    setFormData(initialData)
  }

  // Tab change with warning
  const handleTabChange = (tab) => {
    if (isDirty && !window.confirm('You have unsaved changes. Switch tabs anyway?')) return
    setActiveTab(tab)
  }

  // Impact array for display
  const impactArray = useMemo(() => {
    if (!formData.directorImpact) return []
    return Object.entries(formData.directorImpact)
      .map(([id, item]) => ({ id, ...item }))
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [formData.directorImpact])

  const tabs = [
    { id: 'director', label: 'Director', icon: '👤' },
    { id: 'faculty', label: 'Faculty', icon: '👥' },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Leadership</h1>
          <p className="text-gray-400 mt-1">Manage director profile and faculty members</p>
        </div>
        <div className="flex gap-2 mb-6">
          {[1, 2].map(i => (
            <div key={i} className="h-10 w-28 bg-white/10 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
          <div className="space-y-4">
            <div className="h-6 w-40 bg-white/10 rounded" />
            <div className="h-24 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Leadership</h1>
        <p className="text-gray-400 mt-1">
          Manage director profile, message, and faculty members. Changes sync to the live site.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {activeTab === tab.id && isDirty && (
              <span className="ml-1 w-2 h-2 bg-amber-400 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Director Tab */}
      {activeTab === 'director' && (
        <div className="space-y-6">
          {/* Director Profile */}
          <FormCard
            title="Director Profile"
            description="Personal details and credentials"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Director Photo</label>
                <MediaUploader
                  value={formData.director?.photoUrl}
                  onUpload={(url) => updateDirectorField('photoUrl', url)}
                  storagePath="leadership/director"
                  compact
                />
                <p className="text-xs text-gray-500 mt-2">Square photo recommended (1:1)</p>
              </div>

              {/* Details */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ValidatedInput
                    label="Full Name"
                    value={formData.director?.name || ''}
                    onChange={(value) => updateDirectorField('name', value)}
                    maxLength={CHAR_LIMITS.name}
                    placeholder="Mr. G.K.K. Singh"
                    required
                  />
                  <ValidatedInput
                    label="Title / Designation"
                    value={formData.director?.title || ''}
                    onChange={(value) => updateDirectorField('title', value)}
                    maxLength={CHAR_LIMITS.title}
                    placeholder="Founder & Director, AIQM India"
                  />
                </div>

                <ValidatedTextarea
                  label="Education"
                  value={formData.director?.education || ''}
                  onChange={(value) => updateDirectorField('education', value)}
                  maxLength={CHAR_LIMITS.education}
                  placeholder="B.Tech (Hons.), IIT Mumbai | MBA, IIM Kolkata"
                  rows={2}
                />

                <ValidatedTextarea
                  label="Professional Credentials"
                  value={formData.director?.credentials || ''}
                  onChange={(value) => updateDirectorField('credentials', value)}
                  maxLength={CHAR_LIMITS.credentials}
                  placeholder="Lean Six Sigma Master Black Belt | ISO Lead Auditor"
                  rows={2}
                />

                <ValidatedTextarea
                  label="Experience Summary"
                  value={formData.director?.experience || ''}
                  onChange={(value) => updateDirectorField('experience', value)}
                  maxLength={CHAR_LIMITS.experience}
                  placeholder="30+ years across Johnson & Johnson, Baker Gauges..."
                  rows={2}
                />

                <ValidatedTextarea
                  label="Awards & Recognition"
                  value={formData.director?.recognition || ''}
                  onChange={(value) => updateDirectorField('recognition', value)}
                  maxLength={CHAR_LIMITS.recognition}
                  placeholder="Outstanding People of the 20th Century Award..."
                  rows={2}
                />
              </div>
            </div>
          </FormCard>

          {/* Director's Message */}
          <FormCard
            title="Director's Message"
            description="Personal message displayed on the About page"
          >
            <ValidatedTextarea
              label="Message"
              value={formData.directorsMessage || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, directorsMessage: value }))}
              maxLength={CHAR_LIMITS.message}
              placeholder="At AIQM, our mission is to empower professionals and organizations..."
              rows={6}
            />
          </FormCard>

          {/* Impact Statements */}
          <FormCard
            title="Impact Statements"
            description="Key achievements displayed alongside the director's profile"
          >
            <div className="space-y-4">
              {impactArray.map((impact) => (
                <div key={impact.id} className="flex items-start gap-4">
                  <div className="flex-1">
                    <ValidatedInput
                      label={`Statement ${impact.order || ''}`}
                      value={impact.text || ''}
                      onChange={(value) => updateImpactField(impact.id, 'text', value)}
                      maxLength={CHAR_LIMITS.impactText}
                      placeholder="Mentored 4,300+ Lean Six Sigma projects"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-7">
                    <input
                      type="number"
                      value={impact.order || 0}
                      onChange={(e) => updateImpactField(impact.id, 'order', parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                      min={1}
                      title="Order"
                    />
                    <button
                      onClick={() => deleteImpact(impact.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={addImpact}
                className="flex items-center gap-2 px-4 py-2 text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Impact Statement
              </button>
            </div>
          </FormCard>
        </div>
      )}

      {/* Faculty Tab */}
      {activeTab === 'faculty' && (
        <div className="space-y-6">
          {/* Add Button */}
          <div className="flex justify-end">
            <button
              onClick={addFaculty}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Faculty Member
            </button>
          </div>

          {/* Faculty Accordion */}
          <div className="space-y-4">
            {facultyArray.map((member) => (
              <div
                key={member.id}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
              >
                {/* Header */}
                <button
                  onClick={() => toggleFaculty(member.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary-600/20 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-white">{member.name || 'Untitled'}</h3>
                      <p className="text-sm text-gray-400">{member.title || 'No title'}</p>
                    </div>
                  </div>
                  <motion.svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: expandedFaculty[member.id] ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>

                {/* Content */}
                <AnimatePresence>
                  {expandedFaculty[member.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-white/10 pt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Photo */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Photo</label>
                            <MediaUploader
                              value={member.photoUrl}
                              onUpload={(url) => updateFacultyField(member.id, 'photoUrl', url)}
                              storagePath={`faculty/${member.id}`}
                              compact
                            />
                          </div>

                          {/* Details */}
                          <div className="lg:col-span-2 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <ValidatedInput
                                label="Full Name"
                                value={member.name || ''}
                                onChange={(value) => updateFacultyField(member.id, 'name', value)}
                                maxLength={CHAR_LIMITS.name}
                                placeholder="Dr. Jane Smith"
                                required
                              />
                              <ValidatedInput
                                label="Title / Designation"
                                value={member.title || ''}
                                onChange={(value) => updateFacultyField(member.id, 'title', value)}
                                maxLength={CHAR_LIMITS.title}
                                placeholder="Six Sigma Master Black Belt"
                              />
                            </div>

                            <ValidatedTextarea
                              label="Experience"
                              value={member.experience || ''}
                              onChange={(value) => updateFacultyField(member.id, 'experience', value)}
                              maxLength={CHAR_LIMITS.experience}
                              placeholder="30+ years • 2,500+ projects mentored"
                              rows={2}
                            />

                            <ValidatedTextarea
                              label="Expertise Areas"
                              value={member.expertise || ''}
                              onChange={(value) => updateFacultyField(member.id, 'expertise', value)}
                              maxLength={CHAR_LIMITS.expertise}
                              placeholder="Lean Six Sigma, TQM, Integrated Management Systems"
                              rows={2}
                            />

                            <div className="flex items-center gap-3">
                              <label className="text-sm text-gray-400">Display Order:</label>
                              <input
                                type="number"
                                value={member.order || 0}
                                onChange={(e) => updateFacultyField(member.id, 'order', parseInt(e.target.value) || 0)}
                                className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                                min={1}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Delete */}
                        <div className="mt-6 pt-6 border-t border-white/10 flex justify-end">
                          <button
                            onClick={() => handleDeleteFaculty(member.id)}
                            disabled={deleteFacultyMutation.isPending}
                            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            {deleteFacultyMutation.isPending ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {facultyArray.length === 0 && (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-primary-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">No Faculty Members</h2>
              <p className="text-gray-400 mb-6">Add your first faculty member to get started.</p>
              <button
                onClick={addFaculty}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Faculty Member
              </button>
            </div>
          )}
        </div>
      )}

      {/* Save Bar */}
      <SaveBar
        isDirty={isDirty}
        hasErrors={hasErrors}
        onSave={handleSave}
        onDiscard={handleDiscard}
        isSaving={saveMutation.isPending}
      />
    </div>
  )
}

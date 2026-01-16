import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ref, get, update, remove, serverTimestamp } from 'firebase/database'
import { ref as storageRef, deleteObject } from 'firebase/storage'
import { db, storage } from '../../../../services/firebase'
import { useAuth } from '../../../../hooks/useAuth'
import { ValidatedInput } from '../components/ValidatedInput'
import { ValidatedTextarea } from '../components/ValidatedTextarea'
import { FormCard } from '../components/FormCard'
import { SaveBar } from '../components/SaveBar'
import { MasterDetailLayout } from '../components/MasterDetailLayout'
import { useStorage } from '../hooks/useStorage'
import { useToast, getErrorMessage } from '../hooks/useToast'
import { getMetadataTimestamp } from '../hooks/useAuditedSave'
import { motion } from 'framer-motion'

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

/**
 * ProfileAssetCard - Professional headshot uploader for leadership
 */
function ProfileAssetCard({ value, onUpload, storagePath, label = 'Photo' }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const fileInputRef = useRef(null)
  const { upload, progress, error, uploading, reset } = useStorage()

  const handleFile = useCallback(async (file) => {
    reset()
    if (!file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) return

    try {
      const timestamp = Date.now()
      const extension = file.name.split('.').pop()
      const path = `${storagePath}/${timestamp}.${extension}`
      const url = await upload(file, path)
      onUpload(url)
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }, [storagePath, upload, onUpload, reset])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleClick = () => fileInputRef.current?.click()
  const handleRemove = (e) => {
    e.stopPropagation()
    onUpload(null)
    reset()
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={!value && !uploading ? handleClick : undefined}
        className={`
          relative overflow-hidden rounded-xl transition-all duration-200
          ${!value && !uploading ? 'cursor-pointer' : ''}
          ${isDragging ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-gray-900' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />

        {/* Has Image */}
        {value && !uploading && (
          <div className="relative aspect-square w-full max-w-[140px]">
            <img src={value} alt="Profile" className="w-full h-full object-cover rounded-xl" />
            <div className={`
              absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent
              rounded-xl flex flex-col justify-end p-3 transition-opacity duration-200
              ${isHovered ? 'opacity-100' : 'opacity-0 lg:opacity-0'} active:opacity-100
            `}>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleClick() }}
                  className="flex-1 px-2 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-2 py-1.5 bg-red-500/30 hover:bg-red-500/50 backdrop-blur-sm text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Uploading */}
        {uploading && (
          <div className="aspect-square w-full max-w-[140px] bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full mb-2"
            />
            <span className="text-xs text-gray-400">{progress}%</span>
          </div>
        )}

        {/* Empty State */}
        {!value && !uploading && (
          <div className={`
            aspect-square w-full max-w-[140px] border-2 border-dashed rounded-xl
            flex flex-col items-center justify-center p-4 transition-all duration-200
            ${isDragging ? 'border-primary-500 bg-primary-500/10' : 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-primary-400'}
          `}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 ${isDragging ? 'bg-primary-500/20' : 'bg-gradient-to-br from-gray-700 to-gray-800'}`}>
              <svg className={`w-7 h-7 ${isDragging ? 'text-primary-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-xs text-gray-400 text-center">{isDragging ? 'Drop here' : 'Add photo'}</p>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export function LeadershipEditor() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { success, error } = useToast()
  const [activeTab, setActiveTab] = useState('director')
  const [selectedFacultyId, setSelectedFacultyId] = useState(null)
  const [formData, setFormData] = useState({
    director: DEFAULT_DIRECTOR,
    directorsMessage: '',
    directorImpact: {},
    faculty: {},
  })
  const [initialData, setInitialData] = useState(formData)
  const [initialTimestamp, setInitialTimestamp] = useState(null)

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

  // Save mutation with audit metadata
  const saveMutation = useMutation({
    mutationFn: async (newData) => {
      const metadata = {
        updatedBy: user?.email || 'unknown',
        updatedAt: serverTimestamp(),
        updatedByUid: user?.uid || null
      }
      await update(ref(db, 'siteContent/leadership'), {
        director: newData.director,
        directorsMessage: newData.directorsMessage,
        directorImpact: newData.directorImpact,
        _metadata: metadata,
      })
      await update(ref(db, 'siteContent/faculty'), {
        ...newData.faculty,
        _metadata: metadata,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent', 'leadership'] })
      queryClient.invalidateQueries({ queryKey: ['siteContent', 'faculty'] })
      queryClient.invalidateQueries({ queryKey: ['leadership'] })
      success('Leadership data saved successfully!')
    },
    onError: (err) => {
      error(getErrorMessage(err))
    }
  })

  // Delete faculty mutation
  const deleteFacultyMutation = useMutation({
    mutationFn: async (facultyId) => {
      await remove(ref(db, `siteContent/faculty/${facultyId}`))
      try {
        const photoRef = storageRef(storage, `faculty/${facultyId}`)
        await deleteObject(photoRef)
      } catch { /* Photo may not exist */ }
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
      setInitialTimestamp(getMetadataTimestamp(leadershipData))
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
      director: { ...prev.director, [field]: value },
    }))
  }

  // Update impact statement
  const updateImpactField = (impactId, field, value) => {
    setFormData(prev => ({
      ...prev,
      directorImpact: {
        ...prev.directorImpact,
        [impactId]: { ...prev.directorImpact?.[impactId], [field]: value },
      },
    }))
  }

  // Add impact statement
  const addImpact = () => {
    const newId = `i${Object.keys(formData.directorImpact || {}).length + 1}`
    const maxOrder = Math.max(0, ...Object.values(formData.directorImpact || {}).map(i => i.order || 0))
    setFormData(prev => ({
      ...prev,
      directorImpact: { ...prev.directorImpact, [newId]: { text: '', order: maxOrder + 1 } },
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

  // Selected faculty member
  const selectedFaculty = useMemo(() => {
    if (!selectedFacultyId || !formData.faculty[selectedFacultyId]) return null
    return { id: selectedFacultyId, ...formData.faculty[selectedFacultyId] }
  }, [selectedFacultyId, formData.faculty])

  // Update faculty field
  const updateFacultyField = (facultyId, field, value) => {
    setFormData(prev => ({
      ...prev,
      faculty: {
        ...prev.faculty,
        [facultyId]: { ...prev.faculty[facultyId], [field]: value },
      },
    }))
  }

  // Add faculty member
  const addFaculty = () => {
    const newId = `faculty_${Date.now()}`
    const maxOrder = facultyArray.length > 0 ? Math.max(...facultyArray.map(f => f.order || 0)) + 1 : 1
    setFormData(prev => ({
      ...prev,
      faculty: {
        ...prev.faculty,
        [newId]: { name: 'New Faculty Member', title: '', experience: '', expertise: '', photoUrl: '', order: maxOrder },
      },
    }))
    setSelectedFacultyId(newId)
  }

  // Delete faculty member
  const handleDeleteFaculty = async (facultyId) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return

    if (initialData.faculty?.[facultyId]) {
      await deleteFacultyMutation.mutateAsync(facultyId)
    }

    if (selectedFacultyId === facultyId) setSelectedFacultyId(null)

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
    } catch (err) {
      console.error('Failed to save leadership data:', err)
    }
  }

  // Discard handler
  const handleDiscard = () => setFormData(initialData)

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
          {[1, 2].map(i => <div key={i} className="h-10 w-28 bg-white/10 rounded-lg animate-pulse" />)}
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
        <p className="text-gray-400 mt-1">Manage director profile, message, and faculty members.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Director Tab */}
      {activeTab === 'director' && (
        <div className="space-y-6">
          {/* Director Profile */}
          <FormCard title="Director Profile" description="Personal details and credentials">
            <div className="grid grid-cols-12 gap-6">
              {/* Photo - Mobile first, Desktop col-span-3 */}
              <div className="col-span-12 lg:col-span-3 order-first">
                <ProfileAssetCard
                  value={formData.director?.photoUrl}
                  onUpload={(url) => updateDirectorField('photoUrl', url)}
                  storagePath="leadership/director"
                  label="Profile Photo"
                />
              </div>

              {/* Name & Title - col-span-9 on desktop */}
              <div className="col-span-12 lg:col-span-9 space-y-4">
                <div className="grid grid-cols-12 gap-4">
                  <ValidatedInput
                    wrapperClassName="col-span-12 lg:col-span-6"
                    label="Full Name"
                    value={formData.director?.name || ''}
                    onChange={(value) => updateDirectorField('name', value)}
                    maxLength={CHAR_LIMITS.name}
                    placeholder="Mr. G.K.K. Singh"
                    required
                  />
                  <ValidatedInput
                    wrapperClassName="col-span-12 lg:col-span-6"
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
              </div>

              {/* Credentials - Full width */}
              <ValidatedTextarea
                wrapperClassName="col-span-12"
                label="Professional Credentials"
                value={formData.director?.credentials || ''}
                onChange={(value) => updateDirectorField('credentials', value)}
                maxLength={CHAR_LIMITS.credentials}
                placeholder="Lean Six Sigma Master Black Belt | ISO Lead Auditor"
                rows={2}
              />

              <ValidatedTextarea
                wrapperClassName="col-span-12 lg:col-span-6"
                label="Experience Summary"
                value={formData.director?.experience || ''}
                onChange={(value) => updateDirectorField('experience', value)}
                maxLength={CHAR_LIMITS.experience}
                placeholder="30+ years across Johnson & Johnson, Baker Gauges..."
                rows={2}
              />

              <ValidatedTextarea
                wrapperClassName="col-span-12 lg:col-span-6"
                label="Awards & Recognition"
                value={formData.director?.recognition || ''}
                onChange={(value) => updateDirectorField('recognition', value)}
                maxLength={CHAR_LIMITS.recognition}
                placeholder="Outstanding People of the 20th Century Award..."
                rows={2}
              />
            </div>
          </FormCard>

          {/* Director's Message */}
          <FormCard title="Director's Message" description="Personal message displayed on the About page">
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
          <FormCard title="Impact Statements" description="Key achievements displayed alongside the director's profile">
            <div className="space-y-4">
              {impactArray.map((impact) => (
                <div key={impact.id} className="grid grid-cols-12 gap-4 items-end">
                  <ValidatedInput
                    wrapperClassName="col-span-12 lg:col-span-9"
                    label={`Statement ${impact.order || ''}`}
                    value={impact.text || ''}
                    onChange={(value) => updateImpactField(impact.id, 'text', value)}
                    maxLength={CHAR_LIMITS.impactText}
                    placeholder="Mentored 4,300+ Lean Six Sigma projects"
                  />
                  <div className="col-span-6 lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                    <input
                      type="number"
                      value={impact.order || 0}
                      onChange={(e) => updateImpactField(impact.id, 'order', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500"
                      min={1}
                    />
                  </div>
                  <div className="col-span-6 lg:col-span-1 flex justify-end">
                    <button
                      onClick={() => deleteImpact(impact.id)}
                      className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
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

      {/* Faculty Tab - Master-Detail Layout */}
      {activeTab === 'faculty' && (
        <MasterDetailLayout
          items={facultyArray}
          selectedId={selectedFacultyId}
          onSelect={setSelectedFacultyId}
          renderListItemMeta={(member) => (
            <p className="text-xs text-gray-500">{member.title || 'No title'}</p>
          )}
          emptyMessage="No faculty members yet"
          addButton={{ label: 'Add Member', onClick: addFaculty }}
          detailTitle={selectedFaculty?.name}
        >
          {selectedFaculty && (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </h4>

                <div className="grid grid-cols-12 gap-6">
                  {/* Photo */}
                  <div className="col-span-12 lg:col-span-4 order-first">
                    <ProfileAssetCard
                      value={selectedFaculty.photoUrl}
                      onUpload={(url) => updateFacultyField(selectedFaculty.id, 'photoUrl', url)}
                      storagePath={`faculty/${selectedFaculty.id}`}
                      label="Profile Photo"
                    />
                  </div>

                  {/* Name & Title */}
                  <div className="col-span-12 lg:col-span-8 space-y-4">
                    <ValidatedInput
                      label="Full Name"
                      value={selectedFaculty.name || ''}
                      onChange={(value) => updateFacultyField(selectedFaculty.id, 'name', value)}
                      maxLength={CHAR_LIMITS.name}
                      placeholder="Dr. Jane Smith"
                      required
                    />
                    <ValidatedInput
                      label="Title / Designation"
                      value={selectedFaculty.title || ''}
                      onChange={(value) => updateFacultyField(selectedFaculty.id, 'title', value)}
                      maxLength={CHAR_LIMITS.title}
                      placeholder="Six Sigma Master Black Belt"
                    />
                  </div>
                </div>
              </div>

              {/* Experience & Expertise */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Background
                </h4>

                <div className="grid grid-cols-12 gap-4">
                  <ValidatedTextarea
                    wrapperClassName="col-span-12"
                    label="Experience"
                    value={selectedFaculty.experience || ''}
                    onChange={(value) => updateFacultyField(selectedFaculty.id, 'experience', value)}
                    maxLength={CHAR_LIMITS.experience}
                    placeholder="30+ years • 2,500+ projects mentored"
                    rows={2}
                  />

                  <ValidatedTextarea
                    wrapperClassName="col-span-12"
                    label="Expertise Areas"
                    value={selectedFaculty.expertise || ''}
                    onChange={(value) => updateFacultyField(selectedFaculty.id, 'expertise', value)}
                    maxLength={CHAR_LIMITS.expertise}
                    placeholder="Lean Six Sigma, TQM, Integrated Management Systems"
                    rows={2}
                  />

                  {/* Order */}
                  <div className="col-span-12 lg:col-span-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
                    <input
                      type="number"
                      value={selectedFaculty.order || 0}
                      onChange={(e) => updateFacultyField(selectedFaculty.id, 'order', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                      min={1}
                    />
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Danger Zone</p>
                    <p className="text-xs text-gray-500 mt-0.5">Remove this faculty member</p>
                  </div>
                  <button
                    onClick={() => handleDeleteFaculty(selectedFaculty.id)}
                    disabled={deleteFacultyMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/30 rounded-lg transition-all disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="text-sm font-medium">
                      {deleteFacultyMutation.isPending ? 'Deleting...' : 'Delete Member'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </MasterDetailLayout>
      )}

      {/* Save Bar */}
      <SaveBar
        isDirty={isDirty}
        hasErrors={hasErrors}
        onSave={handleSave}
        onDiscard={handleDiscard}
        isSaving={saveMutation.isPending}
        lastEditedBy={leadershipData?._metadata?.updatedBy}
        lastEditedAt={leadershipData?._metadata?.updatedAt}
      />
    </div>
  )
}

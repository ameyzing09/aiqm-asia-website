import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ref, get, update, remove } from 'firebase/database'
import { db } from '../../../../services/firebase'
import { ValidatedInput } from '../components/ValidatedInput'
import { ValidatedTextarea } from '../components/ValidatedTextarea'
import { SaveBar } from '../components/SaveBar'
import { MasterDetailLayout } from '../components/MasterDetailLayout'
import { useStorage } from '../hooks/useStorage'
import { useToast, getErrorMessage } from '../hooks/useToast'
import { motion } from 'framer-motion'

// Character limits for courses
const CHAR_LIMITS = {
  title: 50,
  level: 20,
  duration: 15,
  description: 200,
  idealFor: 100,
  outcome: 150,
}

/**
 * ImageAssetCard - Professional course image uploader
 *
 * Features:
 * - Large 120x120px preview with aspect-square
 * - High-contrast placeholder when empty
 * - Overlay actions on hover/tap
 * - Responsive: Full-width card on mobile
 */
function ImageAssetCard({ value, onUpload, storagePath, label = 'Course Image' }) {
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

        {/* Has Image - Show Preview with Overlay Actions */}
        {value && !uploading && (
          <div className="relative aspect-square w-full max-w-[160px]">
            <img
              src={value}
              alt="Course"
              className="w-full h-full object-cover rounded-xl"
            />
            {/* Overlay Actions - Always visible on mobile, hover on desktop */}
            <div className={`
              absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent
              rounded-xl flex flex-col justify-end p-3
              transition-opacity duration-200
              ${isHovered ? 'opacity-100' : 'opacity-0 lg:opacity-0'}
              active:opacity-100
            `}>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleClick() }}
                  className="flex-1 px-3 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3 py-2 bg-red-500/30 hover:bg-red-500/50 backdrop-blur-sm text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Touch indicator for mobile */}
            <div className="absolute top-2 right-2 lg:hidden">
              <div className="w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Uploading State */}
        {uploading && (
          <div className="aspect-square w-full max-w-[160px] bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full mb-3"
            />
            <span className="text-xs text-gray-400">{progress}%</span>
          </div>
        )}

        {/* Empty State - High Contrast Placeholder */}
        {!value && !uploading && (
          <div className={`
            aspect-square w-full max-w-[160px] border-2 border-dashed rounded-xl
            flex flex-col items-center justify-center p-4
            transition-all duration-200
            ${isDragging
              ? 'border-primary-500 bg-primary-500/10'
              : 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-primary-400'
            }
          `}>
            {/* Large Photo Placeholder Icon */}
            <div className={`
              w-16 h-16 rounded-2xl flex items-center justify-center mb-3
              ${isDragging ? 'bg-primary-500/20' : 'bg-gradient-to-br from-gray-700 to-gray-800'}
            `}>
              <svg className={`w-8 h-8 ${isDragging ? 'text-primary-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs text-gray-400 text-center font-medium">
              {isDragging ? 'Drop here' : 'Click or drag'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-1">
              JPG, PNG up to 5MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * DocumentAssetCard - Professional certificate/document uploader
 *
 * Features:
 * - Document card styling with thumbnail preview
 * - Dashed border dropzone for empty state
 * - Aspect ratio preservation (4:3 for certificates)
 * - Overlay actions inside preview
 */
function DocumentAssetCard({ value, onUpload, storagePath, label = 'Sample Certificate' }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const fileInputRef = useRef(null)
  const { upload, progress, error, uploading, reset } = useStorage()

  const handleFile = useCallback(async (file) => {
    reset()
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') return
    if (file.size > 10 * 1024 * 1024) return

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

  const isPdf = value?.toLowerCase().endsWith('.pdf')

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">{label}</label>
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View full
          </a>
        )}
      </div>

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
          accept="image/*,.pdf"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />

        {/* Has Document - Show Preview Card */}
        {value && !uploading && (
          <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-white/10 rounded-xl overflow-hidden">
            {/* Document Preview */}
            <div className="aspect-[4/3] relative">
              {isPdf ? (
                // PDF Placeholder
                <div className="w-full h-full bg-gradient-to-br from-red-900/20 to-red-800/10 flex flex-col items-center justify-center">
                  <div className="w-16 h-20 bg-white/10 rounded-lg flex flex-col items-center justify-center mb-3 border border-white/20">
                    <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8.5 13a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 4.5c1.93 0 3.5-1.57 3.5-3.5S10.43 10.5 8.5 10.5 5 12.07 5 14s1.57 3.5 3.5 3.5zm6.5-3h-2v-1h2v1zm0 2h-2v-1h2v1zm2-2h-1v-1h1v1zm0 2h-1v-1h1v1z"/>
                    </svg>
                    <span className="text-[10px] text-red-400 font-bold mt-1">PDF</span>
                  </div>
                  <p className="text-xs text-gray-400">Certificate Document</p>
                </div>
              ) : (
                // Image Preview
                <img
                  src={value}
                  alt="Certificate"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Overlay Actions */}
              <div className={`
                absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent
                flex flex-col justify-end p-4
                transition-opacity duration-200
                ${isHovered ? 'opacity-100' : 'opacity-0 lg:opacity-0'}
                active:opacity-100
              `}>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleClick() }}
                    className="flex-1 px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="px-4 py-2.5 bg-red-500/30 hover:bg-red-500/50 backdrop-blur-sm text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Touch indicator for mobile */}
              <div className="absolute top-3 right-3 lg:hidden">
                <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Uploading State */}
        {uploading && (
          <div className="aspect-[4/3] bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center">
            <div className="w-full max-w-[200px] mb-4 px-6">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-primary-500 rounded-full"
                />
              </div>
            </div>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-sm text-primary-400 font-medium"
            >
              Uploading... {progress}%
            </motion.span>
          </div>
        )}

        {/* Empty State - Dashed Border Dropzone */}
        {!value && !uploading && (
          <div className={`
            aspect-[4/3] border-2 border-dashed rounded-xl
            flex flex-col items-center justify-center p-6
            transition-all duration-200
            ${isDragging
              ? 'border-primary-500 bg-primary-500/10'
              : 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-primary-400'
            }
          `}>
            {/* Document Icon */}
            <div className={`
              w-20 h-24 rounded-xl flex flex-col items-center justify-center mb-4 relative
              ${isDragging ? 'bg-primary-500/20' : 'bg-gradient-to-br from-gray-700 to-gray-800 border border-white/10'}
            `}>
              {/* Folded corner effect */}
              <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-700 rounded-bl-lg" />
              <svg className={`w-10 h-10 ${isDragging ? 'text-primary-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <p className="text-sm text-gray-300 text-center font-medium mb-1">
              {isDragging ? 'Drop certificate here' : 'Upload Sample Certificate'}
            </p>
            <p className="text-xs text-gray-500 text-center">
              PDF or JPG up to 10MB
            </p>

            {/* Upload hint on desktop */}
            <div className="mt-4 px-4 py-2 bg-white/5 rounded-lg hidden sm:flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-xs text-gray-500">Drag & drop or click to browse</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

export function CoursesEditor() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()
  const [formData, setFormData] = useState({})
  const [initialData, setInitialData] = useState({})
  const [selectedCourseId, setSelectedCourseId] = useState(null)

  // Fetch courses data
  const { data, isLoading } = useQuery({
    queryKey: ['siteContent', 'courses'],
    queryFn: async () => {
      const snapshot = await get(ref(db, 'siteContent/courses'))
      return snapshot.exists() ? snapshot.val() : {}
    },
    staleTime: 5 * 60 * 1000,
  })

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (newData) => {
      await update(ref(db, 'siteContent/courses'), newData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent', 'courses'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (courseId) => {
      await remove(ref(db, `siteContent/courses/${courseId}`))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent', 'courses'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })

  // Initialize form data when Firebase data loads
  // This pattern is necessary for editable forms - local state must diverge from server state during editing
  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Syncing query data to local form state for editing
      setFormData(data)
      setInitialData(data)
    }
  }, [data])

  // Check if form has changes
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialData)
  }, [formData, initialData])

  // Check for validation errors
  const hasErrors = useMemo(() => {
    for (const course of Object.values(formData)) {
      if (String(course.title || '').length > CHAR_LIMITS.title) return true
      if (String(course.level || '').length > CHAR_LIMITS.level) return true
      if (String(course.duration || '').length > CHAR_LIMITS.duration) return true
      if (String(course.description || '').length > CHAR_LIMITS.description) return true
      if (String(course.idealFor || '').length > CHAR_LIMITS.idealFor) return true
      if (String(course.outcome || '').length > CHAR_LIMITS.outcome) return true
    }
    return false
  }, [formData])

  // Convert courses object to sorted array for display
  const coursesArray = useMemo(() => {
    if (!formData || typeof formData !== 'object') return []
    return Object.entries(formData)
      .map(([id, course]) => ({ id, ...course }))
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [formData])

  // Get selected course
  const selectedCourse = useMemo(() => {
    if (!selectedCourseId || !formData[selectedCourseId]) return null
    return { id: selectedCourseId, ...formData[selectedCourseId] }
  }, [selectedCourseId, formData])

  // Update a specific course field
  const updateCourseField = (courseId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [field]: value,
      },
    }))
  }

  // Add a new course
  const addCourse = () => {
    const newId = `course_${Date.now()}`
    const newOrder = coursesArray.length > 0
      ? Math.max(...coursesArray.map(c => c.order || 0)) + 1
      : 1

    setFormData(prev => ({
      ...prev,
      [newId]: {
        title: 'New Course',
        level: 'Beginner',
        duration: '2-3 Days',
        description: '',
        idealFor: '',
        outcome: '',
        image: '',
        order: newOrder,
        active: true,
      },
    }))
    setSelectedCourseId(newId)
  }

  // Delete a course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return
    }

    if (initialData[courseId]) {
      await deleteMutation.mutateAsync(courseId)
    }

    if (selectedCourseId === courseId) {
      setSelectedCourseId(null)
    }

    setFormData(prev => {
      const newData = { ...prev }
      delete newData[courseId]
      return newData
    })
    setInitialData(prev => {
      const newData = { ...prev }
      delete newData[courseId]
      return newData
    })
  }

  // Handle save
  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync(formData)
      setInitialData(formData)
      success('Courses saved successfully!')
    } catch (err) {
      error(getErrorMessage(err))
      console.error('Failed to save courses:', err)
    }
  }

  // Handle discard
  const handleDiscard = () => {
    setFormData(initialData)
  }

  // Render list item meta
  const renderListItemMeta = (course) => (
    <p className="text-xs text-gray-500">{course.level} • {course.duration}</p>
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Courses</h1>
          <p className="text-gray-400 mt-1">Manage certification programs and course details</p>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-white/10 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-8 hidden lg:block">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
              <div className="space-y-4">
                <div className="h-8 w-48 bg-white/10 rounded" />
                <div className="h-32 bg-white/10 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Courses</h1>
        <p className="text-gray-400 mt-1">
          Manage certification programs and course details. Changes sync to the live site.
        </p>
      </div>

      {/* Master-Detail Layout */}
      <MasterDetailLayout
        items={coursesArray}
        selectedId={selectedCourseId}
        onSelect={setSelectedCourseId}
        renderListItemMeta={renderListItemMeta}
        emptyMessage="No courses yet"
        addButton={{ label: 'Add Course', onClick: addCourse }}
        detailTitle={selectedCourse?.title}
      >
        {selectedCourse && (
          <div className="space-y-8">
            {/* ═══════════════════════════════════════════════════════════════
                SECTION 1: Profile Header - Image + Basic Info
                Mobile: Image full-width on top, then title below
                Desktop: Image col-span-4, Title col-span-8 side-by-side
            ═══════════════════════════════════════════════════════════════ */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Course Identity
              </h4>

              <div className="grid grid-cols-12 gap-6">
                {/* Course Image - Mobile: First & Full Width, Desktop: col-span-4 */}
                <div className="col-span-12 lg:col-span-4 order-first">
                  <ImageAssetCard
                    value={selectedCourse.image}
                    onUpload={(url) => updateCourseField(selectedCourse.id, 'image', url)}
                    storagePath={`courses/${selectedCourse.id}`}
                    label="Course Image"
                  />
                </div>

                {/* Title & Meta Fields - Mobile: Below image, Desktop: col-span-8 */}
                <div className="col-span-12 lg:col-span-8 space-y-4">
                  <ValidatedInput
                    label="Course Title"
                    value={selectedCourse.title || ''}
                    onChange={(value) => updateCourseField(selectedCourse.id, 'title', value)}
                    maxLength={CHAR_LIMITS.title}
                    placeholder="Lean Six Sigma Green Belt"
                    required
                  />

                  {/* Level, Duration, Order, Status - 2x2 grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <ValidatedInput
                      label="Level"
                      value={selectedCourse.level || ''}
                      onChange={(value) => updateCourseField(selectedCourse.id, 'level', value)}
                      maxLength={CHAR_LIMITS.level}
                      placeholder="Intermediate"
                    />
                    <ValidatedInput
                      label="Duration"
                      value={selectedCourse.duration || ''}
                      onChange={(value) => updateCourseField(selectedCourse.id, 'duration', value)}
                      maxLength={CHAR_LIMITS.duration}
                      placeholder="3-4 Days"
                    />
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">Order</label>
                      <input
                        type="number"
                        value={selectedCourse.order || 0}
                        onChange={(e) => updateCourseField(selectedCourse.id, 'order', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                        min={0}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">Status</label>
                      <label className="flex items-center gap-3 h-[46px] px-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedCourse.active !== false}
                          onChange={(e) => updateCourseField(selectedCourse.id, 'active', e.target.checked)}
                          className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
                        />
                        <span className="text-sm text-gray-300">Active</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 2: Course Details - Text Content
            ═══════════════════════════════════════════════════════════════ */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Course Details
              </h4>

              <div className="grid grid-cols-12 gap-4">
                <ValidatedTextarea
                  wrapperClassName="col-span-12"
                  label="Description"
                  value={selectedCourse.description || ''}
                  onChange={(value) => updateCourseField(selectedCourse.id, 'description', value)}
                  maxLength={CHAR_LIMITS.description}
                  placeholder="Learn essential tools and techniques for process improvement..."
                  rows={3}
                />

                <ValidatedTextarea
                  wrapperClassName="col-span-12 lg:col-span-6"
                  label="Ideal For"
                  value={selectedCourse.idealFor || ''}
                  onChange={(value) => updateCourseField(selectedCourse.id, 'idealFor', value)}
                  maxLength={CHAR_LIMITS.idealFor}
                  placeholder="Project managers, team leaders..."
                  rows={2}
                />

                <ValidatedTextarea
                  wrapperClassName="col-span-12 lg:col-span-6"
                  label="Learning Outcome"
                  value={selectedCourse.outcome || ''}
                  onChange={(value) => updateCourseField(selectedCourse.id, 'outcome', value)}
                  maxLength={CHAR_LIMITS.outcome}
                  placeholder="Upon completion, participants will..."
                  rows={2}
                />
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 3: Sample Certificate - Document Card
            ═══════════════════════════════════════════════════════════════ */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Certification
              </h4>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-8">
                  <DocumentAssetCard
                    value={selectedCourse.sampleCertificateUrl || ''}
                    onUpload={(url) => updateCourseField(selectedCourse.id, 'sampleCertificateUrl', url)}
                    storagePath={`courses/${selectedCourse.id}/certificate`}
                    label="Sample Certificate"
                  />
                </div>

                {/* Certificate Info Panel */}
                <div className="col-span-12 lg:col-span-4">
                  <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border border-amber-500/20 rounded-xl p-4 h-full">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-amber-300 mb-1">Certificate Preview</h5>
                        <p className="text-xs text-amber-200/60 leading-relaxed">
                          This certificate will be shown to users when they click "View Certificate" on the course card.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                DANGER ZONE: Delete Course
            ═══════════════════════════════════════════════════════════════ */}
            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Danger Zone</p>
                  <p className="text-xs text-gray-500 mt-0.5">Permanently delete this course</p>
                </div>
                <button
                  onClick={() => handleDeleteCourse(selectedCourse.id)}
                  disabled={deleteMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/30 rounded-lg transition-all disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="text-sm font-medium">
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete Course'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </MasterDetailLayout>

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

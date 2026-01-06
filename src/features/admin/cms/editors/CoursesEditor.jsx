import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ref, get, update, remove } from 'firebase/database'
import { db } from '../../../../services/firebase'
import { ValidatedInput } from '../components/ValidatedInput'
import { ValidatedTextarea } from '../components/ValidatedTextarea'
import { FormCard } from '../components/FormCard'
import { SaveBar } from '../components/SaveBar'
import { MediaUploader } from '../components/MediaUploader'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast, getErrorMessage } from '../hooks/useToast'

// Character limits for courses
const CHAR_LIMITS = {
  title: 50,
  level: 20,
  duration: 15,
  description: 200,
  idealFor: 100,
  outcome: 150,
}

export function CoursesEditor() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()
  const [formData, setFormData] = useState({})
  const [initialData, setInitialData] = useState({})
  const [expandedCourses, setExpandedCourses] = useState({})

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
  useEffect(() => {
    if (data) {
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

  // Toggle course expansion
  const toggleCourse = (courseId) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }))
  }

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
    setExpandedCourses(prev => ({ ...prev, [newId]: true }))
  }

  // Delete a course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return
    }

    // If it's already in Firebase, delete it there
    if (initialData[courseId]) {
      await deleteMutation.mutateAsync(courseId)
    }

    // Remove from local state
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Courses</h1>
          <p className="text-gray-400 mt-1">Manage certification programs and course details</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-6 w-48 bg-white/10 rounded" />
                <div className="h-8 w-8 bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Courses</h1>
          <p className="text-gray-400 mt-1">
            Manage certification programs and course details. Changes sync to the live site.
          </p>
        </div>
        <button
          onClick={addCourse}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Course
        </button>
      </div>

      {/* Courses Accordion */}
      <div className="space-y-4">
        {coursesArray.map((course) => (
          <div
            key={course.id}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* Accordion Header */}
            <button
              onClick={() => toggleCourse(course.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white">{course.title || 'Untitled Course'}</h3>
                  <p className="text-sm text-gray-400">{course.level} • {course.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {course.active === false && (
                  <span className="px-2 py-1 text-xs bg-gray-600/50 text-gray-300 rounded">Inactive</span>
                )}
                <motion.svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: expandedCourses[course.id] ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </div>
            </button>

            {/* Accordion Content */}
            <AnimatePresence>
              {expandedCourses[course.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 border-t border-white/10 pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        {/* Course Image */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Course Image</label>
                          <MediaUploader
                            value={course.image}
                            onUpload={(url) => updateCourseField(course.id, 'image', url)}
                            storagePath={`courses/${course.id}`}
                          />
                        </div>

                        {/* Title */}
                        <ValidatedInput
                          label="Course Title"
                          value={course.title || ''}
                          onChange={(value) => updateCourseField(course.id, 'title', value)}
                          maxLength={CHAR_LIMITS.title}
                          placeholder="Lean Six Sigma Green Belt"
                          required
                        />

                        {/* Level & Duration */}
                        <div className="grid grid-cols-2 gap-4">
                          <ValidatedInput
                            label="Level"
                            value={course.level || ''}
                            onChange={(value) => updateCourseField(course.id, 'level', value)}
                            maxLength={CHAR_LIMITS.level}
                            placeholder="Intermediate"
                          />
                          <ValidatedInput
                            label="Duration"
                            value={course.duration || ''}
                            onChange={(value) => updateCourseField(course.id, 'duration', value)}
                            maxLength={CHAR_LIMITS.duration}
                            placeholder="3-4 Days"
                          />
                        </div>

                        {/* Order & Active */}
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-3">
                            <label className="text-sm text-gray-400">Order:</label>
                            <input
                              type="number"
                              value={course.order || 0}
                              onChange={(e) => updateCourseField(course.id, 'order', parseInt(e.target.value) || 0)}
                              className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                              min={0}
                            />
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={course.active !== false}
                              onChange={(e) => updateCourseField(course.id, 'active', e.target.checked)}
                              className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
                            />
                            <span className="text-sm text-gray-300">Active</span>
                          </label>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        {/* Description */}
                        <ValidatedTextarea
                          label="Description"
                          value={course.description || ''}
                          onChange={(value) => updateCourseField(course.id, 'description', value)}
                          maxLength={CHAR_LIMITS.description}
                          placeholder="Learn essential tools and techniques for process improvement..."
                          rows={3}
                        />

                        {/* Ideal For */}
                        <ValidatedTextarea
                          label="Ideal For"
                          value={course.idealFor || ''}
                          onChange={(value) => updateCourseField(course.id, 'idealFor', value)}
                          maxLength={CHAR_LIMITS.idealFor}
                          placeholder="Project managers, team leaders, quality professionals..."
                          rows={2}
                        />

                        {/* Outcome */}
                        <ValidatedTextarea
                          label="Learning Outcome"
                          value={course.outcome || ''}
                          onChange={(value) => updateCourseField(course.id, 'outcome', value)}
                          maxLength={CHAR_LIMITS.outcome}
                          placeholder="Upon completion, participants will be able to..."
                          rows={2}
                        />
                      </div>
                    </div>

                    {/* Delete Button */}
                    <div className="mt-6 pt-6 border-t border-white/10 flex justify-end">
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        disabled={deleteMutation.isPending}
                        className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete Course'}
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
      {coursesArray.length === 0 && !isLoading && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No Courses Found</h2>
          <p className="text-gray-400 mb-6">Get started by adding your first course.</p>
          <button
            onClick={addCourse}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Course
          </button>
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

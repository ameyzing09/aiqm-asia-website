import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ref, get, remove } from 'firebase/database'
import { db } from '../../../../services/firebase'
import { ValidatedInput } from '../components/ValidatedInput'
import { ValidatedTextarea } from '../components/ValidatedTextarea'
import { FormCard } from '../components/FormCard'
import { SaveBar } from '../components/SaveBar'
import { ProfileAssetCard } from '../components/ProfileAssetCard'
import { useToast, getErrorMessage } from '../hooks/useToast'
import { useAuditedSave, getMetadataTimestamp } from '../hooks/useAuditedSave'

// Character limits for testimonials
const CHAR_LIMITS = {
  quote: 250,
  author: 50,
  role: 60,
  company: 40,
}

export function TestimonialsEditor() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()
  const [formData, setFormData] = useState({})
  const [initialData, setInitialData] = useState({})
  const [initialTimestamp, setInitialTimestamp] = useState(null)

  // Audited save hook
  const { save, forceSave, isSaving, isConflict } = useAuditedSave('testimonials', {
    onSuccess: () => success('Testimonials saved successfully!'),
    onError: (err) => {
      if (err.code !== 'CONFLICT') {
        error(getErrorMessage(err))
      }
    },
    invalidateKeys: ['testimonials']
  })

  // Fetch testimonials data
  const { data, isLoading } = useQuery({
    queryKey: ['siteContent', 'testimonials'],
    queryFn: async () => {
      const snapshot = await get(ref(db, 'siteContent/testimonials'))
      return snapshot.exists() ? snapshot.val() : {}
    },
    staleTime: 5 * 60 * 1000,
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (testimonialId) => {
      await remove(ref(db, `siteContent/testimonials/${testimonialId}`))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent', 'testimonials'] })
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    },
  })

  // Initialize form data when Firebase data loads
  useEffect(() => {
    if (data) {
      setFormData(data)
      setInitialData(data)
      setInitialTimestamp(getMetadataTimestamp(data))
    }
  }, [data])

  // Check if form has changes
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialData)
  }, [formData, initialData])

  // Check for validation errors
  const hasErrors = useMemo(() => {
    for (const testimonial of Object.values(formData)) {
      if (String(testimonial.quote || '').length > CHAR_LIMITS.quote) return true
      if (String(testimonial.author || '').length > CHAR_LIMITS.author) return true
      if (String(testimonial.role || '').length > CHAR_LIMITS.role) return true
      if (String(testimonial.company || '').length > CHAR_LIMITS.company) return true
    }
    return false
  }, [formData])

  // Convert testimonials object to sorted array for display
  const testimonialsArray = useMemo(() => {
    if (!formData || typeof formData !== 'object') return []
    return Object.entries(formData)
      .map(([id, testimonial]) => ({ id, ...testimonial }))
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [formData])

  // Update a specific testimonial field
  const updateField = (testimonialId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [testimonialId]: {
        ...prev[testimonialId],
        [field]: value,
      },
    }))
  }

  // Add a new testimonial
  const addTestimonial = () => {
    const newId = `testimonial_${Date.now()}`
    const newOrder = testimonialsArray.length > 0
      ? Math.max(...testimonialsArray.map(t => t.order || 0)) + 1
      : 1

    setFormData(prev => ({
      ...prev,
      [newId]: {
        quote: '',
        author: '',
        role: '',
        company: '',
        image: '',
        rating: 5,
        order: newOrder,
        active: true,
      },
    }))
  }

  // Delete a testimonial
  const handleDelete = async (testimonialId) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return
    }

    // If it's already in Firebase, delete it there
    if (initialData[testimonialId]) {
      await deleteMutation.mutateAsync(testimonialId)
    }

    // Remove from local state
    setFormData(prev => {
      const newData = { ...prev }
      delete newData[testimonialId]
      return newData
    })
    setInitialData(prev => {
      const newData = { ...prev }
      delete newData[testimonialId]
      return newData
    })
  }

  // Handle save with optimistic locking
  const handleSave = async () => {
    try {
      await save(formData, initialTimestamp)
      setInitialData(formData)
    } catch (err) {
      if (err.code !== 'CONFLICT') {
        console.error('Failed to save testimonials:', err)
      }
    }
  }

  // Handle force save (overwrite conflicts)
  const handleForceSave = async () => {
    try {
      await forceSave(formData)
      setInitialData(formData)
    } catch (err) {
      console.error('Failed to force save:', err)
    }
  }

  // Handle discard
  const handleDiscard = () => {
    setFormData(initialData)
  }

  // Star rating component
  const StarRating = ({ value, onChange }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <svg
            className={`w-6 h-6 ${star <= value ? 'text-yellow-400' : 'text-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Testimonials</h1>
          <p className="text-gray-400 mt-1">Manage client reviews and success stories</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-white/10 rounded-full" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                  <div className="h-3 w-1/2 bg-white/10 rounded" />
                </div>
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
          <h1 className="text-2xl font-bold text-white">Testimonials</h1>
          <p className="text-gray-400 mt-1">
            Manage client reviews and success stories. Changes sync to the live site.
          </p>
        </div>
        <button
          onClick={addTestimonial}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Testimonial
        </button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {testimonialsArray.map((testimonial) => (
          <FormCard
            key={testimonial.id}
            className="relative"
          >
            {/* Active/Inactive Badge */}
            {testimonial.active === false && (
              <span className="absolute top-4 right-4 px-2 py-1 text-xs bg-gray-600/50 text-gray-300 rounded">
                Inactive
              </span>
            )}

            <div className="space-y-5">
              {/* 12-Column Grid Layout */}
              <div className="grid grid-cols-12 gap-4">
                {/* Photo - col-span-4 on desktop */}
                <div className="col-span-12 lg:col-span-4">
                  <ProfileAssetCard
                    value={testimonial.image}
                    onChange={(url) => updateField(testimonial.id, 'image', url)}
                    storagePath={`testimonials/${testimonial.id}`}
                    label="Photo"
                  />
                </div>

                {/* Name & Role/Company - col-span-8 on desktop */}
                <div className="col-span-12 lg:col-span-8 space-y-4">
                  <ValidatedInput
                    label="Author Name"
                    value={testimonial.author || ''}
                    onChange={(value) => updateField(testimonial.id, 'author', value)}
                    maxLength={CHAR_LIMITS.author}
                    placeholder="John Smith"
                    required
                  />
                  <div className="grid grid-cols-12 gap-3">
                    <ValidatedInput
                      wrapperClassName="col-span-12 lg:col-span-7"
                      label="Role"
                      value={testimonial.role || ''}
                      onChange={(value) => updateField(testimonial.id, 'role', value)}
                      maxLength={CHAR_LIMITS.role}
                      placeholder="Quality Manager"
                    />
                    <ValidatedInput
                      wrapperClassName="col-span-12 lg:col-span-5"
                      label="Company"
                      value={testimonial.company || ''}
                      onChange={(value) => updateField(testimonial.id, 'company', value)}
                      maxLength={CHAR_LIMITS.company}
                      placeholder="Tata Motors"
                    />
                  </div>
                </div>

                {/* Quote - Full width */}
                <ValidatedTextarea
                  wrapperClassName="col-span-12"
                  label="Quote"
                  value={testimonial.quote || ''}
                  onChange={(value) => updateField(testimonial.id, 'quote', value)}
                  maxLength={CHAR_LIMITS.quote}
                  placeholder="The training transformed our approach to quality management..."
                  rows={3}
                  required
                />
              </div>

              {/* Footer Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400">Rating:</label>
                  <StarRating
                    value={testimonial.rating || 5}
                    onChange={(value) => updateField(testimonial.id, 'rating', value)}
                  />
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500">#</label>
                    <input
                      type="number"
                      value={testimonial.order || 0}
                      onChange={(e) => updateField(testimonial.id, 'order', parseInt(e.target.value) || 0)}
                      className="w-14 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm text-center focus:outline-none focus:border-primary-500"
                      min={0}
                    />
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={testimonial.active !== false}
                      onChange={(e) => updateField(testimonial.id, 'active', e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
                    />
                    <span className="text-xs text-gray-400">Active</span>
                  </label>

                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    disabled={deleteMutation.isPending}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </FormCard>
        ))}
      </div>

      {/* Empty State */}
      {testimonialsArray.length === 0 && !isLoading && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No Testimonials Found</h2>
          <p className="text-gray-400 mb-6">Get started by adding your first testimonial.</p>
          <button
            onClick={addTestimonial}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Testimonial
          </button>
        </div>
      )}

      {/* Save Bar */}
      <SaveBar
        isDirty={isDirty}
        hasErrors={hasErrors}
        onSave={handleSave}
        onDiscard={handleDiscard}
        isSaving={isSaving}
        lastEditedBy={data?._metadata?.updatedBy}
        lastEditedAt={data?._metadata?.updatedAt}
        isConflict={isConflict}
        onForceSave={handleForceSave}
      />
    </div>
  )
}

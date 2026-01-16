import { useState, useCallback, useMemo, useEffect } from 'react'

/**
 * Form validation hook with character limit tracking
 * @param {Object} initialData - Initial form data
 * @param {Object} schema - Validation schema with maxLength and required rules
 * @returns {Object} Form state and handlers
 *
 * Schema format:
 * {
 *   fieldName: { maxLength: 60, required: true },
 *   otherField: { maxLength: 200 }
 * }
 */
export function useFormValidation(initialData, schema) {
  const [formData, setFormData] = useState(initialData || {})
  const [touched, setTouched] = useState({})

  // Reset form when initialData changes (e.g., when data loads from Firebase)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      setTouched({})
    }
  }, [initialData])

  // Update a single field
  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setTouched(prev => ({ ...prev, [field]: true }))
  }, [])

  // Compute validation errors
  const errors = useMemo(() => {
    const errs = {}
    if (!schema) return errs

    for (const [field, rules] of Object.entries(schema)) {
      const value = formData[field] || ''
      const strValue = String(value)

      if (rules.maxLength && strValue.length > rules.maxLength) {
        errs[field] = `Exceeds ${rules.maxLength} character limit`
      }
      if (rules.required && !strValue.trim()) {
        errs[field] = 'This field is required'
      }
    }
    return errs
  }, [formData, schema])

  // Check if any field has errors
  const hasErrors = Object.keys(errors).length > 0

  // Check if form has been modified from initial state
  const isDirty = useMemo(() => {
    if (!initialData) return false
    return JSON.stringify(formData) !== JSON.stringify(initialData)
  }, [formData, initialData])

  // Get validation state for a specific field (for visual indicators)
  const getFieldState = useCallback(
    field => {
      const value = formData[field] || ''
      const strValue = String(value)
      const rules = schema?.[field]

      if (!rules?.maxLength) {
        return { state: 'normal', percentage: 0 }
      }

      const percentage = (strValue.length / rules.maxLength) * 100

      if (percentage > 100) {
        return { state: 'error', percentage }
      }
      if (percentage > 80) {
        return { state: 'warning', percentage }
      }
      return { state: 'normal', percentage }
    },
    [formData, schema]
  )

  // Reset form to initial state
  const reset = useCallback(() => {
    setFormData(initialData || {})
    setTouched({})
  }, [initialData])

  // Set entire form data (useful for loading from Firebase)
  const setData = useCallback(data => {
    setFormData(data)
  }, [])

  return {
    formData,
    updateField,
    errors,
    hasErrors,
    isDirty,
    touched,
    reset,
    setFormData: setData,
    getFieldState,
  }
}

/**
 * Character limits schema for all CMS sections
 */
export const CHAR_LIMITS = {
  hero: {
    headline: { maxLength: 60, required: true },
    highlightText: { maxLength: 80 },
    subheadline: { maxLength: 120 },
    primaryCtaText: { maxLength: 25 },
    secondaryCtaText: { maxLength: 25 },
  },
  stats: {
    label: { maxLength: 40, required: true },
    value: { maxLength: 10, required: true },
    suffix: { maxLength: 5 },
  },
  courses: {
    title: { maxLength: 50, required: true },
    level: { maxLength: 20 },
    duration: { maxLength: 15 },
    description: { maxLength: 200, required: true },
    idealFor: { maxLength: 100 },
    outcome: { maxLength: 150 },
  },
  testimonials: {
    quote: { maxLength: 250, required: true },
    author: { maxLength: 50, required: true },
    role: { maxLength: 60 },
    company: { maxLength: 40 },
  },
  about: {
    storyParagraph: { maxLength: 400 },
    missionStatement: { maxLength: 300 },
    visionStatement: { maxLength: 300 },
    directorsMessage: { maxLength: 500 },
  },
}

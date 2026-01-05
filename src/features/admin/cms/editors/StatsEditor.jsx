import { useState, useEffect, useMemo } from 'react'
import { useCMSData } from '../hooks/useCMSData'
import { ValidatedInput } from '../components/ValidatedInput'
import { FormCard } from '../components/FormCard'
import { SaveBar } from '../components/SaveBar'

// Character limits for stats
const CHAR_LIMITS = {
  value: 10,
  suffix: 5,
  label: 40,
}

export function StatsEditor() {
  const { data, isLoading, save, isSaving } = useCMSData('stats')
  const [formData, setFormData] = useState({})
  const [initialData, setInitialData] = useState({})

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
    for (const stat of Object.values(formData)) {
      if (String(stat.value || '').length > CHAR_LIMITS.value) return true
      if (String(stat.suffix || '').length > CHAR_LIMITS.suffix) return true
      if (String(stat.label || '').length > CHAR_LIMITS.label) return true
    }
    return false
  }, [formData])

  // Update a specific stat field
  const updateStatField = (statId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [statId]: {
        ...prev[statId],
        [field]: value,
      },
    }))
  }

  // Handle save
  const handleSave = async () => {
    try {
      await save(formData)
      setInitialData(formData)
    } catch (error) {
      console.error('Failed to save stats:', error)
    }
  }

  // Handle discard
  const handleDiscard = () => {
    setFormData(initialData)
  }

  // Convert stats object to sorted array for display
  const statsArray = useMemo(() => {
    if (!formData || typeof formData !== 'object') return []
    return Object.entries(formData)
      .map(([id, stat]) => ({ id, ...stat }))
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [formData])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Statistics</h1>
          <p className="text-gray-400 mt-1">Edit achievement numbers displayed on the homepage</p>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
              <div className="h-6 w-40 bg-white/10 rounded mb-4" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-12 bg-white/10 rounded" />
                <div className="h-12 bg-white/10 rounded" />
                <div className="h-12 bg-white/10 rounded" />
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
      <div>
        <h1 className="text-2xl font-bold text-white">Statistics</h1>
        <p className="text-gray-400 mt-1">
          Edit achievement numbers displayed on the homepage. Changes sync instantly to the live site.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4">
        {statsArray.map((stat) => (
          <FormCard
            key={stat.id}
            title={stat.label || 'Stat'}
            description={`ID: ${stat.id}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Value */}
              <ValidatedInput
                label="Value"
                value={String(stat.value || '')}
                onChange={(value) => updateStatField(stat.id, 'value', value)}
                maxLength={CHAR_LIMITS.value}
                placeholder="95,000"
              />

              {/* Suffix */}
              <ValidatedInput
                label="Suffix"
                value={stat.suffix || ''}
                onChange={(value) => updateStatField(stat.id, 'suffix', value)}
                maxLength={CHAR_LIMITS.suffix}
                placeholder="+"
              />

              {/* Label */}
              <ValidatedInput
                label="Label"
                value={stat.label || ''}
                onChange={(value) => updateStatField(stat.id, 'label', value)}
                maxLength={CHAR_LIMITS.label}
                placeholder="Professionals Trained"
                required
              />
            </div>

            {/* Order field (optional) */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-400">Display Order:</label>
                <input
                  type="number"
                  value={stat.order || 0}
                  onChange={(e) => updateStatField(stat.id, 'order', parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                  min={0}
                />
              </div>
            </div>
          </FormCard>
        ))}
      </div>

      {/* Empty state */}
      {statsArray.length === 0 && !isLoading && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No Statistics Found</h2>
          <p className="text-gray-400">Use the Seed Utility to populate initial data.</p>
        </div>
      )}

      {/* Save Bar */}
      <SaveBar
        isDirty={isDirty}
        hasErrors={hasErrors}
        onSave={handleSave}
        onDiscard={handleDiscard}
        isSaving={isSaving}
      />
    </div>
  )
}

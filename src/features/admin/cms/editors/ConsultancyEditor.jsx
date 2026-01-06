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

// Character limits
const CHAR_LIMITS = {
  service: { title: 50, description: 200, deliverable: 80 },
  caseStudy: { industry: 40, challenge: 200, solution: 250, outcome: 100 },
  industry: { name: 40, description: 150 },
}

const TABS = [
  { id: 'services', label: 'Services', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { id: 'caseStudies', label: 'Case Studies', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'industries', label: 'Industries', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
]

export function ConsultancyEditor() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()
  const [activeTab, setActiveTab] = useState('services')
  const [formData, setFormData] = useState({
    services: {},
    caseStudies: {},
    industries: {},
  })
  const [initialData, setInitialData] = useState({
    services: {},
    caseStudies: {},
    industries: {},
  })
  const [expandedItems, setExpandedItems] = useState({})

  // Fetch all consultancy data
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['siteContent', 'services'],
    queryFn: async () => {
      const snapshot = await get(ref(db, 'siteContent/services'))
      return snapshot.exists() ? snapshot.val() : {}
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: caseStudiesData, isLoading: caseStudiesLoading } = useQuery({
    queryKey: ['siteContent', 'caseStudies'],
    queryFn: async () => {
      const snapshot = await get(ref(db, 'siteContent/caseStudies'))
      return snapshot.exists() ? snapshot.val() : {}
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: industriesData, isLoading: industriesLoading } = useQuery({
    queryKey: ['siteContent', 'industries'],
    queryFn: async () => {
      const snapshot = await get(ref(db, 'siteContent/industries'))
      return snapshot.exists() ? snapshot.val() : {}
    },
    staleTime: 5 * 60 * 1000,
  })

  const isLoading = servicesLoading || caseStudiesLoading || industriesLoading

  // Initialize form data
  useEffect(() => {
    if (servicesData || caseStudiesData || industriesData) {
      const data = {
        services: servicesData || {},
        caseStudies: caseStudiesData || {},
        industries: industriesData || {},
      }
      setFormData(data)
      setInitialData(data)
    }
  }, [servicesData, caseStudiesData, industriesData])

  // Save mutations for each section
  const saveMutation = useMutation({
    mutationFn: async ({ path, data }) => {
      await update(ref(db, `siteContent/${path}`), data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent'] })
      queryClient.invalidateQueries({ queryKey: ['services'] })
      queryClient.invalidateQueries({ queryKey: ['caseStudies'] })
      queryClient.invalidateQueries({ queryKey: ['industries'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async ({ path }) => {
      await remove(ref(db, `siteContent/${path}`))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent'] })
      queryClient.invalidateQueries({ queryKey: ['services'] })
      queryClient.invalidateQueries({ queryKey: ['caseStudies'] })
      queryClient.invalidateQueries({ queryKey: ['industries'] })
    },
  })

  // Check if form has changes
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialData)
  }, [formData, initialData])

  // Check for validation errors
  const hasErrors = useMemo(() => {
    // Check services
    for (const service of Object.values(formData.services || {})) {
      if (String(service.title || '').length > CHAR_LIMITS.service.title) return true
      if (String(service.description || '').length > CHAR_LIMITS.service.description) return true
    }
    // Check case studies
    for (const study of Object.values(formData.caseStudies || {})) {
      if (String(study.industry || '').length > CHAR_LIMITS.caseStudy.industry) return true
      if (String(study.challenge || '').length > CHAR_LIMITS.caseStudy.challenge) return true
      if (String(study.solution || '').length > CHAR_LIMITS.caseStudy.solution) return true
    }
    // Check industries
    for (const industry of Object.values(formData.industries || {})) {
      if (String(industry.name || '').length > CHAR_LIMITS.industry.name) return true
      if (String(industry.description || '').length > CHAR_LIMITS.industry.description) return true
    }
    return false
  }, [formData])

  // Toggle item expansion
  const toggleItem = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Update field helper
  const updateField = (section, itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [itemId]: {
          ...prev[section][itemId],
          [field]: value,
        },
      },
    }))
  }

  // Add item helper
  const addItem = (section) => {
    const newId = `${section}_${Date.now()}`
    const items = Object.values(formData[section] || {})
    const newOrder = items.length > 0 ? Math.max(...items.map(i => i.order || 0)) + 1 : 1

    const templates = {
      services: {
        title: 'New Service',
        description: '',
        deliverables: [''],
        order: newOrder,
        active: true,
      },
      caseStudies: {
        industry: '',
        challenge: '',
        solution: '',
        outcomes: [{ metric: '', description: '' }],
        order: newOrder,
        active: true,
      },
      industries: {
        name: 'New Industry',
        description: '',
        projectsCount: 0,
        order: newOrder,
        active: true,
      },
    }

    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [newId]: templates[section],
      },
    }))
    setExpandedItems(prev => ({ ...prev, [newId]: true }))
  }

  // Delete item helper
  const deleteItem = async (section, itemId) => {
    if (!window.confirm(`Are you sure you want to delete this ${section.slice(0, -1)}?`)) return

    if (initialData[section]?.[itemId]) {
      await deleteMutation.mutateAsync({ path: `${section}/${itemId}` })
    }

    setFormData(prev => {
      const newSection = { ...prev[section] }
      delete newSection[itemId]
      return { ...prev, [section]: newSection }
    })
    setInitialData(prev => {
      const newSection = { ...prev[section] }
      delete newSection[itemId]
      return { ...prev, [section]: newSection }
    })
  }

  // Handle save
  const handleSave = async () => {
    try {
      // Save all sections that have changes
      if (JSON.stringify(formData.services) !== JSON.stringify(initialData.services)) {
        await saveMutation.mutateAsync({ path: 'services', data: formData.services })
      }
      if (JSON.stringify(formData.caseStudies) !== JSON.stringify(initialData.caseStudies)) {
        await saveMutation.mutateAsync({ path: 'caseStudies', data: formData.caseStudies })
      }
      if (JSON.stringify(formData.industries) !== JSON.stringify(initialData.industries)) {
        await saveMutation.mutateAsync({ path: 'industries', data: formData.industries })
      }
      setInitialData(formData)
      success('Consultancy data saved successfully!')
    } catch (err) {
      error(getErrorMessage(err))
      console.error('Failed to save:', err)
    }
  }

  // Handle discard
  const handleDiscard = () => {
    setFormData(initialData)
  }

  // Convert to sorted arrays
  const getItemsArray = (section) => {
    if (!formData[section] || typeof formData[section] !== 'object') return []
    return Object.entries(formData[section])
      .map(([id, item]) => ({ id, ...item }))
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }

  // Render Services Tab
  const renderServicesTab = () => {
    const items = getItemsArray('services')

    return (
      <div className="space-y-4">
        {items.map(service => (
          <div key={service.id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleItem(service.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-white">{service.title || 'Untitled Service'}</span>
              </div>
              <div className="flex items-center gap-2">
                {service.active === false && (
                  <span className="px-2 py-1 text-xs bg-gray-600/50 text-gray-300 rounded">Inactive</span>
                )}
                <motion.svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  animate={{ rotate: expandedItems[service.id] ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </div>
            </button>

            <AnimatePresence>
              {expandedItems[service.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 border-t border-white/10 pt-6 space-y-4">
                    <ValidatedInput
                      label="Service Title"
                      value={service.title || ''}
                      onChange={(v) => updateField('services', service.id, 'title', v)}
                      maxLength={CHAR_LIMITS.service.title}
                      placeholder="Lean Six Sigma Implementation"
                      required
                    />
                    <ValidatedTextarea
                      label="Description"
                      value={service.description || ''}
                      onChange={(v) => updateField('services', service.id, 'description', v)}
                      maxLength={CHAR_LIMITS.service.description}
                      placeholder="Comprehensive implementation support..."
                      rows={3}
                    />

                    {/* Service Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Service Image</label>
                      <MediaUploader
                        value={service.image || ''}
                        onUpload={(url) => updateField('services', service.id, 'image', url)}
                        storagePath={`services/${service.id}`}
                      />
                    </div>

                    {/* Deliverables */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Deliverables</label>
                      <div className="space-y-2">
                        {(service.deliverables || ['']).map((deliverable, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              value={deliverable}
                              onChange={(e) => {
                                const newDeliverables = [...(service.deliverables || [''])]
                                newDeliverables[idx] = e.target.value
                                updateField('services', service.id, 'deliverables', newDeliverables)
                              }}
                              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                              placeholder="Deliverable item..."
                            />
                            <button
                              onClick={() => {
                                const newDeliverables = (service.deliverables || ['']).filter((_, i) => i !== idx)
                                updateField('services', service.id, 'deliverables', newDeliverables.length ? newDeliverables : [''])
                              }}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => updateField('services', service.id, 'deliverables', [...(service.deliverables || ['']), ''])}
                          className="text-sm text-primary-400 hover:text-primary-300"
                        >
                          + Add Deliverable
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-400">Order:</label>
                          <input
                            type="number"
                            value={service.order || 0}
                            onChange={(e) => updateField('services', service.id, 'order', parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm"
                            min={0}
                          />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={service.active !== false}
                            onChange={(e) => updateField('services', service.id, 'active', e.target.checked)}
                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-600"
                          />
                          <span className="text-sm text-gray-300">Active</span>
                        </label>
                      </div>
                      <button
                        onClick={() => deleteItem('services', service.id)}
                        className="flex items-center gap-2 px-3 py-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No services yet. Click "Add Service" to get started.
          </div>
        )}
      </div>
    )
  }

  // Render Case Studies Tab
  const renderCaseStudiesTab = () => {
    const items = getItemsArray('caseStudies')

    return (
      <div className="space-y-4">
        {items.map(study => (
          <div key={study.id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleItem(study.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent-600/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-white">{study.industry || 'Untitled Case Study'}</span>
              </div>
              <div className="flex items-center gap-2">
                {study.active === false && (
                  <span className="px-2 py-1 text-xs bg-gray-600/50 text-gray-300 rounded">Inactive</span>
                )}
                <motion.svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  animate={{ rotate: expandedItems[study.id] ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </div>
            </button>

            <AnimatePresence>
              {expandedItems[study.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 border-t border-white/10 pt-6 space-y-4">
                    <ValidatedInput
                      label="Industry"
                      value={study.industry || ''}
                      onChange={(v) => updateField('caseStudies', study.id, 'industry', v)}
                      maxLength={CHAR_LIMITS.caseStudy.industry}
                      placeholder="Automotive Manufacturing"
                      required
                    />
                    <ValidatedTextarea
                      label="Challenge"
                      value={study.challenge || ''}
                      onChange={(v) => updateField('caseStudies', study.id, 'challenge', v)}
                      maxLength={CHAR_LIMITS.caseStudy.challenge}
                      placeholder="The client faced significant quality issues..."
                      rows={3}
                    />
                    <ValidatedTextarea
                      label="Solution"
                      value={study.solution || ''}
                      onChange={(v) => updateField('caseStudies', study.id, 'solution', v)}
                      maxLength={CHAR_LIMITS.caseStudy.solution}
                      placeholder="We implemented a comprehensive Lean Six Sigma program..."
                      rows={3}
                    />

                    {/* Case Study Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Case Study Image</label>
                      <MediaUploader
                        value={study.image || ''}
                        onUpload={(url) => updateField('caseStudies', study.id, 'image', url)}
                        storagePath={`caseStudies/${study.id}`}
                      />
                    </div>

                    {/* Outcomes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Outcomes</label>
                      <div className="space-y-2">
                        {(study.outcomes || [{ metric: '', description: '' }]).map((outcome, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              value={outcome.metric || ''}
                              onChange={(e) => {
                                const newOutcomes = [...(study.outcomes || [])]
                                newOutcomes[idx] = { ...newOutcomes[idx], metric: e.target.value }
                                updateField('caseStudies', study.id, 'outcomes', newOutcomes)
                              }}
                              className="w-32 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                              placeholder="40%"
                            />
                            <input
                              type="text"
                              value={outcome.description || ''}
                              onChange={(e) => {
                                const newOutcomes = [...(study.outcomes || [])]
                                newOutcomes[idx] = { ...newOutcomes[idx], description: e.target.value }
                                updateField('caseStudies', study.id, 'outcomes', newOutcomes)
                              }}
                              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                              placeholder="Reduction in defects"
                            />
                            <button
                              onClick={() => {
                                const newOutcomes = (study.outcomes || []).filter((_, i) => i !== idx)
                                updateField('caseStudies', study.id, 'outcomes', newOutcomes.length ? newOutcomes : [{ metric: '', description: '' }])
                              }}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => updateField('caseStudies', study.id, 'outcomes', [...(study.outcomes || []), { metric: '', description: '' }])}
                          className="text-sm text-primary-400 hover:text-primary-300"
                        >
                          + Add Outcome
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-400">Order:</label>
                          <input
                            type="number"
                            value={study.order || 0}
                            onChange={(e) => updateField('caseStudies', study.id, 'order', parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm"
                            min={0}
                          />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={study.active !== false}
                            onChange={(e) => updateField('caseStudies', study.id, 'active', e.target.checked)}
                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-600"
                          />
                          <span className="text-sm text-gray-300">Active</span>
                        </label>
                      </div>
                      <button
                        onClick={() => deleteItem('caseStudies', study.id)}
                        className="flex items-center gap-2 px-3 py-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No case studies yet. Click "Add Case Study" to get started.
          </div>
        )}
      </div>
    )
  }

  // Render Industries Tab
  const renderIndustriesTab = () => {
    const items = getItemsArray('industries')

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(industry => (
          <FormCard key={industry.id} className="relative">
            {industry.active === false && (
              <span className="absolute top-4 right-4 px-2 py-1 text-xs bg-gray-600/50 text-gray-300 rounded">Inactive</span>
            )}
            <div className="space-y-4">
              <ValidatedInput
                label="Industry Name"
                value={industry.name || ''}
                onChange={(v) => updateField('industries', industry.id, 'name', v)}
                maxLength={CHAR_LIMITS.industry.name}
                placeholder="Automotive"
                required
              />
              <ValidatedTextarea
                label="Description"
                value={industry.description || ''}
                onChange={(v) => updateField('industries', industry.id, 'description', v)}
                maxLength={CHAR_LIMITS.industry.description}
                placeholder="We've helped automotive companies..."
                rows={2}
              />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400">Projects:</label>
                  <input
                    type="number"
                    value={industry.projectsCount || 0}
                    onChange={(e) => updateField('industries', industry.id, 'projectsCount', parseInt(e.target.value) || 0)}
                    className="w-20 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm"
                    min={0}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400">Order:</label>
                  <input
                    type="number"
                    value={industry.order || 0}
                    onChange={(e) => updateField('industries', industry.id, 'order', parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm"
                    min={0}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={industry.active !== false}
                    onChange={(e) => updateField('industries', industry.id, 'active', e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-600"
                  />
                  <span className="text-sm text-gray-300">Active</span>
                </label>
                <button
                  onClick={() => deleteItem('industries', industry.id)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </FormCard>
        ))}

        {items.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-400">
            No industries yet. Click "Add Industry" to get started.
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Consultancy</h1>
          <p className="text-gray-400 mt-1">Manage services, case studies, and industries</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
              <div className="h-6 w-48 bg-white/10 rounded" />
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
          <h1 className="text-2xl font-bold text-white">Consultancy</h1>
          <p className="text-gray-400 mt-1">Manage services, case studies, and industries</p>
        </div>
        <button
          onClick={() => addItem(activeTab)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add {activeTab === 'services' ? 'Service' : activeTab === 'caseStudies' ? 'Case Study' : 'Industry'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded">
              {Object.keys(formData[tab.id] || {}).length}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'services' && renderServicesTab()}
      {activeTab === 'caseStudies' && renderCaseStudiesTab()}
      {activeTab === 'industries' && renderIndustriesTab()}

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

 
import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ref, get, update, remove, serverTimestamp } from 'firebase/database'
import { db } from '../../../../services/firebase'
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
  service: { title: 50, description: 200, deliverable: 80 },
  caseStudy: { industry: 40, challenge: 200, solution: 250, outcome: 100 },
  industry: { name: 40, description: 150 },
}

const TABS = [
  {
    id: 'services',
    label: 'Services',
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    id: 'caseStudies',
    label: 'Case Studies',
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    id: 'industries',
    label: 'Industries',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
]

/**
 * ImageAssetCard - Compact image uploader for services/case studies
 */
function ImageAssetCard({ value, onUpload, storagePath, label = 'Image' }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const fileInputRef = useRef(null)
  const { upload, progress, uploading, reset } = useStorage()

  const handleFile = useCallback(
    async file => {
      reset()
      if (!file.type.startsWith('image/')) return
      if (file.size > 5 * 1024 * 1024) return
      try {
        const timestamp = Date.now()
        const ext = file.name.split('.').pop()
        const url = await upload(file, `${storagePath}/${timestamp}.${ext}`)
        onUpload(url)
      } catch (err) {
        console.error('Upload failed:', err)
      }
    },
    [storagePath, upload, onUpload, reset]
  )

  const handleDrop = useCallback(
    e => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
    },
    [handleFile]
  )

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div
        onDragOver={e => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={e => {
          e.preventDefault()
          setIsDragging(false)
        }}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={!value && !uploading ? () => fileInputRef.current?.click() : undefined}
        className={`relative overflow-hidden rounded-xl transition-all duration-200 ${!value && !uploading ? 'cursor-pointer' : ''} ${isDragging ? 'ring-2 ring-primary-500' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />

        {value && !uploading && (
          <div className="relative aspect-video w-full max-w-[200px]">
            <img src={value} alt="" className="w-full h-full object-cover rounded-xl" />
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl flex flex-col justify-end p-3 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'} active:opacity-100`}
            >
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  className="flex-1 px-2 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg text-xs font-medium"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation()
                    onUpload(null)
                    reset()
                  }}
                  className="px-2 py-1.5 bg-red-500/30 hover:bg-red-500/50 backdrop-blur-sm text-white rounded-lg text-xs"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {uploading && (
          <div className="aspect-video w-full max-w-[200px] bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mb-2"
            />
            <span className="text-xs text-gray-400">{progress}%</span>
          </div>
        )}

        {!value && !uploading && (
          <div
            className={`aspect-video w-full max-w-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 transition-all ${isDragging ? 'border-primary-500 bg-primary-500/10' : 'border-white/30 bg-white/5 hover:bg-white/10'}`}
          >
            <svg
              className={`w-8 h-8 mb-2 ${isDragging ? 'text-primary-400' : 'text-gray-500'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs text-gray-400">{isDragging ? 'Drop here' : 'Add image'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function ConsultancyEditor() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { success, error } = useToast()
  const [activeTab, setActiveTab] = useState('services')
  const [selectedServiceId, setSelectedServiceId] = useState(null)
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState(null)
  const [formData, setFormData] = useState({
    services: {},
    serviceDeliverables: {},
    caseStudies: {},
    caseStudyOutcomes: {},
    industries: {},
  })
  const [initialData, setInitialData] = useState({
    services: {},
    serviceDeliverables: {},
    caseStudies: {},
    caseStudyOutcomes: {},
    industries: {},
  })
  const [initialTimestamp, setInitialTimestamp] = useState(null)

  // Fetch all consultancy data
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['siteContent', 'services'],
    queryFn: async () => {
      const s = await get(ref(db, 'siteContent/services'))
      return s.exists() ? s.val() : {}
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: serviceDeliverablesData, isLoading: deliverablesLoading } = useQuery({
    queryKey: ['siteContent', 'serviceDeliverables'],
    queryFn: async () => {
      const s = await get(ref(db, 'siteContent/serviceDeliverables'))
      return s.exists() ? s.val() : {}
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: caseStudiesData, isLoading: caseStudiesLoading } = useQuery({
    queryKey: ['siteContent', 'caseStudies'],
    queryFn: async () => {
      const s = await get(ref(db, 'siteContent/caseStudies'))
      return s.exists() ? s.val() : {}
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: caseStudyOutcomesData, isLoading: outcomesLoading } = useQuery({
    queryKey: ['siteContent', 'caseStudyOutcomes'],
    queryFn: async () => {
      const s = await get(ref(db, 'siteContent/caseStudyOutcomes'))
      return s.exists() ? s.val() : {}
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: industriesData, isLoading: industriesLoading } = useQuery({
    queryKey: ['siteContent', 'industries'],
    queryFn: async () => {
      const s = await get(ref(db, 'siteContent/industries'))
      return s.exists() ? s.val() : {}
    },
    staleTime: 5 * 60 * 1000,
  })

  const isLoading =
    servicesLoading ||
    deliverablesLoading ||
    caseStudiesLoading ||
    outcomesLoading ||
    industriesLoading

  useEffect(() => {
    if (
      servicesData ||
      serviceDeliverablesData ||
      caseStudiesData ||
      caseStudyOutcomesData ||
      industriesData
    ) {
      const data = {
        services: servicesData || {},
        serviceDeliverables: serviceDeliverablesData || {},
        caseStudies: caseStudiesData || {},
        caseStudyOutcomes: caseStudyOutcomesData || {},
        industries: industriesData || {},
      }
      setFormData(data)
      setInitialData(data)
      // Track timestamp from services as the primary reference
      setInitialTimestamp(getMetadataTimestamp(servicesData))
    }
  }, [
    servicesData,
    serviceDeliverablesData,
    caseStudiesData,
    caseStudyOutcomesData,
    industriesData,
  ])

  const saveMutation = useMutation({
    mutationFn: async ({ path, data }) => {
      const metadata = {
        updatedBy: user?.email || 'unknown',
        updatedAt: serverTimestamp(),
        updatedByUid: user?.uid || null,
      }
      await update(ref(db, `siteContent/${path}`), { ...data, _metadata: metadata })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async ({ path }) => {
      await remove(ref(db, `siteContent/${path}`))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent'] })
    },
  })

  const isDirty = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(initialData),
    [formData, initialData]
  )

  const hasErrors = useMemo(() => {
    for (const s of Object.values(formData.services || {})) {
      if (String(s.title || '').length > CHAR_LIMITS.service.title) return true
      if (String(s.description || '').length > CHAR_LIMITS.service.description) return true
    }
    for (const c of Object.values(formData.caseStudies || {})) {
      if (String(c.industry || '').length > CHAR_LIMITS.caseStudy.industry) return true
      if (String(c.challenge || '').length > CHAR_LIMITS.caseStudy.challenge) return true
      if (String(c.solution || '').length > CHAR_LIMITS.caseStudy.solution) return true
    }
    for (const i of Object.values(formData.industries || {})) {
      if (String(i.name || '').length > CHAR_LIMITS.industry.name) return true
      if (String(i.description || '').length > CHAR_LIMITS.industry.description) return true
    }
    return false
  }, [formData])

  const updateField = (section, itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [itemId]: { ...prev[section][itemId], [field]: value } },
    }))
  }

  const addItem = section => {
    const newId = `${section}_${Date.now()}`
    const items = Object.values(formData[section] || {})
    const newOrder = items.length > 0 ? Math.max(...items.map(i => i.order || 0)) + 1 : 1

    const templates = {
      services: { title: 'New Service', description: '', order: newOrder, active: true },
      caseStudies: { industry: '', challenge: '', solution: '', order: newOrder, active: true },
      industries: {
        name: 'New Industry',
        description: '',
        projects: '',
        order: newOrder,
        active: true,
      },
    }

    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [newId]: templates[section] },
      ...(section === 'services'
        ? { serviceDeliverables: { ...prev.serviceDeliverables, [newId]: { d1: '' } } }
        : {}),
      ...(section === 'caseStudies'
        ? {
            caseStudyOutcomes: {
              ...prev.caseStudyOutcomes,
              [newId]: { o1: { metric: '', description: '' } },
            },
          }
        : {}),
    }))

    if (section === 'services') setSelectedServiceId(newId)
    if (section === 'caseStudies') setSelectedCaseStudyId(newId)
  }

  const deleteItem = async (section, itemId) => {
    if (!window.confirm(`Delete this ${section.slice(0, -1)}?`)) return

    if (initialData[section]?.[itemId]) {
      await deleteMutation.mutateAsync({ path: `${section}/${itemId}` })
      if (section === 'services' && initialData.serviceDeliverables?.[itemId]) {
        await deleteMutation.mutateAsync({ path: `serviceDeliverables/${itemId}` })
      }
      if (section === 'caseStudies' && initialData.caseStudyOutcomes?.[itemId]) {
        await deleteMutation.mutateAsync({ path: `caseStudyOutcomes/${itemId}` })
      }
    }

    if (section === 'services' && selectedServiceId === itemId) setSelectedServiceId(null)
    if (section === 'caseStudies' && selectedCaseStudyId === itemId) setSelectedCaseStudyId(null)

    setFormData(prev => {
      const newSection = { ...prev[section] }
      delete newSection[itemId]
      const newSD =
        section === 'services'
          ? (() => {
              const sd = { ...prev.serviceDeliverables }
              delete sd[itemId]
              return sd
            })()
          : prev.serviceDeliverables
      const newCO =
        section === 'caseStudies'
          ? (() => {
              const co = { ...prev.caseStudyOutcomes }
              delete co[itemId]
              return co
            })()
          : prev.caseStudyOutcomes
      return {
        ...prev,
        [section]: newSection,
        serviceDeliverables: newSD,
        caseStudyOutcomes: newCO,
      }
    })
    setInitialData(prev => {
      const newSection = { ...prev[section] }
      delete newSection[itemId]
      const newSD =
        section === 'services'
          ? (() => {
              const sd = { ...prev.serviceDeliverables }
              delete sd[itemId]
              return sd
            })()
          : prev.serviceDeliverables
      const newCO =
        section === 'caseStudies'
          ? (() => {
              const co = { ...prev.caseStudyOutcomes }
              delete co[itemId]
              return co
            })()
          : prev.caseStudyOutcomes
      return {
        ...prev,
        [section]: newSection,
        serviceDeliverables: newSD,
        caseStudyOutcomes: newCO,
      }
    })
  }

  const handleSave = async () => {
    try {
      if (JSON.stringify(formData.services) !== JSON.stringify(initialData.services))
        await saveMutation.mutateAsync({ path: 'services', data: formData.services })
      if (
        JSON.stringify(formData.serviceDeliverables) !==
        JSON.stringify(initialData.serviceDeliverables)
      )
        await saveMutation.mutateAsync({
          path: 'serviceDeliverables',
          data: formData.serviceDeliverables,
        })
      if (JSON.stringify(formData.caseStudies) !== JSON.stringify(initialData.caseStudies))
        await saveMutation.mutateAsync({ path: 'caseStudies', data: formData.caseStudies })
      if (
        JSON.stringify(formData.caseStudyOutcomes) !== JSON.stringify(initialData.caseStudyOutcomes)
      )
        await saveMutation.mutateAsync({
          path: 'caseStudyOutcomes',
          data: formData.caseStudyOutcomes,
        })
      if (JSON.stringify(formData.industries) !== JSON.stringify(initialData.industries))
        await saveMutation.mutateAsync({ path: 'industries', data: formData.industries })
      setInitialData(formData)
      success('Consultancy data saved!')
    } catch (err) {
      error(getErrorMessage(err))
    }
  }

  const handleDiscard = () => setFormData(initialData)

  // Arrays
  const servicesArray = useMemo(() => {
    if (!formData.services) return []
    return Object.entries(formData.services)
      .map(([id, s]) => ({ id, ...s }))
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [formData.services])

  const caseStudiesArray = useMemo(() => {
    if (!formData.caseStudies) return []
    return Object.entries(formData.caseStudies)
      .map(([id, c]) => ({ id, ...c }))
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [formData.caseStudies])

  const industriesArray = useMemo(() => {
    if (!formData.industries) return []
    return Object.entries(formData.industries)
      .map(([id, i]) => ({ id, ...i }))
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [formData.industries])

  const selectedService = useMemo(() => {
    if (!selectedServiceId || !formData.services[selectedServiceId]) return null
    return { id: selectedServiceId, ...formData.services[selectedServiceId] }
  }, [selectedServiceId, formData.services])

  const selectedCaseStudy = useMemo(() => {
    if (!selectedCaseStudyId || !formData.caseStudies[selectedCaseStudyId]) return null
    return { id: selectedCaseStudyId, ...formData.caseStudies[selectedCaseStudyId] }
  }, [selectedCaseStudyId, formData.caseStudies])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Consultancy</h1>
          <p className="text-gray-400 mt-1">Manage services, case studies, and industries</p>
        </div>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
          <div className="h-6 w-48 bg-white/10 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-white">Consultancy</h1>
        <p className="text-gray-400 mt-1">Manage services, case studies, and industries</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
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

      {/* Services Tab - Master-Detail */}
      {activeTab === 'services' && (
        <MasterDetailLayout
          items={servicesArray}
          selectedId={selectedServiceId}
          onSelect={setSelectedServiceId}
          renderListItemMeta={s => (
            <p className="text-xs text-gray-500">{s.active === false ? 'Inactive' : 'Active'}</p>
          )}
          emptyMessage="No services yet"
          addButton={{ label: 'Add Service', onClick: () => addItem('services') }}
          detailTitle={selectedService?.title}
        >
          {selectedService && (
            <div className="space-y-6">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-4 order-first">
                  <ImageAssetCard
                    value={selectedService.image}
                    onUpload={url => updateField('services', selectedService.id, 'image', url)}
                    storagePath={`services/${selectedService.id}`}
                    label="Service Image"
                  />
                </div>
                <div className="col-span-12 lg:col-span-8 space-y-4">
                  <ValidatedInput
                    label="Service Title"
                    value={selectedService.title || ''}
                    onChange={v => updateField('services', selectedService.id, 'title', v)}
                    maxLength={CHAR_LIMITS.service.title}
                    placeholder="Lean Six Sigma Implementation"
                    required
                  />
                  <ValidatedTextarea
                    label="Description"
                    value={selectedService.description || ''}
                    onChange={v => updateField('services', selectedService.id, 'description', v)}
                    maxLength={CHAR_LIMITS.service.description}
                    placeholder="Comprehensive implementation support..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Deliverables */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Deliverables
                </h4>
                <div className="space-y-2">
                  {(() => {
                    const deliverables = formData.serviceDeliverables?.[selectedService.id] || {}
                    const arr = Object.entries(deliverables)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([k, v]) => ({ k, v }))
                    if (arr.length === 0) arr.push({ k: 'd1', v: '' })
                    return arr.map(({ k, v }) => (
                      <div key={k} className="flex gap-2">
                        <input
                          type="text"
                          value={v}
                          onChange={e =>
                            setFormData(prev => ({
                              ...prev,
                              serviceDeliverables: {
                                ...prev.serviceDeliverables,
                                [selectedService.id]: {
                                  ...prev.serviceDeliverables?.[selectedService.id],
                                  [k]: e.target.value,
                                },
                              },
                            }))
                          }
                          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                          placeholder="Deliverable..."
                        />
                        <button
                          onClick={() => {
                            setFormData(prev => {
                              const curr = { ...prev.serviceDeliverables?.[selectedService.id] }
                              delete curr[k]
                              const remaining = Object.values(curr)
                              const renumbered = {}
                              remaining.forEach((val, i) => {
                                renumbered[`d${i + 1}`] = val
                              })
                              return {
                                ...prev,
                                serviceDeliverables: {
                                  ...prev.serviceDeliverables,
                                  [selectedService.id]:
                                    Object.keys(renumbered).length > 0 ? renumbered : { d1: '' },
                                },
                              }
                            })
                          }}
                          className="p-3 text-red-400 hover:bg-red-500/10 rounded-lg"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))
                  })()}
                  <button
                    onClick={() =>
                      setFormData(prev => {
                        const curr = prev.serviceDeliverables?.[selectedService.id] || {}
                        const n = Object.keys(curr).length + 1
                        return {
                          ...prev,
                          serviceDeliverables: {
                            ...prev.serviceDeliverables,
                            [selectedService.id]: { ...curr, [`d${n}`]: '' },
                          },
                        }
                      })
                    }
                    className="text-sm text-primary-400 hover:text-primary-300"
                  >
                    + Add Deliverable
                  </button>
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-12 gap-4 pt-4 border-t border-white/10">
                <div className="col-span-6 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                  <input
                    type="number"
                    value={selectedService.order || 0}
                    onChange={e =>
                      updateField(
                        'services',
                        selectedService.id,
                        'order',
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    min={0}
                  />
                </div>
                <div className="col-span-6 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <label className="flex items-center gap-3 h-[46px] px-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10">
                    <input
                      type="checkbox"
                      checked={selectedService.active !== false}
                      onChange={e =>
                        updateField('services', selectedService.id, 'active', e.target.checked)
                      }
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-600"
                    />
                    <span className="text-sm text-gray-300">Active</span>
                  </label>
                </div>
              </div>

              {/* Delete */}
              <div className="pt-6 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => deleteItem('services', selectedService.id)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Service
                </button>
              </div>
            </div>
          )}
        </MasterDetailLayout>
      )}

      {/* Case Studies Tab - Master-Detail */}
      {activeTab === 'caseStudies' && (
        <MasterDetailLayout
          items={caseStudiesArray}
          selectedId={selectedCaseStudyId}
          onSelect={setSelectedCaseStudyId}
          renderListItem={(c, isSelected) => (
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p
                  className={`font-medium truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}
                >
                  {c.industry || 'Untitled'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {c.active === false ? 'Inactive' : 'Active'}
                </p>
              </div>
              {c.active === false && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-700 text-gray-400 rounded">
                  Inactive
                </span>
              )}
            </div>
          )}
          emptyMessage="No case studies yet"
          addButton={{ label: 'Add Case Study', onClick: () => addItem('caseStudies') }}
          detailTitle={selectedCaseStudy?.industry}
        >
          {selectedCaseStudy && (
            <div className="space-y-6">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-4 order-first">
                  <ImageAssetCard
                    value={selectedCaseStudy.image}
                    onUpload={url => updateField('caseStudies', selectedCaseStudy.id, 'image', url)}
                    storagePath={`caseStudies/${selectedCaseStudy.id}`}
                    label="Case Study Image"
                  />
                </div>
                <div className="col-span-12 lg:col-span-8 space-y-4">
                  <ValidatedInput
                    label="Industry"
                    value={selectedCaseStudy.industry || ''}
                    onChange={v => updateField('caseStudies', selectedCaseStudy.id, 'industry', v)}
                    maxLength={CHAR_LIMITS.caseStudy.industry}
                    placeholder="Automotive Manufacturing"
                    required
                  />
                  <ValidatedTextarea
                    label="Challenge"
                    value={selectedCaseStudy.challenge || ''}
                    onChange={v => updateField('caseStudies', selectedCaseStudy.id, 'challenge', v)}
                    maxLength={CHAR_LIMITS.caseStudy.challenge}
                    placeholder="The client faced significant quality issues..."
                    rows={3}
                  />
                </div>
                <ValidatedTextarea
                  wrapperClassName="col-span-12"
                  label="Solution"
                  value={selectedCaseStudy.solution || ''}
                  onChange={v => updateField('caseStudies', selectedCaseStudy.id, 'solution', v)}
                  maxLength={CHAR_LIMITS.caseStudy.solution}
                  placeholder="We implemented a comprehensive Lean Six Sigma program..."
                  rows={3}
                />
              </div>

              {/* Outcomes */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Outcomes
                </h4>
                <div className="space-y-2">
                  {(() => {
                    const outcomes = formData.caseStudyOutcomes?.[selectedCaseStudy.id] || {}
                    const arr = Object.entries(outcomes)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([k, v]) => ({ k, ...v }))
                    if (arr.length === 0) arr.push({ k: 'o1', metric: '', description: '' })
                    return arr.map(({ k, metric, description }) => (
                      <div key={k} className="flex gap-2">
                        <input
                          type="text"
                          value={metric || ''}
                          onChange={e =>
                            setFormData(prev => ({
                              ...prev,
                              caseStudyOutcomes: {
                                ...prev.caseStudyOutcomes,
                                [selectedCaseStudy.id]: {
                                  ...prev.caseStudyOutcomes?.[selectedCaseStudy.id],
                                  [k]: {
                                    ...prev.caseStudyOutcomes?.[selectedCaseStudy.id]?.[k],
                                    metric: e.target.value,
                                  },
                                },
                              },
                            }))
                          }
                          className="w-24 px-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                          placeholder="40%"
                        />
                        <input
                          type="text"
                          value={description || ''}
                          onChange={e =>
                            setFormData(prev => ({
                              ...prev,
                              caseStudyOutcomes: {
                                ...prev.caseStudyOutcomes,
                                [selectedCaseStudy.id]: {
                                  ...prev.caseStudyOutcomes?.[selectedCaseStudy.id],
                                  [k]: {
                                    ...prev.caseStudyOutcomes?.[selectedCaseStudy.id]?.[k],
                                    description: e.target.value,
                                  },
                                },
                              },
                            }))
                          }
                          className="flex-1 px-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                          placeholder="Reduction in defects"
                        />
                        <button
                          onClick={() => {
                            setFormData(prev => {
                              const curr = { ...prev.caseStudyOutcomes?.[selectedCaseStudy.id] }
                              delete curr[k]
                              const remaining = Object.values(curr)
                              const renumbered = {}
                              remaining.forEach((val, i) => {
                                renumbered[`o${i + 1}`] = val
                              })
                              return {
                                ...prev,
                                caseStudyOutcomes: {
                                  ...prev.caseStudyOutcomes,
                                  [selectedCaseStudy.id]:
                                    Object.keys(renumbered).length > 0
                                      ? renumbered
                                      : { o1: { metric: '', description: '' } },
                                },
                              }
                            })
                          }}
                          className="p-3 text-red-400 hover:bg-red-500/10 rounded-lg"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))
                  })()}
                  <button
                    onClick={() =>
                      setFormData(prev => {
                        const curr = prev.caseStudyOutcomes?.[selectedCaseStudy.id] || {}
                        const n = Object.keys(curr).length + 1
                        return {
                          ...prev,
                          caseStudyOutcomes: {
                            ...prev.caseStudyOutcomes,
                            [selectedCaseStudy.id]: {
                              ...curr,
                              [`o${n}`]: { metric: '', description: '' },
                            },
                          },
                        }
                      })
                    }
                    className="text-sm text-primary-400 hover:text-primary-300"
                  >
                    + Add Outcome
                  </button>
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-12 gap-4 pt-4 border-t border-white/10">
                <div className="col-span-6 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                  <input
                    type="number"
                    value={selectedCaseStudy.order || 0}
                    onChange={e =>
                      updateField(
                        'caseStudies',
                        selectedCaseStudy.id,
                        'order',
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    min={0}
                  />
                </div>
                <div className="col-span-6 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <label className="flex items-center gap-3 h-[46px] px-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10">
                    <input
                      type="checkbox"
                      checked={selectedCaseStudy.active !== false}
                      onChange={e =>
                        updateField('caseStudies', selectedCaseStudy.id, 'active', e.target.checked)
                      }
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-600"
                    />
                    <span className="text-sm text-gray-300">Active</span>
                  </label>
                </div>
              </div>

              {/* Delete */}
              <div className="pt-6 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => deleteItem('caseStudies', selectedCaseStudy.id)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Case Study
                </button>
              </div>
            </div>
          )}
        </MasterDetailLayout>
      )}

      {/* Industries Tab - Grid Layout */}
      {activeTab === 'industries' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => addItem('industries')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Industry
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {industriesArray.map(industry => (
              <FormCard key={industry.id} className="relative">
                {industry.active === false && (
                  <span className="absolute top-4 right-4 px-2 py-1 text-xs bg-gray-600/50 text-gray-300 rounded">
                    Inactive
                  </span>
                )}
                <div className="grid grid-cols-12 gap-4">
                  <ValidatedInput
                    wrapperClassName="col-span-12"
                    label="Industry Name"
                    value={industry.name || ''}
                    onChange={v => updateField('industries', industry.id, 'name', v)}
                    maxLength={CHAR_LIMITS.industry.name}
                    placeholder="Automotive"
                    required
                  />
                  <ValidatedTextarea
                    wrapperClassName="col-span-12"
                    label="Description"
                    value={industry.description || ''}
                    onChange={v => updateField('industries', industry.id, 'description', v)}
                    maxLength={CHAR_LIMITS.industry.description}
                    placeholder="We've helped automotive companies..."
                    rows={2}
                  />
                  <div className="col-span-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Projects</label>
                    <input
                      type="text"
                      value={industry.projects || ''}
                      onChange={e =>
                        updateField('industries', industry.id, 'projects', e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="1,800+"
                    />
                  </div>
                  <div className="col-span-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                    <input
                      type="number"
                      value={industry.order || 0}
                      onChange={e =>
                        updateField(
                          'industries',
                          industry.id,
                          'order',
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                      min={0}
                    />
                  </div>
                  <div className="col-span-12 flex items-center justify-between pt-4 border-t border-white/10">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={industry.active !== false}
                        onChange={e =>
                          updateField('industries', industry.id, 'active', e.target.checked)
                        }
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-600"
                      />
                      <span className="text-sm text-gray-300">Active</span>
                    </label>
                    <button
                      onClick={() => deleteItem('industries', industry.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </FormCard>
            ))}
            {industriesArray.length === 0 && (
              <div className="col-span-2 text-center py-12 text-gray-400">
                No industries yet. Click "Add Industry" to get started.
              </div>
            )}
          </div>
        </div>
      )}

      <SaveBar
        isDirty={isDirty}
        hasErrors={hasErrors}
        onSave={handleSave}
        onDiscard={handleDiscard}
        isSaving={saveMutation.isPending}
        lastEditedBy={servicesData?._metadata?.updatedBy}
        lastEditedAt={servicesData?._metadata?.updatedAt}
      />
    </div>
  )
}

import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ref, get, update, remove } from 'firebase/database'
import { db } from '../../../../services/firebase'
import { ValidatedInput } from '../components/ValidatedInput'
import { ValidatedTextarea } from '../components/ValidatedTextarea'
import { FormCard } from '../components/FormCard'
import { SaveBar } from '../components/SaveBar'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast, getErrorMessage } from '../hooks/useToast'

const TABS = [
  { id: 'company', label: 'Company Info', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { id: 'contact', label: 'Contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { id: 'social', label: 'Social Links', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
  { id: 'accreditations', label: 'Accreditations', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
]

const CHAR_LIMITS = {
  name: 50,
  tagline: 100,
  shortTagline: 30,
  description: 250,
  email: 100,
  phone: 30,
  address: 150,
  socialName: 30,
  socialUrl: 200,
  accreditationName: 50,
}

export function GlobalEditor() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()
  const [activeTab, setActiveTab] = useState('company')
  const [formData, setFormData] = useState({
    companyInfo: {},
    contact: {},
    socialLinks: {},
    accreditations: {},
  })
  const [initialData, setInitialData] = useState({
    companyInfo: {},
    contact: {},
    socialLinks: {},
    accreditations: {},
  })
  const [expandedItems, setExpandedItems] = useState({})

  // Fetch global data
  const { data, isLoading } = useQuery({
    queryKey: ['siteContent', 'global'],
    queryFn: async () => {
      const snapshot = await get(ref(db, 'siteContent/global'))
      return snapshot.exists() ? snapshot.val() : {}
    },
    staleTime: 5 * 60 * 1000,
  })

  // Initialize form data
  useEffect(() => {
    if (data) {
      const normalized = {
        companyInfo: data.companyInfo || {},
        contact: data.contact || {},
        socialLinks: data.socialLinks || {},
        accreditations: data.accreditations || {},
      }
      setFormData(normalized)
      setInitialData(normalized)
    }
  }, [data])

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (newData) => {
      await update(ref(db, 'siteContent/global'), newData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent', 'global'] })
      queryClient.invalidateQueries({ queryKey: ['global'] })
    },
  })

  // Delete mutation for nested items
  const deleteMutation = useMutation({
    mutationFn: async ({ path }) => {
      await remove(ref(db, `siteContent/global/${path}`))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent', 'global'] })
      queryClient.invalidateQueries({ queryKey: ['global'] })
    },
  })

  // Check if dirty
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialData)
  }, [formData, initialData])

  // Validation
  const hasErrors = useMemo(() => {
    const { companyInfo, contact, socialLinks, accreditations } = formData
    if (String(companyInfo.name || '').length > CHAR_LIMITS.name) return true
    if (String(companyInfo.tagline || '').length > CHAR_LIMITS.tagline) return true
    if (String(companyInfo.shortTagline || '').length > CHAR_LIMITS.shortTagline) return true
    if (String(companyInfo.description || '').length > CHAR_LIMITS.description) return true
    if (String(contact.email || '').length > CHAR_LIMITS.email) return true
    if (String(contact.phone || '').length > CHAR_LIMITS.phone) return true
    if (String(contact.address || '').length > CHAR_LIMITS.address) return true
    for (const link of Object.values(socialLinks || {})) {
      if (String(link.name || '').length > CHAR_LIMITS.socialName) return true
      if (String(link.url || '').length > CHAR_LIMITS.socialUrl) return true
    }
    for (const acc of Object.values(accreditations || {})) {
      if (String(acc.name || '').length > CHAR_LIMITS.accreditationName) return true
    }
    return false
  }, [formData])

  // Update helpers
  const updateCompanyField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      companyInfo: { ...prev.companyInfo, [field]: value },
    }))
  }

  const updateContactField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }))
  }

  const updateSocialLink = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [id]: { ...prev.socialLinks[id], [field]: value },
      },
    }))
  }

  const updateAccreditation = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      accreditations: {
        ...prev.accreditations,
        [id]: { ...prev.accreditations[id], [field]: value },
      },
    }))
  }

  // Add/Delete helpers
  const addSocialLink = () => {
    const id = `social_${Date.now()}`
    const items = Object.values(formData.socialLinks || {})
    const newOrder = items.length > 0 ? Math.max(...items.map(i => i.order || 0)) + 1 : 1
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [id]: { name: '', url: '', order: newOrder },
      },
    }))
    setExpandedItems(prev => ({ ...prev, [id]: true }))
  }

  const deleteSocialLink = async (id) => {
    if (!window.confirm('Delete this social link?')) return
    if (initialData.socialLinks?.[id]) {
      await deleteMutation.mutateAsync({ path: `socialLinks/${id}` })
    }
    setFormData(prev => {
      const newLinks = { ...prev.socialLinks }
      delete newLinks[id]
      return { ...prev, socialLinks: newLinks }
    })
    setInitialData(prev => {
      const newLinks = { ...prev.socialLinks }
      delete newLinks[id]
      return { ...prev, socialLinks: newLinks }
    })
  }

  const addAccreditation = () => {
    const id = `accred_${Date.now()}`
    const items = Object.values(formData.accreditations || {})
    const newOrder = items.length > 0 ? Math.max(...items.map(i => i.order || 0)) + 1 : 1
    setFormData(prev => ({
      ...prev,
      accreditations: {
        ...prev.accreditations,
        [id]: { name: '', order: newOrder },
      },
    }))
  }

  const deleteAccreditation = async (id) => {
    if (!window.confirm('Delete this accreditation?')) return
    if (initialData.accreditations?.[id]) {
      await deleteMutation.mutateAsync({ path: `accreditations/${id}` })
    }
    setFormData(prev => {
      const newAccs = { ...prev.accreditations }
      delete newAccs[id]
      return { ...prev, accreditations: newAccs }
    })
    setInitialData(prev => {
      const newAccs = { ...prev.accreditations }
      delete newAccs[id]
      return { ...prev, accreditations: newAccs }
    })
  }

  // Save/Discard
  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync(formData)
      setInitialData(formData)
      success('Global settings saved successfully!')
    } catch (err) {
      error(getErrorMessage(err))
      console.error('Failed to save:', err)
    }
  }

  const handleDiscard = () => {
    setFormData(initialData)
  }

  const toggleItem = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Get sorted arrays
  const getSocialLinksArray = () => {
    return Object.entries(formData.socialLinks || {})
      .map(([id, item]) => ({ id, ...item }))
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }

  const getAccreditationsArray = () => {
    return Object.entries(formData.accreditations || {})
      .map(([id, item]) => ({ id, ...(typeof item === 'string' ? { name: item } : item) }))
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }

  // Render Company Tab
  const renderCompanyTab = () => (
    <FormCard title="Company Information" description="Basic company details shown across the site">
      <div className="space-y-4">
        <ValidatedInput
          label="Company Name"
          value={formData.companyInfo?.name || ''}
          onChange={(v) => updateCompanyField('name', v)}
          maxLength={CHAR_LIMITS.name}
          placeholder="AIQM India"
          required
        />
        <ValidatedInput
          label="Tagline"
          value={formData.companyInfo?.tagline || ''}
          onChange={(v) => updateCompanyField('tagline', v)}
          maxLength={CHAR_LIMITS.tagline}
          placeholder="India's Leading Institute for Lean Six Sigma"
        />
        <ValidatedInput
          label="Short Tagline (for navigation)"
          value={formData.companyInfo?.shortTagline || ''}
          onChange={(v) => updateCompanyField('shortTagline', v)}
          maxLength={CHAR_LIMITS.shortTagline}
          placeholder="Quality Excellence"
        />
        <ValidatedTextarea
          label="Description"
          value={formData.companyInfo?.description || ''}
          onChange={(v) => updateCompanyField('description', v)}
          maxLength={CHAR_LIMITS.description}
          placeholder="Leading provider of quality management training..."
          rows={3}
        />
        <div className="grid grid-cols-2 gap-4">
          <ValidatedInput
            label="Established Year"
            value={String(formData.companyInfo?.establishedYear || '')}
            onChange={(v) => updateCompanyField('establishedYear', parseInt(v) || '')}
            type="number"
            placeholder="1998"
          />
          <ValidatedInput
            label="Copyright Year"
            value={String(formData.companyInfo?.copyrightYear || '')}
            onChange={(v) => updateCompanyField('copyrightYear', parseInt(v) || '')}
            type="number"
            placeholder={String(new Date().getFullYear())}
          />
        </div>
      </div>
    </FormCard>
  )

  // Render Contact Tab
  const renderContactTab = () => (
    <FormCard title="Contact Information" description="Contact details shown in the footer">
      <div className="space-y-4">
        <ValidatedInput
          label="Email"
          value={formData.contact?.email || ''}
          onChange={(v) => updateContactField('email', v)}
          maxLength={CHAR_LIMITS.email}
          placeholder="info@aiqmindia.com"
          type="email"
        />
        <ValidatedInput
          label="Phone"
          value={formData.contact?.phone || ''}
          onChange={(v) => updateContactField('phone', v)}
          maxLength={CHAR_LIMITS.phone}
          placeholder="+91 98765 43210"
        />
        <ValidatedInput
          label="Address"
          value={formData.contact?.address || ''}
          onChange={(v) => updateContactField('address', v)}
          maxLength={CHAR_LIMITS.address}
          placeholder="Mumbai, Maharashtra, India"
        />
      </div>
    </FormCard>
  )

  // Render Social Links Tab
  const renderSocialTab = () => {
    const items = getSocialLinksArray()
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400 text-sm">Social media links shown in the footer</p>
          <button
            onClick={addSocialLink}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Social Link
          </button>
        </div>

        {items.map((link) => (
          <div key={link.id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleItem(link.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-white">{link.name || 'New Social Link'}</span>
              </div>
              <motion.svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                animate={{ rotate: expandedItems[link.id] ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {expandedItems[link.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 border-t border-white/10 pt-6 space-y-4">
                    <ValidatedInput
                      label="Platform Name"
                      value={link.name || ''}
                      onChange={(v) => updateSocialLink(link.id, 'name', v)}
                      maxLength={CHAR_LIMITS.socialName}
                      placeholder="e.g., facebook, linkedin, twitter"
                    />
                    <ValidatedInput
                      label="URL"
                      value={link.url || ''}
                      onChange={(v) => updateSocialLink(link.id, 'url', v)}
                      maxLength={CHAR_LIMITS.socialUrl}
                      placeholder="https://facebook.com/yourpage"
                    />
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-400">Order:</label>
                        <input
                          type="number"
                          value={link.order || 0}
                          onChange={(e) => updateSocialLink(link.id, 'order', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm"
                          min={0}
                        />
                      </div>
                      <button
                        onClick={() => deleteSocialLink(link.id)}
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
          <div className="text-center py-12 text-gray-400 bg-white/5 rounded-2xl border border-white/10">
            No social links yet. Click "Add Social Link" to get started.
          </div>
        )}
      </div>
    )
  }

  // Render Accreditations Tab
  const renderAccreditationsTab = () => {
    const items = getAccreditationsArray()
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400 text-sm">Accreditation badges shown in the footer</p>
          <button
            onClick={addAccreditation}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Accreditation
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((acc) => (
            <div key={acc.id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={acc.name || ''}
                  onChange={(e) => updateAccreditation(acc.id, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  placeholder="e.g., ISO 9001"
                />
                <input
                  type="number"
                  value={acc.order || 0}
                  onChange={(e) => updateAccreditation(acc.id, 'order', parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  placeholder="#"
                  min={0}
                />
                <button
                  onClick={() => deleteAccreditation(acc.id)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-white/5 rounded-2xl border border-white/10">
            No accreditations yet. Click "Add Accreditation" to get started.
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Global Settings</h1>
          <p className="text-gray-400 mt-1">Manage site-wide settings</p>
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
      <div>
        <h1 className="text-2xl font-bold text-white">Global Settings</h1>
        <p className="text-gray-400 mt-1">Manage company info, contact details, social links, and accreditations</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
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
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'company' && renderCompanyTab()}
      {activeTab === 'contact' && renderContactTab()}
      {activeTab === 'social' && renderSocialTab()}
      {activeTab === 'accreditations' && renderAccreditationsTab()}

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

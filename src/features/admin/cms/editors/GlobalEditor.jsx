import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ref, get, update, remove } from 'firebase/database'
import { db } from '../../../../services/firebase'
import { ValidatedInput } from '../components/ValidatedInput'
import { ValidatedTextarea } from '../components/ValidatedTextarea'
import { FormCard } from '../components/FormCard'
import { SaveBar } from '../components/SaveBar'
import { MasterDetailLayout } from '../components/MasterDetailLayout'
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
  enquiryLink: 200,
}

export function GlobalEditor() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()
  const [activeTab, setActiveTab] = useState('company')
  const [selectedSocialId, setSelectedSocialId] = useState(null)
  const [selectedAccreditationId, setSelectedAccreditationId] = useState(null)
  const [formData, setFormData] = useState({
    companyInfo: {},
    contact: {},
    socialLinks: {},
    accreditations: {},
    enquiryLink: '',
    features: { enableThemeSwitcher: false },
  })
  const [initialData, setInitialData] = useState({
    companyInfo: {},
    contact: {},
    socialLinks: {},
    accreditations: {},
    enquiryLink: '',
    features: { enableThemeSwitcher: false },
  })

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
        enquiryLink: data.enquiryLink || '',
        features: data.features || { enableThemeSwitcher: false },
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

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ path }) => {
      await remove(ref(db, `siteContent/global/${path}`))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent', 'global'] })
      queryClient.invalidateQueries({ queryKey: ['global'] })
    },
  })

  const isDirty = useMemo(() => JSON.stringify(formData) !== JSON.stringify(initialData), [formData, initialData])

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
    if (String(formData.enquiryLink || '').length > CHAR_LIMITS.enquiryLink) return true
    return false
  }, [formData])

  // Update helpers
  const updateCompanyField = (field, value) => setFormData(prev => ({ ...prev, companyInfo: { ...prev.companyInfo, [field]: value } }))
  const updateContactField = (field, value) => setFormData(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }))
  const updateSocialLink = (id, field, value) => setFormData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [id]: { ...prev.socialLinks[id], [field]: value } } }))
  const updateAccreditation = (id, field, value) => setFormData(prev => ({ ...prev, accreditations: { ...prev.accreditations, [id]: { ...prev.accreditations[id], [field]: value } } }))

  // Add/Delete helpers
  const addSocialLink = () => {
    const id = `social_${Date.now()}`
    const items = Object.values(formData.socialLinks || {})
    const newOrder = items.length > 0 ? Math.max(...items.map(i => i.order || 0)) + 1 : 1
    setFormData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [id]: { name: '', url: '', order: newOrder } } }))
    setSelectedSocialId(id)
  }

  const deleteSocialLink = async (id) => {
    if (!window.confirm('Delete this social link?')) return
    if (initialData.socialLinks?.[id]) await deleteMutation.mutateAsync({ path: `socialLinks/${id}` })
    if (selectedSocialId === id) setSelectedSocialId(null)
    setFormData(prev => { const n = { ...prev.socialLinks }; delete n[id]; return { ...prev, socialLinks: n } })
    setInitialData(prev => { const n = { ...prev.socialLinks }; delete n[id]; return { ...prev, socialLinks: n } })
  }

  const addAccreditation = () => {
    const id = `accred_${Date.now()}`
    const items = Object.values(formData.accreditations || {})
    const newOrder = items.length > 0 ? Math.max(...items.map(i => i.order || 0)) + 1 : 1
    setFormData(prev => ({ ...prev, accreditations: { ...prev.accreditations, [id]: { name: '', order: newOrder } } }))
    setSelectedAccreditationId(id)
  }

  const deleteAccreditation = async (id) => {
    if (!window.confirm('Delete this accreditation?')) return
    if (initialData.accreditations?.[id]) await deleteMutation.mutateAsync({ path: `accreditations/${id}` })
    if (selectedAccreditationId === id) setSelectedAccreditationId(null)
    setFormData(prev => { const n = { ...prev.accreditations }; delete n[id]; return { ...prev, accreditations: n } })
    setInitialData(prev => { const n = { ...prev.accreditations }; delete n[id]; return { ...prev, accreditations: n } })
  }

  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync(formData)
      setInitialData(formData)
      success('Global settings saved!')
    } catch (err) {
      error(getErrorMessage(err))
    }
  }

  const handleDiscard = () => setFormData(initialData)

  // Arrays
  const socialLinksArray = useMemo(() => {
    return Object.entries(formData.socialLinks || {}).map(([id, item]) => ({ id, ...item })).sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [formData.socialLinks])

  const accreditationsArray = useMemo(() => {
    return Object.entries(formData.accreditations || {}).map(([id, item]) => ({ id, ...(typeof item === 'string' ? { name: item } : item) })).sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [formData.accreditations])

  const selectedSocial = useMemo(() => {
    if (!selectedSocialId || !formData.socialLinks[selectedSocialId]) return null
    return { id: selectedSocialId, ...formData.socialLinks[selectedSocialId] }
  }, [selectedSocialId, formData.socialLinks])

  const selectedAccreditation = useMemo(() => {
    if (!selectedAccreditationId || !formData.accreditations[selectedAccreditationId]) return null
    const acc = formData.accreditations[selectedAccreditationId]
    return { id: selectedAccreditationId, ...(typeof acc === 'string' ? { name: acc } : acc) }
  }, [selectedAccreditationId, formData.accreditations])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-white">Global Settings</h1><p className="text-gray-400 mt-1">Manage site-wide settings</p></div>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse"><div className="h-6 w-48 bg-white/10 rounded" /></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-24">
      <div><h1 className="text-2xl font-bold text-white">Global Settings</h1><p className="text-gray-400 mt-1">Manage company info, contact details, social links, and accreditations</p></div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Company Tab */}
      {activeTab === 'company' && (
        <FormCard title="Company Information" description="Basic company details shown across the site">
          <div className="grid grid-cols-12 gap-4">
            <ValidatedInput wrapperClassName="col-span-12 lg:col-span-6" label="Company Name" value={formData.companyInfo?.name || ''} onChange={(v) => updateCompanyField('name', v)} maxLength={CHAR_LIMITS.name} placeholder="AIQM India" required />
            <ValidatedInput wrapperClassName="col-span-12 lg:col-span-6" label="Tagline" value={formData.companyInfo?.tagline || ''} onChange={(v) => updateCompanyField('tagline', v)} maxLength={CHAR_LIMITS.tagline} placeholder="India's Leading Institute for Lean Six Sigma" />
            <ValidatedInput wrapperClassName="col-span-12 lg:col-span-6" label="Short Tagline (navigation)" value={formData.companyInfo?.shortTagline || ''} onChange={(v) => updateCompanyField('shortTagline', v)} maxLength={CHAR_LIMITS.shortTagline} placeholder="Quality Excellence" />
            <div className="col-span-6 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-300 mb-2">Established Year</label>
              <input type="number" value={String(formData.companyInfo?.establishedYear || '')} onChange={(e) => updateCompanyField('establishedYear', parseInt(e.target.value) || '')} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500" placeholder="1998" />
            </div>
            <div className="col-span-6 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-300 mb-2">Copyright Year</label>
              <input type="number" value={String(formData.companyInfo?.copyrightYear || '')} onChange={(e) => updateCompanyField('copyrightYear', parseInt(e.target.value) || '')} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500" placeholder={String(new Date().getFullYear())} />
            </div>
            <ValidatedTextarea wrapperClassName="col-span-12" label="Description" value={formData.companyInfo?.description || ''} onChange={(v) => updateCompanyField('description', v)} maxLength={CHAR_LIMITS.description} placeholder="Leading provider of quality management training..." rows={3} />

            {/* Enquiry Link */}
            <div className="col-span-12 pt-4 border-t border-white/10">
              <ValidatedInput label="Enquiry Form Link" value={formData.enquiryLink || ''} onChange={(v) => setFormData(prev => ({ ...prev, enquiryLink: v }))} maxLength={CHAR_LIMITS.enquiryLink} placeholder="https://forms.gle/..." type="url" />
              <p className="text-xs text-gray-500 mt-1">Used for all "Enroll Now" and "Request Consultation" buttons</p>
            </div>

            {/* Theme Switcher Toggle */}
            <div className="col-span-12 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div><label className="text-sm font-medium text-white">Theme Switcher</label><p className="text-xs text-gray-400">Allow users to change color theme in navigation</p></div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.features?.enableThemeSwitcher || false} onChange={(e) => setFormData(prev => ({ ...prev, features: { ...prev.features, enableThemeSwitcher: e.target.checked } }))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </div>
        </FormCard>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <FormCard title="Contact Information" description="Contact details shown in the footer">
          <div className="grid grid-cols-12 gap-4">
            <ValidatedInput wrapperClassName="col-span-12 lg:col-span-6" label="Email" value={formData.contact?.email || ''} onChange={(v) => updateContactField('email', v)} maxLength={CHAR_LIMITS.email} placeholder="info@aiqmindia.com" type="email" />
            <ValidatedInput wrapperClassName="col-span-12 lg:col-span-6" label="Phone" value={formData.contact?.phone || ''} onChange={(v) => updateContactField('phone', v)} maxLength={CHAR_LIMITS.phone} placeholder="+91 98765 43210" />
            <ValidatedInput wrapperClassName="col-span-12" label="Address" value={formData.contact?.address || ''} onChange={(v) => updateContactField('address', v)} maxLength={CHAR_LIMITS.address} placeholder="Mumbai, Maharashtra, India" />
          </div>
        </FormCard>
      )}

      {/* Social Links Tab - Master-Detail */}
      {activeTab === 'social' && (
        <MasterDetailLayout
          items={socialLinksArray}
          selectedId={selectedSocialId}
          onSelect={setSelectedSocialId}
          renderListItemMeta={(link) => <p className="text-xs text-gray-500 truncate">{link.url || 'No URL'}</p>}
          emptyMessage="No social links yet"
          addButton={{ label: 'Add Link', onClick: addSocialLink }}
          detailTitle={selectedSocial?.name || 'New Social Link'}
        >
          {selectedSocial && (
            <div className="space-y-6">
              <div className="grid grid-cols-12 gap-4">
                <ValidatedInput wrapperClassName="col-span-12" label="Platform Name" value={selectedSocial.name || ''} onChange={(v) => updateSocialLink(selectedSocial.id, 'name', v)} maxLength={CHAR_LIMITS.socialName} placeholder="e.g., facebook, linkedin, twitter" />
                <ValidatedInput wrapperClassName="col-span-12" label="URL" value={selectedSocial.url || ''} onChange={(v) => updateSocialLink(selectedSocial.id, 'url', v)} maxLength={CHAR_LIMITS.socialUrl} placeholder="https://facebook.com/yourpage" type="url" />
                <div className="col-span-6 lg:col-span-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                  <input type="number" value={selectedSocial.order || 0} onChange={(e) => updateSocialLink(selectedSocial.id, 'order', parseInt(e.target.value) || 0)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500" min={0} />
                </div>
              </div>

              {/* Info */}
              <div className="bg-primary-600/10 border border-primary-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div>
                    <p className="text-sm text-primary-300 font-medium">Platform Icons</p>
                    <p className="text-xs text-primary-400/70 mt-1">Supported platforms: facebook, twitter, linkedin, instagram, youtube, whatsapp. The icon is auto-detected from the name.</p>
                  </div>
                </div>
              </div>

              {/* Delete */}
              <div className="pt-6 border-t border-white/10 flex justify-end">
                <button onClick={() => deleteSocialLink(selectedSocial.id)} className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Delete Link
                </button>
              </div>
            </div>
          )}
        </MasterDetailLayout>
      )}

      {/* Accreditations Tab - Master-Detail */}
      {activeTab === 'accreditations' && (
        <MasterDetailLayout
          items={accreditationsArray}
          selectedId={selectedAccreditationId}
          onSelect={setSelectedAccreditationId}
          renderListItemMeta={(acc) => <p className="text-xs text-gray-500">Order: {acc.order || 0}</p>}
          emptyMessage="No accreditations yet"
          addButton={{ label: 'Add Accreditation', onClick: addAccreditation }}
          detailTitle={selectedAccreditation?.name || 'New Accreditation'}
        >
          {selectedAccreditation && (
            <div className="space-y-6">
              <div className="grid grid-cols-12 gap-4">
                <ValidatedInput
                  wrapperClassName="col-span-12"
                  label="Accreditation Name"
                  value={selectedAccreditation.name || ''}
                  onChange={(v) => updateAccreditation(selectedAccreditation.id, 'name', v)}
                  maxLength={CHAR_LIMITS.accreditationName}
                  placeholder="e.g., ISO 9001"
                  required
                />
                <div className="col-span-6 lg:col-span-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                  <input
                    type="number"
                    value={selectedAccreditation.order || 0}
                    onChange={(e) => updateAccreditation(selectedAccreditation.id, 'order', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    min={0}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="bg-accent-600/10 border border-accent-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-accent-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <div>
                    <p className="text-sm text-accent-300 font-medium">Accreditation Badges</p>
                    <p className="text-xs text-accent-400/70 mt-1">These badges are displayed in the website footer as trust indicators. Use common accreditation names like ISO 9001, IRCA, etc.</p>
                  </div>
                </div>
              </div>

              {/* Delete */}
              <div className="pt-6 border-t border-white/10 flex justify-end">
                <button onClick={() => deleteAccreditation(selectedAccreditation.id)} className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Delete Accreditation
                </button>
              </div>
            </div>
          )}
        </MasterDetailLayout>
      )}

      <SaveBar isDirty={isDirty} hasErrors={hasErrors} onSave={handleSave} onDiscard={handleDiscard} isSaving={saveMutation.isPending} />
    </div>
  )
}

import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ref, get } from 'firebase/database'
import { db } from '../../../../services/firebase'
import { ValidatedInput } from '../components/ValidatedInput'
import { ValidatedTextarea } from '../components/ValidatedTextarea'
import { FormCard } from '../components/FormCard'
import { SaveBar } from '../components/SaveBar'
import { useToast, getErrorMessage } from '../hooks/useToast'
import { useAuditedSave, getMetadataTimestamp } from '../hooks/useAuditedSave'

// Available CTA banner pages
const PAGES = [
  { id: 'courses', label: 'Courses Page', description: 'CTA banner on the courses page' },
  {
    id: 'certifications',
    label: 'Certifications Page',
    description: 'CTA banner on the certifications page',
  },
]

const CHAR_LIMITS = {
  headline: 80,
  subheadline: 150,
  ctaText: 30,
  ctaLink: 200,
  batchInfo: 50,
  trustIndicator: 50,
}

const DEFAULT_DATA = {
  headline: '',
  subheadline: '',
  primaryCtaText: '',
  primaryCtaLink: '',
  secondaryCtaText: '',
  secondaryCtaLink: '',
  batchInfo: '',
  trustIndicator1: '',
  trustIndicator2: '',
  trustIndicator3: '',
}

export function CTABannersEditor() {
  const { success, error } = useToast()
  const [activePage, setActivePage] = useState('courses')
  const [formData, setFormData] = useState({})
  const [initialData, setInitialData] = useState({})
  const [initialTimestamp, setInitialTimestamp] = useState(null)

  // Audited save hook
  const { save, forceSave, isSaving, isConflict } = useAuditedSave('ctaBanners', {
    onSuccess: () => success('CTA banners saved successfully!'),
    onError: err => {
      if (err.code !== 'CONFLICT') {
        error(getErrorMessage(err))
      }
    },
    invalidateKeys: ['ctaBanners'],
  })

  // Fetch CTA banners data
  const { data, isLoading } = useQuery({
    queryKey: ['siteContent', 'ctaBanners'],
    queryFn: async () => {
      const snapshot = await get(ref(db, 'siteContent/ctaBanners'))
      return snapshot.exists() ? snapshot.val() : {}
    },
    staleTime: 5 * 60 * 1000,
  })

  // Initialize form data
  useEffect(() => {
    if (data) {
      // Ensure all pages have default structure
      const normalized = {}
      PAGES.forEach(page => {
        normalized[page.id] = {
          ...DEFAULT_DATA,
          ...(data[page.id] || {}),
        }
      })
      setFormData(normalized)
      setInitialData(normalized)
      setInitialTimestamp(getMetadataTimestamp(data))
    }
  }, [data])

  // Check if dirty
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialData)
  }, [formData, initialData])

  // Validation
  const hasErrors = useMemo(() => {
    for (const pageData of Object.values(formData)) {
      if (String(pageData.headline || '').length > CHAR_LIMITS.headline) return true
      if (String(pageData.subheadline || '').length > CHAR_LIMITS.subheadline) return true
      if (String(pageData.primaryCtaText || '').length > CHAR_LIMITS.ctaText) return true
      if (String(pageData.primaryCtaLink || '').length > CHAR_LIMITS.ctaLink) return true
      if (String(pageData.secondaryCtaText || '').length > CHAR_LIMITS.ctaText) return true
      if (String(pageData.secondaryCtaLink || '').length > CHAR_LIMITS.ctaLink) return true
      if (String(pageData.batchInfo || '').length > CHAR_LIMITS.batchInfo) return true
      if (String(pageData.trustIndicator1 || '').length > CHAR_LIMITS.trustIndicator) return true
      if (String(pageData.trustIndicator2 || '').length > CHAR_LIMITS.trustIndicator) return true
      if (String(pageData.trustIndicator3 || '').length > CHAR_LIMITS.trustIndicator) return true
    }
    return false
  }, [formData])

  // Update field for current page
  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [activePage]: {
        ...prev[activePage],
        [field]: value,
      },
    }))
  }

  // Get current page data
  const currentData = formData[activePage] || DEFAULT_DATA

  // Handle save with optimistic locking
  const handleSave = async () => {
    try {
      await save(formData, initialTimestamp)
      setInitialData(formData)
    } catch (err) {
      if (err.code !== 'CONFLICT') {
        console.error('Failed to save:', err)
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

  const handleDiscard = () => {
    setFormData(initialData)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">CTA Banners</h1>
          <p className="text-gray-400 mt-1">Manage call-to-action banners and batch dates</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse"
            >
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
        <h1 className="text-2xl font-bold text-white">CTA Banners</h1>
        <p className="text-gray-400 mt-1">
          Manage call-to-action banners, batch dates, and promotional content
        </p>
      </div>

      {/* Page Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
        {PAGES.map(page => (
          <button
            key={page.id}
            onClick={() => setActivePage(page.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activePage === page.id
                ? 'bg-primary-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
            {page.label}
          </button>
        ))}
      </div>

      {/* Content & Messaging Section */}
      <FormCard
        title="Content & Messaging"
        description="Main messaging displayed in the CTA banner"
      >
        <div className="grid grid-cols-12 gap-4">
          <ValidatedInput
            wrapperClassName="col-span-12 lg:col-span-8"
            label="Headline"
            value={currentData.headline || ''}
            onChange={v => updateField('headline', v)}
            maxLength={CHAR_LIMITS.headline}
            placeholder="Ready to accelerate your career?"
          />
          <ValidatedInput
            wrapperClassName="col-span-12 lg:col-span-4"
            label="Batch Info"
            value={currentData.batchInfo || ''}
            onChange={v => updateField('batchInfo', v)}
            maxLength={CHAR_LIMITS.batchInfo}
            placeholder="Next batch: Feb 15"
          />
          <ValidatedTextarea
            wrapperClassName="col-span-12"
            label="Subheadline"
            value={currentData.subheadline || ''}
            onChange={v => updateField('subheadline', v)}
            maxLength={CHAR_LIMITS.subheadline}
            placeholder="Join our next batch today and become a certified quality excellence professional!"
            rows={2}
          />
        </div>
      </FormCard>

      {/* Call-to-Action Configuration Section */}
      <FormCard
        title="Call-to-Action Configuration"
        description="Configure action buttons and trust indicators"
      >
        <div className="grid grid-cols-12 gap-4">
          {/* Primary Button */}
          <div className="col-span-12 lg:col-span-6 space-y-4">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full" />
              Primary Button
            </h4>
            <div className="grid grid-cols-12 gap-4">
              <ValidatedInput
                wrapperClassName="col-span-12"
                label="Button Text"
                value={currentData.primaryCtaText || ''}
                onChange={v => updateField('primaryCtaText', v)}
                maxLength={CHAR_LIMITS.ctaText}
                placeholder="Get Started Today"
              />
              <ValidatedInput
                wrapperClassName="col-span-12"
                label="Button Link"
                value={currentData.primaryCtaLink || ''}
                onChange={v => updateField('primaryCtaLink', v)}
                maxLength={CHAR_LIMITS.ctaLink}
                placeholder="https://forms.gle/..."
                type="url"
              />
            </div>
          </div>

          {/* Secondary Button */}
          <div className="col-span-12 lg:col-span-6 space-y-4">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-500 rounded-full" />
              Secondary Button
            </h4>
            <div className="grid grid-cols-12 gap-4">
              <ValidatedInput
                wrapperClassName="col-span-12"
                label="Button Text"
                value={currentData.secondaryCtaText || ''}
                onChange={v => updateField('secondaryCtaText', v)}
                maxLength={CHAR_LIMITS.ctaText}
                placeholder="Talk to Our Advisors"
              />
              <ValidatedInput
                wrapperClassName="col-span-12"
                label="Button Link"
                value={currentData.secondaryCtaLink || ''}
                onChange={v => updateField('secondaryCtaLink', v)}
                maxLength={CHAR_LIMITS.ctaLink}
                placeholder="#contact"
              />
            </div>
          </div>

          {/* Info Note */}
          <p className="col-span-12 text-xs text-gray-500 pt-2 border-t border-white/10">
            Leave primary link empty to use the global enquiry link from Global Settings.
          </p>

          {/* Trust Indicators */}
          <div className="col-span-12 pt-4 border-t border-white/10">
            <h4 className="text-sm font-medium text-white mb-4">Trust Indicators</h4>
            <div className="grid grid-cols-12 gap-4">
              <ValidatedInput
                wrapperClassName="col-span-12 lg:col-span-4"
                label="Trust Indicator 1"
                value={currentData.trustIndicator1 || ''}
                onChange={v => updateField('trustIndicator1', v)}
                maxLength={CHAR_LIMITS.trustIndicator}
                placeholder="Free initial consultation"
              />
              <ValidatedInput
                wrapperClassName="col-span-12 lg:col-span-4"
                label="Trust Indicator 2"
                value={currentData.trustIndicator2 || ''}
                onChange={v => updateField('trustIndicator2', v)}
                maxLength={CHAR_LIMITS.trustIndicator}
                placeholder="No obligation quote"
              />
              <ValidatedInput
                wrapperClassName="col-span-12 lg:col-span-4"
                label="Trust Indicator 3"
                value={currentData.trustIndicator3 || ''}
                onChange={v => updateField('trustIndicator3', v)}
                maxLength={CHAR_LIMITS.trustIndicator}
                placeholder="Flexible engagement models"
              />
            </div>
          </div>
        </div>
      </FormCard>

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

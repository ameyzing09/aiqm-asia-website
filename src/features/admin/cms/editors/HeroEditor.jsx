import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ref, get, update } from 'firebase/database'
import { db } from '../../../../services/firebase'
import { ValidatedInput } from '../components/ValidatedInput'
import { ValidatedTextarea } from '../components/ValidatedTextarea'
import { FormCard } from '../components/FormCard'
import { SaveBar } from '../components/SaveBar'
import { MediaUploader } from '../components/MediaUploader'
import { useToast, getErrorMessage } from '../hooks/useToast'

// Character limits for hero sections
const CHAR_LIMITS = {
  headline: 60,
  highlightText: 80,
  subheadline: 120,
  primaryCtaText: 25,
  secondaryCtaText: 25,
  badge: 30,
}

// Page configurations
const PAGES = [
  { id: 'home', label: 'Home', description: 'Main homepage hero section' },
  { id: 'certifications', label: 'Certifications', description: 'Certifications page header' },
  { id: 'consultancy', label: 'Consultancy', description: 'Consultancy page header' },
  { id: 'about', label: 'About', description: 'About page header' },
]

// Default content for each page
const DEFAULT_CONTENT = {
  home: {
    headline: "India's Leading Institute for",
    highlightText: "Lean Six Sigma & Quality Excellence",
    subheadline: "",
    primaryCtaText: "Explore Courses",
    primaryCtaLink: "/courses",
    secondaryCtaText: "Get Certified",
    secondaryCtaLink: "/certifications",
  },
  certifications: {
    headline: "Globally Recognized",
    highlightText: "Certifications",
    subheadline: "Elevate your career with internationally accredited certifications",
    primaryCtaText: "Get Certified Today",
    primaryCtaLink: "/courses",
    secondaryCtaText: "View Courses",
    secondaryCtaLink: "/courses",
    badge: "Internationally Accredited",
  },
  consultancy: {
    headline: "Driving Business Excellence",
    highlightText: "Through Consultancy",
    subheadline: "Partner with AIQM India to transform your organization",
    primaryCtaText: "Request Consultation",
    primaryCtaLink: "/contact",
    secondaryCtaText: "View Case Studies",
    secondaryCtaLink: "/case-studies",
    badge: "Expert Consulting Services",
  },
  about: {
    headline: "About",
    highlightText: "AIQM India",
    subheadline: "India's most trusted partner for quality management excellence",
    primaryCtaText: "Explore Courses",
    primaryCtaLink: "/courses",
    secondaryCtaText: "Our Services",
    secondaryCtaLink: "/consultancy",
    badge: "Est. 1998",
  },
}

export function HeroEditor() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()
  const [activePage, setActivePage] = useState('home')
  const [formData, setFormData] = useState({})
  const [initialData, setInitialData] = useState({})

  // Fetch hero data for active page
  const { data, isLoading } = useQuery({
    queryKey: ['siteContent', 'heroes', activePage],
    queryFn: async () => {
      const snapshot = await get(ref(db, `siteContent/heroes/${activePage}`))
      return snapshot.exists() ? snapshot.val() : null
    },
    staleTime: 5 * 60 * 1000,
  })

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (newData) => {
      await update(ref(db, `siteContent/heroes/${activePage}`), newData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent', 'heroes', activePage] })
      queryClient.invalidateQueries({ queryKey: ['heroes', activePage] })
    },
  })

  // Initialize form data when Firebase data loads or page changes
  useEffect(() => {
    if (data) {
      setFormData(data)
      setInitialData(data)
    } else {
      // Use defaults if no data
      const defaults = DEFAULT_CONTENT[activePage] || {}
      setFormData(defaults)
      setInitialData(defaults)
    }
  }, [data, activePage])

  // Check if form has changes
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialData)
  }, [formData, initialData])

  // Check for validation errors
  const hasErrors = useMemo(() => {
    if (String(formData.headline || '').length > CHAR_LIMITS.headline) return true
    if (String(formData.highlightText || '').length > CHAR_LIMITS.highlightText) return true
    if (String(formData.subheadline || '').length > CHAR_LIMITS.subheadline) return true
    if (String(formData.primaryCtaText || '').length > CHAR_LIMITS.primaryCtaText) return true
    if (String(formData.secondaryCtaText || '').length > CHAR_LIMITS.secondaryCtaText) return true
    if (String(formData.badge || '').length > CHAR_LIMITS.badge) return true
    return false
  }, [formData])

  // Update a field
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle save
  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync(formData)
      setInitialData(formData)
      success('Hero section saved successfully!')
    } catch (err) {
      error(getErrorMessage(err))
      console.error('Failed to save hero:', err)
    }
  }

  // Handle discard
  const handleDiscard = () => {
    setFormData(initialData)
  }

  // Handle page change (with unsaved changes warning)
  const handlePageChange = (pageId) => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Discard them?')) {
        return
      }
    }
    setActivePage(pageId)
  }

  const currentPageConfig = PAGES.find(p => p.id === activePage)

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Hero Sections</h1>
        <p className="text-gray-400 mt-1">
          Edit hero banners for all pages. The homepage subheadline auto-builds from Stats if left empty.
        </p>
      </div>

      {/* Page Tabs */}
      <div className="flex flex-wrap gap-2">
        {PAGES.map((page) => (
          <button
            key={page.id}
            onClick={() => handlePageChange(page.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activePage === page.id
                ? 'bg-primary-600 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {page.label}
            {activePage === page.id && isDirty && (
              <span className="ml-2 w-2 h-2 bg-amber-400 rounded-full inline-block" />
            )}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
            <div className="h-6 w-40 bg-white/10 rounded mb-4" />
            <div className="space-y-4">
              <div className="h-12 bg-white/10 rounded" />
              <div className="h-12 bg-white/10 rounded" />
              <div className="h-20 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Content Section */}
          <FormCard
            title={`${currentPageConfig?.label} Hero Content`}
            description={currentPageConfig?.description}
          >
            <div className="space-y-4">
              {/* Badge (optional) */}
              {activePage !== 'home' && (
                <ValidatedInput
                  label="Badge Text"
                  value={formData.badge || ''}
                  onChange={(value) => updateField('badge', value)}
                  maxLength={CHAR_LIMITS.badge}
                  placeholder="e.g., Internationally Accredited"
                />
              )}

              {/* Headline */}
              <ValidatedInput
                label="Headline"
                value={formData.headline || ''}
                onChange={(value) => updateField('headline', value)}
                maxLength={CHAR_LIMITS.headline}
                placeholder="Main headline text"
                required
              />

              {/* Highlight Text */}
              <ValidatedInput
                label="Highlight Text"
                value={formData.highlightText || ''}
                onChange={(value) => updateField('highlightText', value)}
                maxLength={CHAR_LIMITS.highlightText}
                placeholder="Colored/emphasized text"
              />

              {/* Subheadline */}
              <ValidatedTextarea
                label={activePage === 'home' ? "Subheadline (leave empty to auto-build from Stats)" : "Subheadline"}
                value={formData.subheadline || ''}
                onChange={(value) => updateField('subheadline', value)}
                maxLength={CHAR_LIMITS.subheadline}
                placeholder={activePage === 'home'
                  ? "Leave empty to show stats automatically"
                  : "Supporting text below the headline"
                }
                rows={2}
              />
            </div>
          </FormCard>

          {/* CTA Section */}
          <FormCard
            title="Call-to-Action Buttons"
            description="Configure the primary and secondary action buttons"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary CTA */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white">Primary Button</h4>
                <ValidatedInput
                  label="Button Text"
                  value={formData.primaryCtaText || ''}
                  onChange={(value) => updateField('primaryCtaText', value)}
                  maxLength={CHAR_LIMITS.primaryCtaText}
                  placeholder="Explore Courses"
                />
                <ValidatedInput
                  label="Link URL"
                  value={formData.primaryCtaLink || ''}
                  onChange={(value) => updateField('primaryCtaLink', value)}
                  maxLength={100}
                  placeholder="/courses"
                  type="url"
                />
              </div>

              {/* Secondary CTA */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white">Secondary Button</h4>
                <ValidatedInput
                  label="Button Text"
                  value={formData.secondaryCtaText || ''}
                  onChange={(value) => updateField('secondaryCtaText', value)}
                  maxLength={CHAR_LIMITS.secondaryCtaText}
                  placeholder="Get Certified"
                />
                <ValidatedInput
                  label="Link URL"
                  value={formData.secondaryCtaLink || ''}
                  onChange={(value) => updateField('secondaryCtaLink', value)}
                  maxLength={100}
                  placeholder="/certifications"
                  type="url"
                />
              </div>
            </div>
          </FormCard>

          {/* Hero Image Section - only for about/consultancy pages */}
          {(activePage === 'about' || activePage === 'consultancy') && (
            <FormCard
              title="Hero Image"
              description="Upload an image for the hero section (4:3 aspect ratio recommended)"
            >
              <MediaUploader
                value={formData.heroImage || ''}
                onUpload={(url) => updateField('heroImage', url)}
                storagePath={`heroes/${activePage}`}
                label="Hero Image"
              />
            </FormCard>
          )}

          {/* Preview Section */}
          <FormCard
            title="Preview"
            description="Live preview of your hero section"
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 text-center">
              {formData.badge && (
                <span className="inline-block px-3 py-1 text-xs font-medium bg-primary-600/20 text-primary-400 rounded-full mb-4">
                  {formData.badge}
                </span>
              )}
              <h2 className="text-2xl font-bold text-white mb-2">
                {formData.headline || 'Headline'}
                <br />
                <span className="text-primary-400">
                  {formData.highlightText || 'Highlight Text'}
                </span>
              </h2>
              <p className="text-gray-400 text-sm mb-4 max-w-md mx-auto">
                {formData.subheadline || (activePage === 'home' ? '(Auto-built from stats)' : 'Subheadline')}
              </p>
              <div className="flex gap-2 justify-center">
                <span className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg">
                  {formData.primaryCtaText || 'Primary CTA'}
                </span>
                <span className="px-4 py-2 bg-white/10 text-white text-sm rounded-lg">
                  {formData.secondaryCtaText || 'Secondary CTA'}
                </span>
              </div>
            </div>
          </FormCard>
        </>
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

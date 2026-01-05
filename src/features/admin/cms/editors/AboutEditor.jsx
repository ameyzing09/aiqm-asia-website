import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ref, get, update } from 'firebase/database'
import { db } from '../../../../services/firebase'
import { ValidatedInput } from '../components/ValidatedInput'
import { ValidatedTextarea } from '../components/ValidatedTextarea'
import { FormCard } from '../components/FormCard'
import { SaveBar } from '../components/SaveBar'
import { MediaUploader } from '../components/MediaUploader'

// Character limits for about page content
const CHAR_LIMITS = {
  sectionTitle: 60,
  sectionSubtitle: 120,
  storyParagraph: 400,
  missionStatement: 300,
  visionStatement: 300,
  directorsMessage: 500,
  directorsName: 50,
  directorsTitle: 60,
  foundingYear: 4,
  tagline: 80,
}

// Default content structure
const DEFAULT_CONTENT = {
  storyImage: '',
  globalMapImage: '',
  story: {
    title: 'Our Story',
    subtitle: 'From humble beginnings to becoming India\'s premier quality excellence institute',
    paragraph1: 'Founded in 1998 by distinguished alumni from IIT Bombay and IIM Ahmedabad, AIQM India began with a singular vision: to transform quality management practices across India.',
    paragraph2: 'What started as a small training center in Mumbai has grown into India\'s most trusted partner in quality excellence, serving organizations across 13 countries and training over 95,000 professionals.',
    paragraph3: 'Our journey has been marked by continuous innovation, unwavering commitment to excellence, and a deep understanding of the unique challenges faced by Indian organizations in their quest for operational excellence.',
    image: '',
    foundingYear: '1998',
  },
  mission: {
    title: 'Our Mission',
    statement: 'To empower organizations and professionals with world-class quality management skills, enabling them to achieve operational excellence and sustainable growth.',
  },
  vision: {
    title: 'Our Vision',
    statement: 'To be the most trusted partner for quality excellence in Asia, shaping the future of quality management through innovation, expertise, and unwavering commitment to our clients\' success.',
  },
  director: {
    title: 'Director\'s Message',
    message: 'At AIQM India, we believe that quality is not just a practice—it\'s a mindset. Over the past two decades, we have had the privilege of partnering with thousands of organizations on their journey to excellence.',
    name: '',
    designation: 'Founder & Director',
    image: '',
  },
  values: {
    title: 'Our Core Values',
    tagline: 'The principles that guide everything we do',
  },
}

export function AboutEditor() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('story')
  const [formData, setFormData] = useState(DEFAULT_CONTENT)
  const [initialData, setInitialData] = useState(DEFAULT_CONTENT)

  // Fetch about page data
  const { data, isLoading } = useQuery({
    queryKey: ['siteContent', 'about'],
    queryFn: async () => {
      const snapshot = await get(ref(db, 'siteContent/about'))
      return snapshot.exists() ? snapshot.val() : null
    },
    staleTime: 5 * 60 * 1000,
  })

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (newData) => {
      // Save about page content
      await update(ref(db, 'siteContent/about'), newData)

      // CRITICAL: Also save director's message to leadership path
      // useLeadership.js reads from siteContent/leadership/directorsMessage
      if (newData.director?.message) {
        await update(ref(db, 'siteContent/leadership'), {
          directorsMessage: newData.director.message,
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent', 'about'] })
      queryClient.invalidateQueries({ queryKey: ['about'] })
      queryClient.invalidateQueries({ queryKey: ['siteContent', 'leadership'] })
      queryClient.invalidateQueries({ queryKey: ['leadership'] })
    },
  })

  // Initialize form data when Firebase data loads
  useEffect(() => {
    if (data) {
      // Merge with defaults to ensure all fields exist
      const mergedData = {
        storyImage: data.storyImage || DEFAULT_CONTENT.storyImage,
        globalMapImage: data.globalMapImage || DEFAULT_CONTENT.globalMapImage,
        story: { ...DEFAULT_CONTENT.story, ...data.story },
        mission: { ...DEFAULT_CONTENT.mission, ...data.mission },
        vision: { ...DEFAULT_CONTENT.vision, ...data.vision },
        director: { ...DEFAULT_CONTENT.director, ...data.director },
        values: { ...DEFAULT_CONTENT.values, ...data.values },
      }
      setFormData(mergedData)
      setInitialData(mergedData)
    }
  }, [data])

  // Check if form has changes
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialData)
  }, [formData, initialData])

  // Check for validation errors
  const hasErrors = useMemo(() => {
    const story = formData.story || {}
    const mission = formData.mission || {}
    const vision = formData.vision || {}
    const director = formData.director || {}

    if (String(story.paragraph1 || '').length > CHAR_LIMITS.storyParagraph) return true
    if (String(story.paragraph2 || '').length > CHAR_LIMITS.storyParagraph) return true
    if (String(story.paragraph3 || '').length > CHAR_LIMITS.storyParagraph) return true
    if (String(mission.statement || '').length > CHAR_LIMITS.missionStatement) return true
    if (String(vision.statement || '').length > CHAR_LIMITS.visionStatement) return true
    if (String(director.message || '').length > CHAR_LIMITS.directorsMessage) return true

    return false
  }, [formData])

  // Update a nested field
  const updateField = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  // Handle save
  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync(formData)
      setInitialData(formData)
    } catch (error) {
      console.error('Failed to save about content:', error)
    }
  }

  // Handle discard
  const handleDiscard = () => {
    setFormData(initialData)
  }

  // Handle tab change with unsaved changes warning
  const handleTabChange = (tab) => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Switch tabs anyway?')) {
        return
      }
    }
    setActiveTab(tab)
  }

  const tabs = [
    { id: 'story', label: 'Our Story', icon: '📖' },
    { id: 'mission', label: 'Mission & Vision', icon: '🎯' },
    { id: 'director', label: 'Director\'s Message', icon: '👤' },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">About Page</h1>
          <p className="text-gray-400 mt-1">Edit company story, mission, vision, and team</p>
        </div>
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-10 w-32 bg-white/10 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
          <div className="space-y-4">
            <div className="h-6 w-40 bg-white/10 rounded" />
            <div className="h-24 bg-white/10 rounded" />
            <div className="h-24 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">About Page</h1>
        <p className="text-gray-400 mt-1">
          Edit company story, mission, vision, and director's message. Changes sync to the live site.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {activeTab === tab.id && isDirty && (
              <span className="ml-1 w-2 h-2 bg-amber-400 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Story Tab */}
      {activeTab === 'story' && (
        <div className="space-y-6">
          {/* Story Header */}
          <FormCard
            title="Story Section Header"
            description="Title and subtitle for the Our Story section"
          >
            <div className="space-y-4">
              <ValidatedInput
                label="Section Title"
                value={formData.story?.title || ''}
                onChange={(value) => updateField('story', 'title', value)}
                maxLength={CHAR_LIMITS.sectionTitle}
                placeholder="Our Story"
              />
              <ValidatedTextarea
                label="Section Subtitle"
                value={formData.story?.subtitle || ''}
                onChange={(value) => updateField('story', 'subtitle', value)}
                maxLength={CHAR_LIMITS.sectionSubtitle}
                placeholder="From humble beginnings to..."
                rows={2}
              />
              <ValidatedInput
                label="Founding Year"
                value={formData.story?.foundingYear || ''}
                onChange={(value) => updateField('story', 'foundingYear', value)}
                maxLength={CHAR_LIMITS.foundingYear}
                placeholder="1998"
              />
            </div>
          </FormCard>

          {/* Story Content */}
          <FormCard
            title="Story Content"
            description="The main story paragraphs (displayed alongside the image)"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Story Image</label>
                <MediaUploader
                  value={formData.storyImage || ''}
                  onUpload={(url) => setFormData(prev => ({ ...prev, storyImage: url }))}
                  storagePath="about/story"
                />
                <p className="text-xs text-gray-500 mt-2">Recommended: Historical photo or office building (4:3 ratio)</p>
              </div>

              {/* Paragraphs */}
              <div className="space-y-4">
                <ValidatedTextarea
                  label="Paragraph 1 (Founding)"
                  value={formData.story?.paragraph1 || ''}
                  onChange={(value) => updateField('story', 'paragraph1', value)}
                  maxLength={CHAR_LIMITS.storyParagraph}
                  placeholder="Founded in 1998..."
                  rows={4}
                />
                <ValidatedTextarea
                  label="Paragraph 2 (Growth)"
                  value={formData.story?.paragraph2 || ''}
                  onChange={(value) => updateField('story', 'paragraph2', value)}
                  maxLength={CHAR_LIMITS.storyParagraph}
                  placeholder="What started as a small training center..."
                  rows={4}
                />
                <ValidatedTextarea
                  label="Paragraph 3 (Present)"
                  value={formData.story?.paragraph3 || ''}
                  onChange={(value) => updateField('story', 'paragraph3', value)}
                  maxLength={CHAR_LIMITS.storyParagraph}
                  placeholder="Our journey has been marked by..."
                  rows={4}
                />
              </div>
            </div>
          </FormCard>
        </div>
      )}

      {/* Mission & Vision Tab */}
      {activeTab === 'mission' && (
        <div className="space-y-6">
          {/* Mission */}
          <FormCard
            title="Mission Statement"
            description="What drives the organization"
          >
            <div className="space-y-4">
              <ValidatedInput
                label="Section Title"
                value={formData.mission?.title || ''}
                onChange={(value) => updateField('mission', 'title', value)}
                maxLength={CHAR_LIMITS.sectionTitle}
                placeholder="Our Mission"
              />
              <ValidatedTextarea
                label="Mission Statement"
                value={formData.mission?.statement || ''}
                onChange={(value) => updateField('mission', 'statement', value)}
                maxLength={CHAR_LIMITS.missionStatement}
                placeholder="To empower organizations and professionals..."
                rows={4}
              />
            </div>
          </FormCard>

          {/* Vision */}
          <FormCard
            title="Vision Statement"
            description="The future the organization is working towards"
          >
            <div className="space-y-4">
              <ValidatedInput
                label="Section Title"
                value={formData.vision?.title || ''}
                onChange={(value) => updateField('vision', 'title', value)}
                maxLength={CHAR_LIMITS.sectionTitle}
                placeholder="Our Vision"
              />
              <ValidatedTextarea
                label="Vision Statement"
                value={formData.vision?.statement || ''}
                onChange={(value) => updateField('vision', 'statement', value)}
                maxLength={CHAR_LIMITS.visionStatement}
                placeholder="To be the most trusted partner..."
                rows={4}
              />
            </div>
          </FormCard>

          {/* Values Header */}
          <FormCard
            title="Core Values Section"
            description="Header for the values section (values are managed in Stats)"
          >
            <div className="space-y-4">
              <ValidatedInput
                label="Section Title"
                value={formData.values?.title || ''}
                onChange={(value) => updateField('values', 'title', value)}
                maxLength={CHAR_LIMITS.sectionTitle}
                placeholder="Our Core Values"
              />
              <ValidatedInput
                label="Section Tagline"
                value={formData.values?.tagline || ''}
                onChange={(value) => updateField('values', 'tagline', value)}
                maxLength={CHAR_LIMITS.tagline}
                placeholder="The principles that guide everything we do"
              />
            </div>
          </FormCard>

          {/* Global Presence Image */}
          <FormCard
            title="Global Presence Map"
            description="Upload an image for the Global Presence section (world map showing AIQM presence)"
          >
            <MediaUploader
              value={formData.globalMapImage || ''}
              onUpload={(url) => setFormData(prev => ({ ...prev, globalMapImage: url }))}
              storagePath="about/global-map"
              label="Global Map Image"
            />
            <p className="text-xs text-gray-500 mt-2">Recommended: World map highlighting 13 countries (16:9 ratio)</p>
          </FormCard>
        </div>
      )}

      {/* Director's Message Tab */}
      {activeTab === 'director' && (
        <div className="space-y-6">
          <FormCard
            title="Director's Message"
            description="A personal message from the company director"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Director Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Director Photo</label>
                <MediaUploader
                  value={formData.director?.image}
                  onUpload={(url) => updateField('director', 'image', url)}
                  storagePath="about/director"
                />
                <div className="mt-4 space-y-3">
                  <ValidatedInput
                    label="Director's Name"
                    value={formData.director?.name || ''}
                    onChange={(value) => updateField('director', 'name', value)}
                    maxLength={CHAR_LIMITS.directorsName}
                    placeholder="Dr. Rajesh Kumar"
                  />
                  <ValidatedInput
                    label="Designation"
                    value={formData.director?.designation || ''}
                    onChange={(value) => updateField('director', 'designation', value)}
                    maxLength={CHAR_LIMITS.directorsTitle}
                    placeholder="Founder & Director"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="lg:col-span-2 space-y-4">
                <ValidatedInput
                  label="Section Title"
                  value={formData.director?.title || ''}
                  onChange={(value) => updateField('director', 'title', value)}
                  maxLength={CHAR_LIMITS.sectionTitle}
                  placeholder="Director's Message"
                />
                <ValidatedTextarea
                  label="Message"
                  value={formData.director?.message || ''}
                  onChange={(value) => updateField('director', 'message', value)}
                  maxLength={CHAR_LIMITS.directorsMessage}
                  placeholder="At AIQM India, we believe that quality is not just a practice..."
                  rows={8}
                />
              </div>
            </div>
          </FormCard>

          {/* Preview */}
          <FormCard
            title="Preview"
            description="How the director's message will appear"
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {formData.director?.image ? (
                  <img
                    src={formData.director.image}
                    alt={formData.director.name || 'Director'}
                    className="w-32 h-32 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 bg-primary-600/20 rounded-xl flex items-center justify-center">
                    <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {formData.director?.title || 'Director\'s Message'}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    "{formData.director?.message || 'Message preview will appear here...'}"
                  </p>
                  <div>
                    <p className="font-semibold text-white">
                      {formData.director?.name || 'Director Name'}
                    </p>
                    <p className="text-sm text-primary-400">
                      {formData.director?.designation || 'Designation'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FormCard>
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

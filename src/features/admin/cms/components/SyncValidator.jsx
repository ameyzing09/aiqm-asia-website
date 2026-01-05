import { useQuery } from '@tanstack/react-query'
import { ref, get } from 'firebase/database'
import { db } from '../../../../services/firebase'
import {
  useStats,
  useTestimonials,
  useCountries,
  useIndustries,
  useLeadership,
  useServices,
  useCaseStudies,
  useCourses,
  useHero,
  useGlobal,
} from '../../../../hooks/firebase'

/**
 * Deep-Scan Sync Validator
 * Shows real-time status of ALL Firebase data including:
 * - Data hooks (Stats, Courses, etc.)
 * - Hero pages (Home, Certifications, Consultancy, About)
 * - About page sections (Story, Mission, Vision, Director)
 */
export function SyncValidator() {
  // Data hooks
  const { data: stats, isLoading: statsLoading } = useStats()
  const { data: courses, isLoading: coursesLoading } = useCourses()
  const { data: leadership, isLoading: leadershipLoading } = useLeadership()
  const { data: testimonials, isLoading: testimonialsLoading } = useTestimonials()
  const { data: caseStudies, isLoading: caseStudiesLoading } = useCaseStudies()
  const { data: countries, isLoading: countriesLoading } = useCountries()
  const { data: industries, isLoading: industriesLoading } = useIndustries()
  const { data: services, isLoading: servicesLoading } = useServices()

  // Hero pages - check all 4
  const { data: heroHome, isLoading: heroHomeLoading } = useHero('home')
  const { data: heroCertifications, isLoading: heroCertificationsLoading } = useHero('certifications')
  const { data: heroConsultancy, isLoading: heroConsultancyLoading } = useHero('consultancy')
  const { data: heroAbout, isLoading: heroAboutLoading } = useHero('about')

  // Global settings (used by Footer & Navigation)
  const { data: globalData, isLoading: globalLoading } = useGlobal()

  // About page sections - direct Firebase queries (PATHS MATCH SEEDUTILITY)
  const { data: aboutStory, isLoading: storyLoading } = useQuery({
    queryKey: ['siteContent', 'about', 'storyParagraphs'],
    queryFn: async () => {
      const snapshot = await get(ref(db, 'siteContent/about/storyParagraphs'))
      return snapshot.exists() ? snapshot.val() : null
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: aboutMission, isLoading: missionLoading } = useQuery({
    queryKey: ['siteContent', 'about', 'mission'],
    queryFn: async () => {
      const snapshot = await get(ref(db, 'siteContent/about/mission'))
      return snapshot.exists() ? snapshot.val() : null
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: aboutVision, isLoading: visionLoading } = useQuery({
    queryKey: ['siteContent', 'about', 'vision'],
    queryFn: async () => {
      const snapshot = await get(ref(db, 'siteContent/about/vision'))
      return snapshot.exists() ? snapshot.val() : null
    },
    staleTime: 5 * 60 * 1000,
  })

  // Director is now in leadership node (not about)
  const { data: leadershipDirector, isLoading: directorLoading } = useQuery({
    queryKey: ['siteContent', 'leadership', 'director'],
    queryFn: async () => {
      const snapshot = await get(ref(db, 'siteContent/leadership/director'))
      return snapshot.exists() ? snapshot.val() : null
    },
    staleTime: 5 * 60 * 1000,
  })

  // Helper to check if hero data is valid (not just empty defaults)
  // Home uses 'headline', other pages use 'title'
  const isHeroValid = (hero) => {
    if (!hero) return false
    const hasHeadline = hero.headline && hero.headline.length > 0
    const hasTitle = hero.title && hero.title.length > 0
    return hasHeadline || hasTitle
  }

  // Helper to check if about section has content
  const hasContent = (data, requiredField) => {
    if (!data) return false
    if (requiredField) return data[requiredField] && data[requiredField].length > 0
    return Object.keys(data).length > 0
  }

  // Data hooks section
  const dataHooks = [
    {
      name: 'Stats',
      data: stats,
      isLoading: statsLoading,
      count: Array.isArray(stats) ? stats.length : 0,
      unit: 'items',
    },
    {
      name: 'Courses',
      data: courses,
      isLoading: coursesLoading,
      count: Array.isArray(courses) ? courses.length : 0,
      unit: 'courses',
    },
    {
      name: 'Leadership',
      data: leadership,
      isLoading: leadershipLoading,
      count: leadership?.faculty?.length || 0,
      unit: 'faculty',
    },
    {
      name: 'Testimonials',
      data: testimonials,
      isLoading: testimonialsLoading,
      count: Array.isArray(testimonials) ? testimonials.length : 0,
      unit: 'reviews',
    },
    {
      name: 'Case Studies',
      data: caseStudies,
      isLoading: caseStudiesLoading,
      count: Array.isArray(caseStudies) ? caseStudies.length : 0,
      unit: 'cases',
    },
    {
      name: 'Countries',
      data: countries,
      isLoading: countriesLoading,
      count: Array.isArray(countries) ? countries.length : 0,
      unit: 'countries',
    },
    {
      name: 'Industries',
      data: industries,
      isLoading: industriesLoading,
      count: Array.isArray(industries) ? industries.length : 0,
      unit: 'industries',
    },
    {
      name: 'Services',
      data: services,
      isLoading: servicesLoading,
      count: Array.isArray(services) ? services.length : 0,
      unit: 'services',
    },
  ]

  // Hero pages section
  const heroPages = [
    {
      name: 'Home',
      data: heroHome,
      isLoading: heroHomeLoading,
      isValid: isHeroValid(heroHome),
    },
    {
      name: 'Certifications',
      data: heroCertifications,
      isLoading: heroCertificationsLoading,
      isValid: isHeroValid(heroCertifications),
    },
    {
      name: 'Consultancy',
      data: heroConsultancy,
      isLoading: heroConsultancyLoading,
      isValid: isHeroValid(heroConsultancy),
    },
    {
      name: 'About',
      data: heroAbout,
      isLoading: heroAboutLoading,
      isValid: isHeroValid(heroAbout),
    },
  ]

  // About page sections (paths aligned with SeedUtility schema)
  const aboutSections = [
    {
      name: 'Story',
      data: aboutStory,
      isLoading: storyLoading,
      isValid: hasContent(aboutStory, 'p1'),  // SeedUtility: storyParagraphs.p1
    },
    {
      name: 'Mission',
      data: aboutMission,
      isLoading: missionLoading,
      isValid: hasContent(aboutMission, 'statement'),  // SeedUtility: mission.statement
    },
    {
      name: 'Vision',
      data: aboutVision,
      isLoading: visionLoading,
      isValid: hasContent(aboutVision, 'statement'),  // SeedUtility: vision.statement
    },
    {
      name: 'Director',
      data: leadershipDirector,
      isLoading: directorLoading,
      isValid: hasContent(leadershipDirector, 'name'),  // SeedUtility: leadership/director.name
    },
  ]

  // Global settings (Footer & Navigation)
  const globalSections = [
    {
      name: 'Company Info',
      data: globalData?.companyInfo,
      isLoading: globalLoading,
      isValid: globalData?.companyInfo?.name && globalData.companyInfo.name.length > 0,
    },
    {
      name: 'Contact',
      data: globalData?.contact,
      isLoading: globalLoading,
      isValid: globalData?.contact?.email && globalData.contact.email.length > 0,
    },
    {
      name: 'Social Links',
      data: globalData?.socialLinks,
      isLoading: globalLoading,
      isValid: Array.isArray(globalData?.socialLinks) && globalData.socialLinks.length > 0,
    },
    {
      name: 'Navigation',
      data: globalData?.navigationLabels,
      isLoading: globalLoading,
      isValid: globalData?.navigationLabels?.home && globalData.navigationLabels.home.length > 0,
    },
  ]

  // Calculate totals
  const dataHooksDynamic = dataHooks.filter(s => !s.isLoading && s.data && s.count > 0).length
  const dataHooksZombie = dataHooks.filter(s => !s.isLoading && (!s.data || s.count === 0)).length

  const heroDynamic = heroPages.filter(s => !s.isLoading && s.isValid).length
  const heroZombie = heroPages.filter(s => !s.isLoading && !s.isValid).length

  const aboutDynamic = aboutSections.filter(s => !s.isLoading && s.isValid).length
  const aboutZombie = aboutSections.filter(s => !s.isLoading && !s.isValid).length

  const globalDynamic = globalSections.filter(s => !s.isLoading && s.isValid).length
  const globalZombie = globalSections.filter(s => !s.isLoading && !s.isValid).length

  const totalDynamic = dataHooksDynamic + heroDynamic + aboutDynamic + globalDynamic
  const totalZombie = dataHooksZombie + heroZombie + aboutZombie + globalZombie
  const totalLoading = [...dataHooks, ...heroPages, ...aboutSections, ...globalSections].filter(s => s.isLoading).length

  // Section renderer
  const renderSection = (section, type = 'data') => {
    const isDynamic = type === 'data'
      ? (!section.isLoading && section.data && section.count > 0)
      : (!section.isLoading && section.isValid)
    const isZombie = type === 'data'
      ? (!section.isLoading && (!section.data || section.count === 0))
      : (!section.isLoading && !section.isValid)

    return (
      <div
        key={section.name}
        className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
          section.isLoading
            ? 'bg-white/5'
            : isDynamic
            ? 'bg-green-500/10 border border-green-500/20'
            : 'bg-red-500/10 border border-red-500/20'
        }`}
      >
        <div className="flex items-center gap-2">
          {section.isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-500 border-t-gray-300 rounded-full animate-spin" />
          ) : isDynamic ? (
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className={`text-sm font-medium ${
            section.isLoading ? 'text-gray-400' : isDynamic ? 'text-green-400' : 'text-red-400'
          }`}>
            {section.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {section.isLoading ? (
            <span className="text-xs text-gray-500">...</span>
          ) : isDynamic ? (
            <>
              <span className="px-1.5 py-0.5 text-xs font-medium bg-green-500/20 text-green-400 rounded">
                DYNAMIC
              </span>
              {type === 'data' && (
                <span className="text-xs text-gray-500">
                  {section.count} {section.unit}
                </span>
              )}
            </>
          ) : (
            <>
              <span className="px-1.5 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded">
                ZOMBIE
              </span>
              <span className="text-xs text-gray-500">No data</span>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Deep-Scan Sync Validator</h3>
            <p className="text-xs text-gray-500">Real-time Firebase connection status</p>
          </div>
        </div>

        {/* Summary badges */}
        <div className="flex items-center gap-2">
          {totalDynamic > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
              {totalDynamic} Dynamic
            </span>
          )}
          {totalZombie > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-full animate-pulse">
              {totalZombie} Zombie
            </span>
          )}
          {totalLoading > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-gray-500/20 text-gray-400 rounded-full">
              {totalLoading} Loading
            </span>
          )}
        </div>
      </div>

      {/* DATA HOOKS Section */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
          <h4 className="text-sm font-medium text-gray-300">DATA HOOKS</h4>
          <span className="text-xs text-gray-500">
            ({dataHooksDynamic}/{dataHooks.length} synced)
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {dataHooks.map((section) => renderSection(section, 'data'))}
        </div>
      </div>

      {/* HERO PAGES Section */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
          </svg>
          <h4 className="text-sm font-medium text-gray-300">HERO PAGES</h4>
          <span className="text-xs text-gray-500">
            ({heroDynamic}/{heroPages.length} synced)
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {heroPages.map((section) => renderSection(section, 'hero'))}
        </div>
      </div>

      {/* ABOUT PAGE SECTIONS */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h4 className="text-sm font-medium text-gray-300">ABOUT PAGE SECTIONS</h4>
          <span className="text-xs text-gray-500">
            ({aboutDynamic}/{aboutSections.length} synced)
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {aboutSections.map((section) => renderSection(section, 'about'))}
        </div>
      </div>

      {/* GLOBAL SETTINGS (Footer & Navigation) */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h4 className="text-sm font-medium text-gray-300">GLOBAL SETTINGS</h4>
          <span className="text-xs text-gray-500">
            ({globalDynamic}/{globalSections.length} synced)
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {globalSections.map((section) => renderSection(section, 'global'))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/10">
        {totalZombie > 0 ? (
          <p className="text-xs text-red-400 text-center flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {totalZombie} zombie section{totalZombie > 1 ? 's' : ''} detected! Edit content to fix.
          </p>
        ) : totalLoading > 0 ? (
          <p className="text-xs text-gray-500 text-center">
            Scanning Firebase for zombie data...
          </p>
        ) : (
          <p className="text-xs text-green-400 text-center flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            All sections synced! Zero-Zombie Architecture achieved.
          </p>
        )}
      </div>
    </div>
  )
}

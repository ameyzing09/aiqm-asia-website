import { useMemo } from 'react'
import { useSectionHeaders, useCertificationBenefits, useStats } from '../../hooks/firebase'

// Icon mapping (JSX can't be stored in Firebase)
const BENEFIT_ICONS = {
  money: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
    </svg>
  ),
  globe: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
    </svg>
  ),
  education: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
    </svg>
  ),
}

const DEFAULT_ICON = BENEFIT_ICONS.money

// Loading skeleton for benefit card
function BenefitSkeleton() {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 animate-pulse">
      <div className="w-16 h-16 bg-white/20 rounded-lg mb-6" />
      <div className="h-7 w-40 bg-white/20 rounded mb-4" />
      <div className="h-4 w-full bg-white/20 rounded mb-2" />
      <div className="h-4 w-3/4 bg-white/20 rounded" />
    </div>
  )
}

// Loading skeleton for stat
function StatSkeleton() {
  return (
    <div className="text-center animate-pulse">
      <div className="h-10 w-24 bg-white/20 rounded mx-auto mb-2" />
      <div className="h-4 w-32 bg-white/20 rounded mx-auto" />
    </div>
  )
}

export function BenefitsSection() {
  const { data: sectionHeader } = useSectionHeaders('benefits')
  const { data: benefits, isLoading: benefitsLoading } = useCertificationBenefits()
  const { data: stats, isLoading: statsLoading } = useStats()

  // Get stats for the benefits section (sorted by order from Firebase)
  const displayStats = useMemo(() => {
    if (!stats?.length) return []
    // Show all active stats, already sorted by order from useStats hook
    return stats.slice(0, 4)
  }, [stats])

  // const isLoading = benefitsLoading || statsLoading

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {sectionHeader?.title}
          </h2>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            {sectionHeader?.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefitsLoading ? (
            [1, 2, 3].map((i) => <BenefitSkeleton key={i} />)
          ) : (
            benefits?.map((benefit) => (
              <div
                key={benefit.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mb-6 text-white">
                  {BENEFIT_ICONS[benefit.iconType] || DEFAULT_ICON}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {benefit.title}
                </h3>
                <p className="text-primary-100 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Stats from Firebase */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {statsLoading ? (
            [1, 2, 3, 4].map((i) => <StatSkeleton key={i} />)
          ) : (
            displayStats.map((stat) => (
              <div key={stat.id}>
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value?.toLocaleString?.() || stat.value}{stat.suffix || ''}
                </div>
                <div className="text-primary-100">{stat.label}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

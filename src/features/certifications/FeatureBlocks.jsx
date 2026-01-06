import { Card } from '../../components/Card'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { useSectionHeaders, useFeatureBlocks } from '../../hooks/firebase'

// Icon mapping (JSX can't be stored in Firebase)
const FEATURE_ICONS = {
  globe: (
    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
    </svg>
  ),
  education: (
    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
    </svg>
  ),
  briefcase: (
    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
    </svg>
  ),
}

// Color mapping for gradients
const COLOR_MAP = {
  'blue': { from: 'from-blue-500', to: 'to-blue-700' },
  'green': { from: 'from-green-500', to: 'to-green-700' },
  'purple': { from: 'from-purple-500', to: 'to-purple-700' },
  'red': { from: 'from-red-500', to: 'to-red-700' },
  'orange': { from: 'from-orange-500', to: 'to-orange-700' },
}

const DEFAULT_COLOR = { from: 'from-primary-500', to: 'to-primary-700' }
const DEFAULT_ICON = FEATURE_ICONS.globe

// Loading skeleton for feature block
function FeatureBlockSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="flex flex-col lg:flex-row">
        {/* Icon Section */}
        <div className="lg:w-1/3 bg-gray-200 dark:bg-gray-700 p-8 lg:p-12 flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded mb-6" />
          <div className="h-8 w-48 bg-gray-300 dark:bg-gray-600 rounded" />
        </div>

        {/* Content Section */}
        <div className="lg:w-2/3 p-8 lg:p-12">
          <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start">
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mr-3 flex-shrink-0" />
                <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

// Animated feature block component
function AnimatedFeatureBlock({ feature, index }) {
  const [ref, isVisible] = useScrollAnimation()

  const colorKey = feature.colorFrom?.replace('-500', '') || 'blue'
  const colors = COLOR_MAP[colorKey] || DEFAULT_COLOR

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card hover className="overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Icon Section */}
          <div className={`lg:w-1/3 bg-gradient-to-br ${colors.from} ${colors.to} p-8 lg:p-12 flex flex-col items-center justify-center text-white`}>
            <div className="mb-6">
              {FEATURE_ICONS[feature.iconType] || DEFAULT_ICON}
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-center">
              {feature.title}
            </h3>
          </div>

          {/* Content Section */}
          <div className="lg:w-2/3 p-8 lg:p-12">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {feature.description}
            </p>
            {feature.benefits?.length > 0 && (
              <ul className="space-y-3">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export function FeatureBlocks() {
  const { data: sectionHeader } = useSectionHeaders('featureBlocks')
  const { data: features, isLoading } = useFeatureBlocks()

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {sectionHeader?.title || 'Why Choose Our Certifications?'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {sectionHeader?.description || 'Key pillars that make our certifications the preferred choice for professionals worldwide'}
          </p>
        </div>

        <div className="space-y-8">
          {isLoading ? (
            [1, 2, 3].map((i) => <FeatureBlockSkeleton key={i} />)
          ) : (
            features?.map((feature, index) => (
              <AnimatedFeatureBlock key={feature.id} feature={feature} index={index} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}

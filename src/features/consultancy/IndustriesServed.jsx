import { Card } from '../../components/Card'
import { useIndustries, useSectionHeaders } from '../../hooks/firebase'

// Icon mapping for industries (icons can't be stored in Firebase)
const industryIcons = {
  manufacturing: {
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    bgClass: 'from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800',
    textClass: 'text-blue-600 dark:text-blue-400'
  },
  healthcare: {
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    bgClass: 'from-red-100 to-red-200 dark:from-red-900 dark:to-red-800',
    textClass: 'text-red-600 dark:text-red-400'
  },
  it: {
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    bgClass: 'from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800',
    textClass: 'text-purple-600 dark:text-purple-400'
  },
  finance: {
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgClass: 'from-green-100 to-green-200 dark:from-green-900 dark:to-green-800',
    textClass: 'text-green-600 dark:text-green-400'
  },
  logistics: {
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    bgClass: 'from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800',
    textClass: 'text-orange-600 dark:text-orange-400'
  },
  retail: {
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    bgClass: 'from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800',
    textClass: 'text-pink-600 dark:text-pink-400'
  }
}

// Default icon for unknown industries
const defaultIcon = {
  icon: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  bgClass: 'from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800',
  textClass: 'text-gray-600 dark:text-gray-400'
}

export function IndustriesServed() {
  const { data: industries, isLoading } = useIndustries()
  const { data: sectionHeader } = useSectionHeaders('industries')

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {sectionHeader?.title || 'Industries We Serve'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {sectionHeader?.description || 'Delivering excellence across diverse sectors with industry-specific expertise'}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="text-center p-6 w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(16.666%-1.25rem)] animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
              </Card>
            ))
          ) : (
            industries?.map((industry) => {
              const iconData = industryIcons[industry.id] || defaultIcon
              return (
                <Card
                  key={industry.id}
                  hover
                  className="text-center p-6 transition-transform duration-300 hover:scale-105 w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(16.666%-1.25rem)]"
                >
                  {/* Icon */}
                  <div className="mb-4">
                    <div className={`aspect-square bg-gradient-to-br ${iconData.bgClass} rounded-lg flex items-center justify-center`}>
                      <span className={iconData.textClass}>{iconData.icon}</span>
                    </div>
                  </div>

                  {/* Industry Name */}
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                    {industry.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    {industry.description}
                  </p>

                  {/* Projects Count */}
                  <div className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {industry.projects}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Projects
                  </div>
                </Card>
              )
            })
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Don&apos;t see your industry? We work across 50+ sectors.{' '}
            <a href="#request-consultation" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Contact us
            </a>
            {' '}to discuss your specific needs.
          </p>
        </div>
      </div>
    </section>
  )
}

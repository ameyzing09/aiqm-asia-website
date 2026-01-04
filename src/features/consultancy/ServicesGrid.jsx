import { Card } from '../../components/Card'
import { useServices } from '../../hooks/firebase'

// Icon and style mapping for services (JSX can't be stored in Firebase)
const serviceStyles = {
  'process-improvement': {
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
    ),
    color: 'from-blue-500 to-blue-700',
    imagePlaceholder: (
      <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-t-xl flex items-center justify-center">
        <div className="text-center p-4">
          <svg className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Process Flow Image</p>
        </div>
      </div>
    )
  },
  'business-excellence': {
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    color: 'from-green-500 to-green-700',
    imagePlaceholder: (
      <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-t-xl flex items-center justify-center">
        <div className="text-center p-4">
          <svg className="w-12 h-12 mx-auto text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Quality Badge Image</p>
        </div>
      </div>
    )
  },
  auditing: {
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    ),
    color: 'from-purple-500 to-purple-700',
    imagePlaceholder: (
      <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-t-xl flex items-center justify-center">
        <div className="text-center p-4">
          <svg className="w-12 h-12 mx-auto text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Audit Checklist Image</p>
        </div>
      </div>
    )
  },
  'project-mentoring': {
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
      </svg>
    ),
    color: 'from-orange-500 to-orange-700',
    imagePlaceholder: (
      <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-t-xl flex items-center justify-center">
        <div className="text-center p-4">
          <svg className="w-12 h-12 mx-auto text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Mentoring Team Image</p>
        </div>
      </div>
    )
  }
}

// Default style for unknown services
const defaultStyle = {
  icon: (
    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
    </svg>
  ),
  color: 'from-gray-500 to-gray-700',
  imagePlaceholder: (
    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-t-xl flex items-center justify-center">
      <div className="text-center p-4">
        <svg className="w-12 h-12 mx-auto text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Service Image</p>
      </div>
    </div>
  )
}

export function ServicesGrid() {
  const { data: services, isLoading } = useServices()

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Consultancy Services
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive consulting solutions tailored to your business needs, delivered by industry experts
          </p>
        </div>

        <div className="flex flex-wrap gap-8">
          {isLoading ? (
            [1, 2, 3, 4].map((i) => (
              <Card key={i} className="flex flex-col h-full w-full md:w-[calc(50%-1rem)] animate-pulse">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-xl" />
                <div className="px-6 pb-6 pt-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-40" />
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  {/* Deliverables section with icon padding */}
                  <div className="pt-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-3" />
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <div key={j} className="flex items-center">
                          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full mr-2 flex-shrink-0" />
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            services?.map((service) => {
              const style = serviceStyles[service.id] || defaultStyle
              return (
                <Card key={service.id} hover className="flex flex-col h-full w-full md:w-[calc(50%-1rem)]">
                  {/* Image Placeholder */}
                  <div className="mb-6">
                    {style.imagePlaceholder}
                  </div>

                  {/* Content Wrapper with Padding */}
                  <div className="px-6 pb-6">
                    {/* Icon and Title */}
                    <div className="flex items-center mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${style.color} rounded-lg flex items-center justify-center text-white mr-4 flex-shrink-0`}>
                        {style.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {service.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {service.description}
                    </p>

                    {/* Deliverables */}
                    <div className="mt-auto">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Key Deliverables:
                      </h4>
                      <ul className="space-y-2">
                        {service.deliverables.map((deliverable, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}

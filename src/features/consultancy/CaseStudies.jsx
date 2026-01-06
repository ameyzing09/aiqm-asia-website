import { Card } from '../../components/Card'
import { useCaseStudies, useSectionHeaders } from '../../hooks/firebase'

// Image placeholder mapping (JSX can't be stored in Firebase)
const caseStudyStyles = {
  'manufacturing-case': {
    color: 'from-blue-500 to-blue-700',
    imagePlaceholder: (
      <div className="aspect-video bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-900 dark:via-blue-800 dark:to-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
        <div className="text-center p-6">
          <svg className="w-16 h-16 mx-auto text-blue-600 dark:text-blue-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Before/After Manufacturing Line
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Image showing production improvements
          </p>
        </div>
      </div>
    )
  },
  'logistics-case': {
    color: 'from-green-500 to-green-700',
    imagePlaceholder: (
      <div className="aspect-video bg-gradient-to-br from-green-50 via-green-100 to-green-200 dark:from-green-900 dark:via-green-800 dark:to-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
        <div className="text-center p-6">
          <svg className="w-16 h-16 mx-auto text-green-600 dark:text-green-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Warehouse Optimization Layout
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Image showing warehouse transformation
          </p>
        </div>
      </div>
    )
  },
  'healthcare-case': {
    color: 'from-purple-500 to-purple-700',
    imagePlaceholder: (
      <div className="aspect-video bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 dark:from-purple-900 dark:via-purple-800 dark:to-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
        <div className="text-center p-6">
          <svg className="w-16 h-16 mx-auto text-purple-600 dark:text-purple-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Patient Flow Improvement
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Image showing healthcare process optimization
          </p>
        </div>
      </div>
    )
  }
}

// Default style for unknown case studies
const defaultStyle = {
  color: 'from-gray-500 to-gray-700',
  imagePlaceholder: (
    <div className="aspect-video bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
      <div className="text-center p-6">
        <svg className="w-16 h-16 mx-auto text-gray-600 dark:text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Case Study Image
        </p>
      </div>
    </div>
  )
}

export function CaseStudies() {
  const { data: caseStudies, isLoading } = useCaseStudies()
  const { data: sectionHeader } = useSectionHeaders('caseStudies')

  return (
    <section id="case-studies" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {sectionHeader?.title || 'Proven Results Across Industries'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {sectionHeader?.description || 'Real case studies demonstrating measurable impact and sustainable improvements'}
          </p>
        </div>

        <div className="space-y-12">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-8 min-h-[450px]">
                  <div className="flex-1">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    <div className="mt-4 flex gap-4">
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                    {/* Challenge section */}
                    <div className="pt-2">
                      <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                    {/* Solution section */}
                    <div className="pt-2">
                      <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                    {/* Outcomes section */}
                    <div className="pt-2">
                      <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                      <div className="flex flex-wrap gap-4">
                        {[1, 2, 3, 4].map((j) => (
                          <div key={j} className="flex-1 min-w-[calc(50%-0.5rem)] min-h-[88px] bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
                            <div className="h-8 w-16 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                            <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            caseStudies?.map((study) => {
              const style = caseStudyStyles[study.id] || defaultStyle
              return (
                <Card key={study.id} hover className="overflow-hidden">
                  <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-8">
                    {/* Image Section */}
                    <div className="flex-1 order-1 lg:order-1">
                      {study.image ? (
                        <div className="aspect-video rounded-lg overflow-hidden">
                          <img
                            src={study.image}
                            alt={`${study.industry} Case Study`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        style.imagePlaceholder
                      )}

                      {/* Project Details */}
                      <div className="mt-4 flex flex-wrap gap-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {study.timeline}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          {study.teamSize}
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 order-2 lg:order-2">
                      {/* Header */}
                      <div className="mb-6">
                        <div className={`inline-block px-3 py-1 bg-gradient-to-r ${style.color} text-white text-sm font-semibold rounded-full mb-3`}>
                          {study.industry}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{study.companySize}</p>
                      </div>

                      {/* Challenge */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Challenge
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {study.challenge}
                        </p>
                      </div>

                      {/* Solution */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Solution
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {study.solution}
                        </p>
                      </div>

                      {/* Outcomes - Measurable Results */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Measurable Outcomes
                        </h4>
                        <div className="flex flex-wrap gap-4">
                          {study.outcomes.map((outcome, outcomeIndex) => (
                            <div key={outcomeIndex} className="flex-1 min-w-[calc(50%-0.5rem)] bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                                {outcome.metric}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {outcome.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
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

import { Card } from '../../components/Card'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

export function CaseStudies() {
  const [ref1, isVisible1] = useScrollAnimation()
  const [ref2, isVisible2] = useScrollAnimation()
  const [ref3, isVisible3] = useScrollAnimation()

  const caseStudies = [
    {
      ref: ref1,
      isVisible: isVisible1,
      industry: 'Manufacturing',
      companySize: 'Large Enterprise (5000+ employees)',
      challenge: 'High defect rates and production inefficiencies leading to significant waste and customer complaints',
      solution: 'Implemented comprehensive Lean Six Sigma program with process mapping, DMAIC methodology, and team training',
      outcomes: [
        { metric: '35%', description: 'Reduction in defect rates' },
        { metric: '₹12 Cr', description: 'Annual cost savings' },
        { metric: '40%', description: 'Faster production cycle' },
        { metric: '92%', description: 'Customer satisfaction score' }
      ],
      timeline: '6 months',
      teamSize: '8 consultants',
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
    {
      ref: ref2,
      isVisible: isVisible2,
      industry: 'Logistics & Supply Chain',
      companySize: 'Mid-sized Company (500-1000 employees)',
      challenge: 'Inefficient warehouse operations and delivery delays causing revenue loss and poor customer experience',
      solution: 'Redesigned warehouse layout, implemented WMS system, and optimized delivery routes using data analytics',
      outcomes: [
        { metric: '40%', description: 'Increase in operational efficiency' },
        { metric: '₹8 Cr', description: 'Annual operational savings' },
        { metric: '65%', description: 'Reduction in delivery time' },
        { metric: '99.2%', description: 'On-time delivery rate' }
      ],
      timeline: '4 months',
      teamSize: '6 consultants',
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
    {
      ref: ref3,
      isVisible: isVisible3,
      industry: 'Healthcare',
      companySize: 'Hospital Network (10+ facilities)',
      challenge: 'Patient wait times, operational inefficiencies, and high costs impacting patient care quality',
      solution: 'Applied Lean Healthcare principles, optimized patient flow, and standardized clinical processes',
      outcomes: [
        { metric: '₹2.5 Cr', description: 'Annual cost reduction' },
        { metric: '50%', description: 'Reduction in patient wait time' },
        { metric: '28%', description: 'Improvement in bed utilization' },
        { metric: '4.8/5', description: 'Patient satisfaction rating' }
      ],
      timeline: '8 months',
      teamSize: '10 consultants',
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
  ]

  return (
    <section id="case-studies" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Proven Results Across Industries
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Real case studies demonstrating measurable impact and sustainable improvements
          </p>
        </div>

        <div className="space-y-12">
          {caseStudies.map((study, index) => (
            <div
              key={index}
              ref={study.ref}
              className={`transition-all duration-700 ${
                study.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <Card hover className="overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-8">
                  {/* Image Section */}
                  <div className="flex-1 order-1 lg:order-1">
                    {study.imagePlaceholder}

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
                      <div className={`inline-block px-3 py-1 bg-gradient-to-r ${study.color} text-white text-sm font-semibold rounded-full mb-3`}>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

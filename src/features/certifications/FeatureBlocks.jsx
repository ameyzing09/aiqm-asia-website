import { Card } from '../../components/Card'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

export function FeatureBlocks() {
  const [ref1, isVisible1] = useScrollAnimation()
  const [ref2, isVisible2] = useScrollAnimation()
  const [ref3, isVisible3] = useScrollAnimation()

  const features = [
    {
      ref: ref1,
      isVisible: isVisible1,
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
        </svg>
      ),
      title: 'International Recognition',
      description: 'Our certifications are globally recognized and accepted by leading organizations worldwide.',
      benefits: [
        'Valid in 13+ countries',
        'Recognized by Fortune 500 companies',
        'Meets international standards',
        'Lifetime certification validity',
        'No renewal fees required'
      ],
      color: 'from-blue-500 to-blue-700'
    },
    {
      ref: ref2,
      isVisible: isVisible2,
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
      ),
      title: 'Career Growth',
      description: 'Accelerate your career progression with industry-recognized credentials that set you apart.',
      benefits: [
        '20-30% average salary increase',
        'Faster promotions and career advancement',
        'Access to leadership roles',
        'Enhanced job security',
        'Priority hiring by top employers'
      ],
      color: 'from-green-500 to-green-700'
    },
    {
      ref: ref3,
      isVisible: isVisible3,
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
        </svg>
      ),
      title: 'Industry Relevance',
      description: 'Stay relevant with certifications aligned with current industry demands and best practices.',
      benefits: [
        'Applicable across all industries',
        'Updated curriculum following latest trends',
        'Real-world project experience',
        'Practical skills employers need',
        'Continuous learning support'
      ],
      color: 'from-purple-500 to-purple-700'
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Our Certifications?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Three key pillars that make our certifications the preferred choice for professionals worldwide
          </p>
        </div>

        <div className="space-y-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={feature.ref}
              className={`transition-all duration-700 ${
                feature.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <Card hover className="overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Icon Section */}
                  <div className={`lg:w-1/3 bg-gradient-to-br ${feature.color} p-8 lg:p-12 flex flex-col items-center justify-center text-white`}>
                    <div className="mb-6">
                      {feature.icon}
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

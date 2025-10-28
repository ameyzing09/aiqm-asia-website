import { Card } from '../../components/Card'

export function StorySection() {
  const keyFacts = [
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
      ),
      title: 'IIT & IIM Alumni',
      description: 'Founded by graduates from India\'s premier institutes'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      title: '25+ Years',
      description: 'Over two decades of continuous excellence'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      title: '95,000+',
      description: 'Professionals trained across industries'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      title: '11,000+',
      description: 'Projects successfully delivered'
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Story
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From humble beginnings to becoming India's premier quality excellence institute
          </p>
        </div>

        {/* Story Content with Image */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-16">
          {/* Image Placeholder */}
          <div className="flex-1">
            <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-900 dark:via-blue-800 dark:to-gray-900 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <svg className="w-20 h-20 mx-auto text-blue-600 dark:text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Image Placeholder: Company Founding
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Recommended: Historical photo or office building
                </p>
              </div>
            </div>
          </div>

          {/* Story Text */}
          <div className="flex-1">
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Founded in <span className="font-bold text-primary-600 dark:text-primary-400">1998</span> by
                distinguished alumni from <span className="font-bold">IIT Bombay</span> and <span className="font-bold">IIM Ahmedabad</span>,
                AIQM India began with a singular vision: to transform quality management practices across India.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                What started as a small training center in Mumbai has grown into India's most trusted partner in
                quality excellence, serving organizations across <span className="font-bold text-primary-600 dark:text-primary-400">13 countries</span> and
                training over <span className="font-bold text-primary-600 dark:text-primary-400">95,000 professionals</span>.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Our journey has been marked by continuous innovation, unwavering commitment to excellence, and
                a deep understanding of the unique challenges faced by Indian organizations in their quest for
                operational excellence.
              </p>
            </div>
          </div>
        </div>

        {/* Key Facts Flex Grid */}
        <div className="flex flex-wrap gap-6">
          {keyFacts.map((fact) => (
            <div
              key={fact.title}
              className="flex-1 min-w-[calc(50%-0.75rem)] lg:min-w-[calc(25%-1.125rem)]"
            >
              <Card hover className="p-6 h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white mb-4">
                    {fact.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {fact.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {fact.description}
                  </p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

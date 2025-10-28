export function GlobalPresence() {
  const countries = [
    { name: 'India', flag: '🇮🇳' },
    { name: 'United States', flag: '🇺🇸' },
    { name: 'United Kingdom', flag: '🇬🇧' },
    { name: 'Singapore', flag: '🇸🇬' },
    { name: 'UAE', flag: '🇦🇪' },
    { name: 'Saudi Arabia', flag: '🇸🇦' },
    { name: 'Malaysia', flag: '🇲🇾' },
    { name: 'Thailand', flag: '🇹🇭' },
    { name: 'Australia', flag: '🇦🇺' },
    { name: 'Canada', flag: '🇨🇦' },
    { name: 'Germany', flag: '🇩🇪' },
    { name: 'South Africa', flag: '🇿🇦' },
    { name: 'Philippines', flag: '🇵🇭' }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Global Footprint
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Serving organizations across 13 countries with world-class quality management solutions
          </p>
        </div>

        {/* World Map Image Placeholder */}
        <div className="mb-12">
          <div className="aspect-video bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900 dark:via-blue-900 dark:to-purple-900 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
            <div className="text-center p-8">
              <svg className="w-32 h-32 mx-auto text-primary-600 dark:text-primary-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image Placeholder: World Map
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Recommended: Interactive world map showing AIQM presence
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                16:9 aspect ratio | Highlight 13 countries
              </p>
            </div>
          </div>
        </div>

        {/* Countries List */}
        <div className="flex flex-wrap justify-center gap-4">
          {countries.map((country) => (
            <div
              key={country.name}
              className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl px-6 py-4 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <span className="text-3xl">{country.flag}</span>
              <span className="text-base font-medium text-gray-900 dark:text-white">
                {country.name}
              </span>
            </div>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 rounded-2xl p-8 lg:p-12">
          <div className="flex flex-wrap justify-center gap-12 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">13</div>
              <div className="text-primary-100">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-100">Corporate Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15,000+</div>
              <div className="text-primary-100">Projects Globally</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-primary-100">Industry Verticals</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

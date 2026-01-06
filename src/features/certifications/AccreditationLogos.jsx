import { Card } from '../../components/Card'
import { useAccreditations, useSectionHeaders } from '../../hooks/firebase'

// Color mapping for accreditation logos (gradients can't be stored in Firebase)
const COLOR_MAP = {
  'blue': { from: 'from-blue-500', to: 'to-blue-700' },
  'green': { from: 'from-green-500', to: 'to-green-700' },
  'purple': { from: 'from-purple-500', to: 'to-purple-700' },
  'red': { from: 'from-red-500', to: 'to-red-700' },
  'orange': { from: 'from-orange-500', to: 'to-orange-700' },
}

// Default color
const DEFAULT_COLOR = { from: 'from-primary-500', to: 'to-primary-700' }

// Loading skeleton for accreditation card
function AccreditationSkeleton() {
  return (
    <Card className="flex flex-col items-center p-6 animate-pulse">
      <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6" />
      <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="w-full space-y-2">
        <div className="flex items-center">
          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full mr-2" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full mr-2" />
          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full mr-2" />
          <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </Card>
  )
}

export function AccreditationLogos() {
  const { data: accreditations, isLoading } = useAccreditations()
  const { data: sectionHeader } = useSectionHeaders('accreditations')

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {sectionHeader?.title || 'Our Accreditations'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {sectionHeader?.description || 'Accredited by leading international bodies, ensuring your certification is recognized globally.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            [1, 2, 3].map((i) => <AccreditationSkeleton key={i} />)
          ) : (
            accreditations?.map((accreditation) => {
              const colorKey = accreditation.colorFrom?.replace('-500', '') || 'blue'
              const colors = COLOR_MAP[colorKey] || DEFAULT_COLOR

              return (
                <Card key={accreditation.id} hover className="flex flex-col items-center p-6">
                  {/* Logo */}
                  <div className="w-full mb-6">
                    <div className={`w-full h-32 bg-gradient-to-br ${colors.from} ${colors.to} rounded-lg flex items-center justify-center`}>
                      <div className="text-center">
                        <div className="text-white font-bold text-3xl">{accreditation.name}</div>
                        {accreditation.fullName && (
                          <div className="text-white/80 text-xs font-semibold mt-1">{accreditation.fullName}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Name & Description */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                    {accreditation.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                    {accreditation.description}
                  </p>

                  {/* Features */}
                  {accreditation.features?.length > 0 && (
                    <ul className="space-y-2 w-full">
                      {accreditation.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                          <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {typeof feature === 'string' ? feature : feature.text || feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}

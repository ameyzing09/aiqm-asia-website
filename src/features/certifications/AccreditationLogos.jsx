import { Card } from '../../components/Card'

export function AccreditationLogos() {
  const accreditations = [
    {
      name: 'CSSC USA',
      description: 'Council for Six Sigma Certification',
      logo: (
        <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-white font-bold text-3xl">CSSC</div>
            <div className="text-blue-100 text-xs font-semibold mt-1">USA</div>
          </div>
        </div>
      ),
      features: ['Globally recognized', 'Industry standard', 'Lifetime validity']
    },
    {
      name: 'IAF',
      description: 'International Accreditation Forum',
      logo: (
        <div className="w-full h-32 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-white font-bold text-3xl">IAF</div>
            <div className="text-green-100 text-xs font-semibold mt-1">International</div>
          </div>
        </div>
      ),
      features: ['Worldwide acceptance', 'Quality assurance', 'Peer recognition']
    },
    {
      name: 'ISO',
      description: 'International Organization for Standardization',
      logo: (
        <div className="w-full h-32 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-white font-bold text-3xl">ISO</div>
            <div className="text-purple-100 text-xs font-semibold mt-1">9001 Certified</div>
          </div>
        </div>
      ),
      features: ['Quality management', 'International standards', 'Trusted worldwide']
    }
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Accreditations
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            AIQM India is accredited by leading international bodies, ensuring that your certification
            is recognized and valued across the globe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {accreditations.map((accreditation) => (
            <Card key={accreditation.name} hover className="flex flex-col items-center p-6">
              {/* Logo */}
              <div className="w-full mb-6">
                {accreditation.logo}
              </div>

              {/* Name & Description */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                {accreditation.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                {accreditation.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 w-full">
                {accreditation.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

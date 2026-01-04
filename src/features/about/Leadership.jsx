import { Card } from '../../components/Card'
import { useLeadership } from '../../hooks/firebase'

export function Leadership() {
  const { data, isLoading } = useLeadership()
  const director = data?.director || {}
  const directorImpact = data?.directorImpact || []
  const directorsMessage = data?.directorsMessage || ''
  const faculty = data?.faculty || []

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Leadership & Faculty
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Led by distinguished professionals from premier institutes, our team brings decades of combined experience in quality excellence
          </p>
        </div>

        {/* Director's Message */}
        <div className="mb-16 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 lg:p-12 border border-primary-100 dark:border-gray-700">
          {isLoading ? (
            <div className="animate-pulse min-h-[180px]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4 mb-6">
              <svg className="w-12 h-12 text-primary-600 dark:text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Director&apos;s Message</h3>
                <blockquote className="text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  &quot;{directorsMessage}&quot;
                </blockquote>
              </div>
            </div>
          )}
        </div>

        {/* Director Profile - Featured */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            About the Director
          </h3>
          <Card className="p-8 lg:p-10">
            {isLoading ? (
              <div className="animate-pulse flex flex-col lg:flex-row gap-8 items-start min-h-[400px]">
                <div className="flex-shrink-0 mx-auto lg:mx-0">
                  <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-64" />
                  {/* Education section */}
                  <div className="pt-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  </div>
                  {/* Credentials section */}
                  <div className="pt-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  </div>
                  {/* Experience section */}
                  <div className="pt-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  </div>
                  {/* Impact section */}
                  <div className="pt-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2" />
                    <div className="flex gap-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                    </div>
                  </div>
                  {/* Recognition section */}
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg w-full" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Photo Placeholder */}
                <div className="flex-shrink-0 mx-auto lg:mx-0">
                  <div className="w-48 h-48 bg-gradient-to-br from-primary-100 via-primary-50 to-accent-100 dark:from-primary-900 dark:via-gray-800 dark:to-accent-900 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden">
                    {director.photoUrl ? (
                      <img src={director.photoUrl} alt={director.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-24 h-24 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Profile Details */}
                <div className="flex-1">
                  <h4 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {director.name}
                  </h4>
                  <p className="text-lg text-primary-600 dark:text-primary-400 font-semibold mb-4">
                    {director.title}
                  </p>

                  {/* Education */}
                  {director.education && (
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Education</h5>
                      <p className="text-base text-gray-700 dark:text-gray-300">
                        {director.education}
                      </p>
                    </div>
                  )}

                  {/* Credentials */}
                  {director.credentials && (
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Credentials</h5>
                      <p className="text-base text-gray-700 dark:text-gray-300">
                        {director.credentials}
                      </p>
                    </div>
                  )}

                  {/* Experience */}
                  {director.experience && (
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Experience</h5>
                      <p className="text-base text-gray-700 dark:text-gray-300">
                        {director.experience}
                      </p>
                    </div>
                  )}

                  {/* Impact */}
                  {directorImpact.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Impact</h5>
                      <div className="flex flex-wrap gap-4">
                        {directorImpact.map((impact, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-base text-gray-700 dark:text-gray-300">{impact}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recognition */}
                  {director.recognition && (
                    <div className="bg-accent-50 dark:bg-accent-900/20 rounded-lg p-4 border border-accent-200 dark:border-accent-800">
                      <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-accent-600 dark:text-accent-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Recognition</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {director.recognition}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Faculty Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Our Faculty of Excellence
          </h3>
          <p className="text-base text-gray-600 dark:text-gray-300 text-center mb-8 max-w-3xl mx-auto">
            Training delivered by globally certified experts — each with decades of hands-on experience in operational excellence, Lean Six Sigma, and quality management
          </p>

          {/* Faculty Cards - Flexbox Layout */}
          <div className="flex flex-wrap gap-6">
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-full lg:w-[calc(50%-0.75rem)]">
                  <Card className="p-6 h-full animate-pulse">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                      </div>
                    </div>
                  </Card>
                </div>
              ))
            ) : (
              faculty.map((member) => (
                <div key={member.id} className="w-full lg:w-[calc(50%-0.75rem)]">
                  <Card hover className="p-6 h-full">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-32 h-32 bg-gradient-to-br from-primary-100 via-primary-50 to-accent-100 dark:from-primary-900 dark:via-gray-800 dark:to-accent-900 rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
                          {member.photoUrl ? (
                            <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-16 h-16 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {member.name}
                        </h4>
                        <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold mb-2">
                          {member.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                          {member.experience}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          Expertise: {member.expertise}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

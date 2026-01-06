import { useQuery } from '@tanstack/react-query'
import { ref, get } from 'firebase/database'
import { db } from '../../services/firebase'
import { useSectionHeaders } from '../../hooks/firebase'

export function MissionVision() {
  const { data: sectionHeader } = useSectionHeaders('missionVision')

  // Fetch mission data from Firebase
  const { data: missionData, isLoading: missionLoading } = useQuery({
    queryKey: ['siteContent', 'about', 'mission'],
    queryFn: async () => {
      const snapshot = await get(ref(db, 'siteContent/about/mission'))
      return snapshot.exists() ? snapshot.val() : null
    },
    staleTime: 5 * 60 * 1000,
  })

  // Fetch vision data from Firebase
  const { data: visionData, isLoading: visionLoading } = useQuery({
    queryKey: ['siteContent', 'about', 'vision'],
    queryFn: async () => {
      const snapshot = await get(ref(db, 'siteContent/about/vision'))
      return snapshot.exists() ? snapshot.val() : null
    },
    staleTime: 5 * 60 * 1000,
  })

  const isLoading = missionLoading || visionLoading

  // Fallback defaults
  const mission = {
    title: missionData?.title || 'Our Mission',
    statement: missionData?.statement || 'To empower organizations and professionals across India and beyond with world-class quality management expertise, enabling them to achieve operational excellence and sustainable competitive advantage.',
    points: missionData?.points || [
      'Deliver world-class Lean Six Sigma training and certification programs',
      'Provide strategic consultancy for measurable business transformation',
      'Foster a culture of continuous improvement across industries',
    ],
  }

  const vision = {
    title: visionData?.title || 'Our Vision',
    statement: visionData?.statement || 'To be recognized as the leading catalyst for operational excellence in Asia, transforming one million professionals and one thousand organizations by 2030 through innovative quality management solutions.',
    points: visionData?.points || [
      'Expand our global footprint to 25+ countries by 2030',
      'Pioneer AI-driven quality management methodologies',
      'Create sustainable impact through green belt and beyond initiatives',
    ],
  }

  if (isLoading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-accent-50 to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            {[1, 2].map(i => (
              <div key={i} className="flex-1">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 lg:p-10 h-full animate-pulse">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                    <div className="flex-1 space-y-4">
                      <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="space-y-3">
                        {[1, 2, 3].map(j => (
                          <div key={j} className="h-5 bg-gray-200 dark:bg-gray-700 rounded" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-accent-50 to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {sectionHeader?.title || 'Our Mission & Vision'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {sectionHeader?.description || 'Guided by our commitment to excellence and driven by our vision for the future'}
          </p>
        </div>

        {/* Mission & Vision - Flexbox Split Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mission Card */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 lg:p-10 h-full">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {mission.title}
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {mission.statement}
                  </p>
                  <ul className="space-y-3">
                    {(Array.isArray(mission.points) ? mission.points : []).map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Vision Card */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 lg:p-10 h-full">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-700 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {vision.title}
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {vision.statement}
                  </p>
                  <ul className="space-y-3">
                    {(Array.isArray(vision.points) ? vision.points : []).map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-accent-600 dark:text-accent-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

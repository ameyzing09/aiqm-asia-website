import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'
import { useHero, useStats } from '../../hooks/firebase'

export function ConsultancyHero() {
  const { data: hero, isLoading: heroLoading } = useHero('consultancy')
  const { data: stats, isLoading: statsLoading } = useStats()

  const isLoading = heroLoading || statsLoading

  // Get specific stats for display
  const projectsStat = stats?.find(s => s.id === 'projects')
  const industriesStat = stats?.find(s => s.id === 'industries')
  const roiStat = stats?.find(s => s.id === 'roi')

  // Fallback values
  const headline = hero?.headline || 'Driving Business Excellence'
  const highlightText = hero?.highlightText || 'Through Consultancy'
  const subheadline =
    hero?.subheadline ||
    'Partner with AIQM India to transform your operations, reduce costs, and achieve sustainable growth through proven methodologies and expert guidance.'
  const badge = hero?.badge || 'Expert Consulting Services'
  const primaryCtaText = hero?.primaryCtaText || 'Request Consultation'
  const primaryCtaLink = hero?.primaryCtaLink || '#request-consultation'
  const secondaryCtaText = hero?.secondaryCtaText || 'View Case Studies'
  const secondaryCtaLink = hero?.secondaryCtaLink || '#case-studies'
  const heroImage = hero?.heroImage || hero?.backgroundImage

  if (isLoading) {
    return (
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb skeleton */}
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse" />

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Side Skeleton */}
            <div className="flex-1 space-y-6">
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="space-y-3">
                <div className="h-12 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-12 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="flex gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-2">
                    <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <div className="h-12 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="h-12 w-36 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Right Side Skeleton */}
            <div className="flex-1 order-first lg:order-last">
              <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="consultancy"
      className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">
                Home
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li className="font-medium text-gray-900 dark:text-white">Consultancy</li>
          </ol>
        </nav>

        {/* Hero Content - Split Layout */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="flex-1">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6">
              <svg
                className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                {badge}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              {headline}
              <br />
              <span className="text-primary-600 dark:text-primary-400">{highlightText}</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 animate-slide-up">
              {subheadline}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {projectsStat
                    ? `${projectsStat.value?.toLocaleString?.() || projectsStat.value}${projectsStat.suffix || ''}`
                    : '15,000+'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {projectsStat?.label || 'Projects Delivered'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {industriesStat ? `${industriesStat.value}${industriesStat.suffix || ''}` : '50+'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {industriesStat?.label || 'Industries Served'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {roiStat ? `${roiStat.value}${roiStat.suffix || '%'}` : '35%'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {roiStat?.label || 'Avg ROI Increase'}
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href={primaryCtaLink} variant="primary" size="lg">
                {primaryCtaText}
              </Button>
              <Button href={secondaryCtaLink} variant="secondary" size="lg">
                {secondaryCtaText}
              </Button>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="flex-1 order-first lg:order-last">
            <div className="relative">
              {/* Main Image */}
              <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 via-primary-50 to-accent-100 dark:from-primary-900 dark:via-gray-800 dark:to-accent-900 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
                {heroImage ? (
                  <img
                    src={heroImage}
                    alt="Consultancy Services"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-8">
                    <svg
                      className="w-24 h-24 mx-auto text-primary-600 dark:text-primary-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Image Placeholder: Consultancy Team
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Recommended: Professional team photo or consultation scene
                    </p>
                  </div>
                )}
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent-500 rounded-full opacity-10 blur-2xl" />
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary-500 rounded-full opacity-10 blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

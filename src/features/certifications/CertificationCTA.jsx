import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'
import { useCtaBanners, useGlobal } from '../../hooks/firebase'

// Loading skeleton
function CTASkeleton() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 rounded-2xl p-8 lg:p-12 shadow-2xl animate-pulse">
          <div className="text-center">
            <div className="h-8 w-48 bg-white/20 rounded-full mx-auto mb-6" />
            <div className="h-12 w-3/4 bg-white/20 rounded mx-auto mb-4" />
            <div className="h-6 w-2/3 bg-white/20 rounded mx-auto mb-8" />
            <div className="flex justify-center gap-4 mb-8">
              <div className="h-12 w-40 bg-white/20 rounded-lg" />
              <div className="h-12 w-40 bg-white/20 rounded-lg" />
            </div>
            <div className="flex justify-center gap-6">
              <div className="h-5 w-40 bg-white/20 rounded" />
              <div className="h-5 w-40 bg-white/20 rounded" />
              <div className="h-5 w-40 bg-white/20 rounded" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center animate-pulse">
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-600 rounded mx-auto mb-2" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CertificationCTA() {
  const { data: ctaBanner, isLoading: ctaLoading } = useCtaBanners('certifications')
  const { data: global, isLoading: globalLoading } = useGlobal()

  const isLoading = ctaLoading || globalLoading

  if (isLoading) {
    return <CTASkeleton />
  }

  // Get contact info from global
  const contact = global?.contact || {}

  // CTA content with fallbacks
  const headline = ctaBanner?.headline || 'Ready to Get Certified?'
  const subheadline = ctaBanner?.subheadline || 'Join thousands of professionals who have transformed their careers with globally recognized certifications.'
  const badge = ctaBanner?.batchInfo || 'Limited Seats Available'
  const primaryCtaText = ctaBanner?.primaryCtaText || 'Get Certified Today'
  const secondaryCtaText = ctaBanner?.secondaryCtaText || 'Browse Courses'
  const trustIndicator1 = ctaBanner?.trustIndicator1 || 'Next batch starting soon'
  const trustIndicator2 = ctaBanner?.trustIndicator2 || 'Flexible payment options'
  const trustIndicator3 = ctaBanner?.trustIndicator3 || 'Lifetime certification'

  return (
    <section id="get-certified" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Main CTA Card */}
        <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 rounded-2xl p-8 lg:p-12 shadow-2xl">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-white">{badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              {headline}
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              {subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                href={ctaBanner?.primaryCtaLink || '#enroll'}
                variant="secondary"
                size="lg"
                className="bg-white hover:bg-gray-100 text-primary-700 border-none shadow-xl"
              >
                {primaryCtaText}
              </Button>
              <Link to={ctaBanner?.secondaryCtaLink || '/courses'}>
                <Button
                  size="lg"
                  className="bg-accent-600 hover:bg-accent-700 text-white border-2 border-white/30"
                >
                  {secondaryCtaText}
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-primary-100 text-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {trustIndicator1}
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {trustIndicator2}
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {trustIndicator3}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info - from useGlobal */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Have questions? Our certification advisors are here to help
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm">
            {contact.phone && (
              <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} className="flex items-center text-primary-600 dark:text-primary-400 hover:underline">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {contact.phone}
              </a>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="flex items-center text-primary-600 dark:text-primary-400 hover:underline">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {contact.email}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

import { Button } from '../../components/Button'
import { useCtaBanners, useGlobal } from '../../hooks/firebase'

// Loading skeleton
function CTABannerSkeleton() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600">
      <div className="max-w-4xl mx-auto text-center animate-pulse">
        <div className="h-12 w-3/4 bg-white/20 rounded mx-auto mb-4" />
        <div className="h-6 w-2/3 bg-white/20 rounded mx-auto mb-8" />
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <div className="h-12 w-40 bg-white/20 rounded-lg mx-auto sm:mx-0" />
          <div className="h-12 w-44 bg-white/20 rounded-lg mx-auto sm:mx-0" />
        </div>
        <div className="h-5 w-72 bg-white/20 rounded mx-auto" />
      </div>
    </section>
  )
}

export function CTABanner() {
  const { data: ctaBanner, isLoading: ctaLoading } = useCtaBanners('courses')
  const { data: global } = useGlobal()

  if (ctaLoading) {
    return <CTABannerSkeleton />
  }

  // Content with fallbacks
  const headline = ctaBanner?.headline || 'Ready to accelerate your career?'
  const subheadline =
    ctaBanner?.subheadline ||
    'Join our next batch today and become a certified quality excellence professional!'
  const primaryCtaText = ctaBanner?.primaryCtaText || 'Get Started Today'
  const secondaryCtaText = ctaBanner?.secondaryCtaText || 'Talk to Our Advisors'
  const batchInfo = ctaBanner?.batchInfo || 'New batches starting soon'

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">{headline}</h2>
        <p className="text-xl text-primary-100 mb-8">{subheadline}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            href={ctaBanner?.primaryCtaLink || global?.enquiryLink || '#enroll'}
            target={ctaBanner?.primaryCtaLink || global?.enquiryLink ? '_blank' : undefined}
            rel={
              ctaBanner?.primaryCtaLink || global?.enquiryLink ? 'noopener noreferrer' : undefined
            }
            variant="secondary"
            size="lg"
            className="bg-white hover:bg-gray-100 text-primary-700 border-none shadow-xl"
          >
            {primaryCtaText}
          </Button>
          <Button
            href={ctaBanner?.secondaryCtaLink || '#contact'}
            size="lg"
            className="bg-accent-600 hover:bg-accent-700 text-white border-2 border-white/30"
          >
            {secondaryCtaText}
          </Button>
        </div>
        <p className="text-primary-100 text-sm mt-6">{batchInfo}</p>
      </div>
    </section>
  )
}

import { useMemo } from 'react'
import { Button } from '../../components/Button'
import { useStats, useTestimonials, useSectionHeaders, useGlobal } from '../../hooks/firebase'

export function ConsultancyCTA() {
  const { data: stats, isLoading: statsLoading } = useStats()
  const { data: testimonials, isLoading: testimonialsLoading } = useTestimonials()
  const { data: sectionHeader } = useSectionHeaders('consultancyCta')
  const { data: global, isLoading: globalLoading } = useGlobal()

  const isLoading = statsLoading || testimonialsLoading || globalLoading

  // Contact info from global with fallbacks
  const contact = global?.contact || {
    phone: '+91 (800) 123-4567',
    email: 'consultancy@aiqmindia.com',
  }

  // Get specific stats for display
  const roiStat = useMemo(() => stats?.find(s => s.id === 'roi'), [stats])
  const projectsStat = useMemo(() => stats?.find(s => s.id === 'projects'), [stats])
  const satisfactionStat = useMemo(() => stats?.find(s => s.id === 'satisfaction'), [stats])
  const industriesStat = useMemo(() => stats?.find(s => s.id === 'industries'), [stats])

  // Get featured testimonial (first active one with highest rating)
  const featuredTestimonial = useMemo(() => {
    if (!testimonials || testimonials.length === 0) return null
    const active = testimonials.filter(t => t.active !== false)
    const sorted = active.sort((a, b) => (b.rating || 5) - (a.rating || 5))
    return sorted[0] || null
  }, [testimonials])

  // Stats display data
  const statsDisplay = [
    {
      value: roiStat ? `${roiStat.value}${roiStat.suffix || '%'}` : '35%',
      label: roiStat?.label || 'Average ROI Increase',
    },
    {
      value: projectsStat ? `${projectsStat.value?.toLocaleString?.() || projectsStat.value}${projectsStat.suffix || ''}` : '15,000+',
      label: projectsStat?.label || 'Projects Delivered',
    },
    {
      value: satisfactionStat ? `${satisfactionStat.value}${satisfactionStat.suffix || '%'}` : '98%',
      label: satisfactionStat?.label || 'Client Satisfaction',
    },
    {
      value: industriesStat ? `${industriesStat.value}${industriesStat.suffix || ''}` : '50+',
      label: industriesStat?.label || 'Industries Served',
    },
  ]

  if (isLoading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <div className="h-8 w-40 bg-white/20 rounded-full mx-auto mb-6 animate-pulse" />
            <div className="space-y-3 mb-8">
              <div className="h-12 w-3/4 bg-white/20 rounded mx-auto animate-pulse" />
              <div className="h-12 w-1/2 bg-white/20 rounded mx-auto animate-pulse" />
            </div>
            <div className="h-16 w-2/3 bg-white/20 rounded mx-auto mb-12 animate-pulse" />
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex-1 min-w-[calc(50%-0.75rem)] md:min-w-[calc(25%-1.125rem)] bg-white/10 rounded-lg p-6 animate-pulse">
                  <div className="h-8 w-20 bg-white/20 rounded mx-auto mb-2" />
                  <div className="h-4 w-24 bg-white/20 rounded mx-auto" />
                </div>
              ))}
            </div>
            <div className="flex gap-4 justify-center mb-8">
              <div className="h-12 w-40 bg-white/20 rounded-lg animate-pulse" />
              <div className="h-12 w-32 bg-white/20 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="request-consultation" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600">
      <div className="max-w-5xl mx-auto">
        {/* Main CTA Card */}
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold text-white">Proven Track Record</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {sectionHeader?.title || 'Partner with AIQM for Measurable ROI'}
          </h2>

          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            {sectionHeader?.description || 'Transform your business with data-driven strategies and expert consulting. Join 500+ companies that have achieved sustainable growth with us.'}
          </p>

          {/* Stats Flex */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {statsDisplay.map((stat, index) => (
              <div
                key={index}
                className="flex-1 min-w-[calc(50%-0.75rem)] md:min-w-[calc(25%-1.125rem)] bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
              >
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              href="#contact"
              variant="secondary"
              size="lg"
              className="bg-white hover:bg-gray-100 text-primary-700 border-none shadow-xl"
            >
              Request Consultation
            </Button>
            <Button
              href={`tel:${contact.phone?.replace(/[^+\d]/g, '') || '+918001234567'}`}
              size="lg"
              className="bg-accent-600 hover:bg-accent-700 text-white border-2 border-white/30"
            >
              Call Now
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-primary-100 text-sm mb-12">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Free initial consultation
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No obligation quote
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Flexible engagement models
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 max-w-3xl mx-auto">
            <svg className="w-10 h-10 text-white/40 mb-4 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <p className="text-lg text-white italic mb-4">
              &quot;{featuredTestimonial?.quote || "AIQM India's consultancy services transformed our operations. We achieved a 40% efficiency gain and ₹8 Cr in annual savings within the first year."}&quot;
            </p>
            <div className="text-primary-100">
              {featuredTestimonial ? (
                <>
                  <span className="font-semibold">{featuredTestimonial.author}</span>
                  {featuredTestimonial.role && `, ${featuredTestimonial.role}`}
                  {featuredTestimonial.company && ` • ${featuredTestimonial.company}`}
                </>
              ) : (
                <>
                  <span className="font-semibold">VP Operations</span> • Fortune 500 Logistics Company
                </>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 text-center border-t border-white/20 pt-8">
          <p className="text-primary-100 mb-4">
            Prefer to discuss your project directly? Our consultancy team is ready to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm">
            {contact.phone && (
              <a
                href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}
                className="flex items-center text-white hover:text-primary-100 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {contact.phone}
              </a>
            )}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center text-white hover:text-primary-100 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {contact.email}
              </a>
            )}
            <a
              href="#contact"
              className="flex items-center text-white hover:text-primary-100 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Schedule a Meeting
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

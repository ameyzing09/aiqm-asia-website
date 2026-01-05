import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'
import { useHero, useStats } from '../../hooks/firebase'

export function Hero() {
  const { data: hero, isLoading: heroLoading } = useHero('home')
  const { data: stats, isLoading: statsLoading } = useStats()

  // Build dynamic subheadline from stats
  const subheadline = useMemo(() => {
    if (!stats?.length) return ''
    const professionals = stats.find(s => s.id === 'professionals')
    const belts = stats.find(s => s.id === 'belts')
    const countries = stats.find(s => s.id === 'countries')

    const parts = []
    if (professionals) parts.push(`${professionals.value?.toLocaleString?.() || professionals.value}${professionals.suffix || ''} professionals trained`)
    if (belts) parts.push(`${belts.value?.toLocaleString?.() || belts.value}${belts.suffix || ''} belts certified`)
    if (countries) parts.push(`${countries.value} countries served`)

    return parts.join(' | ')
  }, [stats])

  // Default content (fallback if Firebase is empty)
  const defaultContent = {
    headline: "India's Leading Institute for",
    highlightText: "Lean Six Sigma & Quality Excellence",
    primaryCtaText: "Explore Courses",
    primaryCtaLink: "/courses",
    secondaryCtaText: "Get Certified",
    secondaryCtaLink: "/certifications",
  }

  const isLoading = heroLoading || statsLoading

  return (
    <section
      id="home"
      className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Headline */}
          {isLoading ? (
            <div className="animate-pulse mb-6">
              <div className="h-12 w-96 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
              <div className="h-12 w-80 bg-primary-200 dark:bg-primary-900 rounded mx-auto" />
            </div>
          ) : (
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              {hero?.headline || defaultContent.headline}
              <br />
              <span className="text-primary-600 dark:text-primary-400">
                {hero?.highlightText || defaultContent.highlightText}
              </span>
            </h1>
          )}

          {/* Subheadline with dynamic stats */}
          {isLoading ? (
            <div className="animate-pulse mb-4">
              <div className="h-6 w-[500px] max-w-full bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ) : (
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl animate-slide-up">
              {hero?.subheadline || subheadline || '95,000+ professionals trained | 40,000+ belts certified | 13 countries served'}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto sm:justify-center">
            <Link to={hero?.primaryCtaLink || defaultContent.primaryCtaLink}>
              <Button variant="primary" size="lg">
                {hero?.primaryCtaText || defaultContent.primaryCtaText}
              </Button>
            </Link>
            <Link to={hero?.secondaryCtaLink || defaultContent.secondaryCtaLink}>
              <Button variant="secondary" size="lg">
                {hero?.secondaryCtaText || defaultContent.secondaryCtaText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

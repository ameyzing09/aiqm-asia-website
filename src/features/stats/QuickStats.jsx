import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { useStats } from '../../hooks/firebase'
import { StatCounter } from './StatCounter'

export function QuickStats() {
  const [statsRef, isVisible] = useScrollAnimation(0.3)
  const { data: stats, isLoading } = useStats()

  return (
    <section ref={statsRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600 dark:bg-primary-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
          {isLoading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="h-12 w-24 bg-white/20 rounded mb-2" />
                <div className="h-4 w-32 bg-white/20 rounded" />
              </div>
            ))
          ) : (
            stats?.map((stat, index) => (
              <StatCounter key={stat.id} stat={stat} isVisible={isVisible} delay={index * 100} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}

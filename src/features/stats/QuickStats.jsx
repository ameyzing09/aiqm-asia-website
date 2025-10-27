import { STATS } from '../../constants/stats'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { StatCounter } from './StatCounter'

export function QuickStats() {
  const [statsRef, isVisible] = useScrollAnimation(0.3)

  return (
    <section ref={statsRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600 dark:bg-primary-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
          {STATS.map((stat, index) => (
            <StatCounter key={stat.id} stat={stat} isVisible={isVisible} delay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

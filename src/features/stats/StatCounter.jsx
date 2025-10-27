import { useState, useEffect } from 'react'

export function StatCounter({ stat, isVisible, delay }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const timeout = setTimeout(() => {
      const duration = 2000
      const steps = 60
      const increment = stat.value / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= stat.value) {
          setCount(stat.value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }, delay)

    return () => clearTimeout(timeout)
  }, [isVisible, stat.value, delay])

  return (
    <div className="flex flex-col items-center text-center min-w-[150px]">
      <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
        {count.toLocaleString()}
        {stat.suffix}
      </div>
      <div className="text-primary-100 text-sm lg:text-base font-medium">{stat.label}</div>
    </div>
  )
}

import { useState, useEffect } from 'react'

export function useCarousel(itemsCount, autoRotateInterval = 5000) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotation effect
  useEffect(() => {
    if (autoRotateInterval) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % itemsCount)
      }, autoRotateInterval)
      return () => clearInterval(interval)
    }
  }, [itemsCount, autoRotateInterval])

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % itemsCount)
  }

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + itemsCount) % itemsCount)
  }

  const goToIndex = index => {
    setCurrentIndex(index)
  }

  return {
    currentIndex,
    goToNext,
    goToPrevious,
    goToIndex,
  }
}

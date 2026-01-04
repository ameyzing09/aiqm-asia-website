import { useFirebaseQuery } from '../useFirebaseQuery'

/**
 * Hook to fetch testimonials from Firebase RTDB.
 * Transforms Firebase object to sorted array.
 */
export const useTestimonials = () => {
  return useFirebaseQuery(['testimonials'], (data) => {
    if (!data) return []
    return Object.entries(data)
      .map(([id, item]) => ({ id, ...item }))
      .sort((a, b) => a.order - b.order)
  })
}

import { useFirebaseQuery } from '../useFirebaseQuery'

/**
 * Hook to fetch testimonials from Firebase RTDB.
 * Transforms Firebase object to sorted array.
 */
export const useTestimonials = () => {
  return useFirebaseQuery(['testimonials'], (data) => {
    if (!data) return []

    // DEFENSIVE: Handle both array and object formats from Firebase
    const items = Array.isArray(data)
      ? data.map((item, index) => ({
          id: item.id || `testimonial-${index}`,
          ...item
        }))
      : Object.entries(data).map(([id, item]) => ({ id, ...item }))

    return items
      .map((item) => ({
        id: item.id,
        quote: item.quote || '',
        author: item.author || '',
        role: item.role || '',
        company: item.company || '',
        rating: item.rating ?? 5,
        featured: item.featured ?? false,
        order: item.order ?? 999,
      }))
      .sort((a, b) => a.order - b.order)
  })
}

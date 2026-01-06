import { useFirebaseQuery } from '../useFirebaseQuery'

/**
 * Hook to fetch industries from Firebase RTDB.
 * Transforms Firebase object to sorted array.
 */
export const useIndustries = () => {
  return useFirebaseQuery(['industries'], (data) => {
    if (!data) return []

    // DEFENSIVE: Handle both array and object formats from Firebase
    const items = Array.isArray(data)
      ? data.map((item, index) => ({
          id: item.id || `industry-${index}`,
          ...item
        }))
      : Object.entries(data).map(([id, item]) => ({ id, ...item }))

    return items
      .map((item) => ({
        id: item.id,
        name: item.name || '',
        description: item.description || '',
        projects: item.projects || '',
        order: item.order ?? 999,
      }))
      .sort((a, b) => a.order - b.order)
  })
}

import { useFirebaseQuery } from '../useFirebaseQuery'

/**
 * Hook to fetch industries from Firebase RTDB.
 * Transforms Firebase object to sorted array.
 */
export const useIndustries = () => {
  return useFirebaseQuery(['industries'], (data) => {
    if (!data) return []
    return Object.entries(data)
      .map(([id, item]) => ({ id, ...item }))
      .sort((a, b) => a.order - b.order)
  })
}

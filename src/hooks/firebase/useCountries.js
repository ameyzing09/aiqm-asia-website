import { useFirebaseQuery } from '../useFirebaseQuery'

/**
 * Hook to fetch countries from Firebase RTDB.
 * Transforms Firebase object to sorted array.
 */
export const useCountries = () => {
  return useFirebaseQuery(['countries'], (data) => {
    if (!data) return []
    return Object.entries(data)
      .map(([id, item]) => ({ id, ...item }))
      .sort((a, b) => a.order - b.order)
  })
}

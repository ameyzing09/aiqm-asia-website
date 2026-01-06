import { useFirebaseQuery } from '../useFirebaseQuery'

/**
 * Hook to fetch countries from Firebase RTDB.
 * Transforms Firebase object to sorted array.
 */
export const useCountries = () => {
  return useFirebaseQuery(['countries'], (data) => {
    if (!data) return []

    // DEFENSIVE: Handle both array and object formats from Firebase
    const items = Array.isArray(data)
      ? data.map((item, index) => ({
          id: item.id || `country-${index}`,
          ...item
        }))
      : Object.entries(data).map(([id, item]) => ({ id, ...item }))

    return items
      .map((item) => ({
        id: item.id,
        name: item.name || '',
        flag: item.flag || '',
        order: item.order ?? 999,
      }))
      .sort((a, b) => a.order - b.order)
  })
}

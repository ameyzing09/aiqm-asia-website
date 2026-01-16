import { useFirebaseQuery } from '../useFirebaseQuery'

/**
 * Hook to fetch accreditation data from Firebase RTDB.
 * Path: siteContent/accreditations
 * Returns: Array of accreditation objects with features
 */
export const useAccreditations = () => {
  return useFirebaseQuery(['accreditations'], data => {
    if (!data) return []

    // DEFENSIVE: Handle both array and object formats from Firebase
    const items = Array.isArray(data)
      ? data.map((item, index) => ({
          id: item.id || `accreditation-${index}`,
          ...item,
        }))
      : Object.entries(data).map(([id, item]) => ({ id, ...item }))

    return items
      .map(item => ({
        id: item.id,
        name: item.name || '',
        fullName: item.fullName || '',
        description: item.description || '',
        colorFrom: item.colorFrom || 'blue-500',
        colorTo: item.colorTo || 'blue-700',
        features: Array.isArray(item.features)
          ? item.features
          : item.features
            ? Object.values(item.features)
            : [],
        order: item.order ?? 999,
      }))
      .sort((a, b) => a.order - b.order)
  })
}

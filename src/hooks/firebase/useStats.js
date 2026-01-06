import { useFirebaseQuery } from '../useFirebaseQuery'

/**
 * Hook to fetch stats from Firebase RTDB.
 * Transforms Firebase object to sorted array.
 */
export const useStats = () => {
  return useFirebaseQuery(['stats'], (data) => {
    if (!data) return []

    // DEFENSIVE: Handle both array and object formats from Firebase
    const items = Array.isArray(data)
      ? data.map((item, index) => ({
          id: item.id || `stat-${index}`,
          ...item
        }))
      : Object.entries(data).map(([id, item]) => ({ id, ...item }))

    return items
      .map((item) => ({
        id: item.id,
        label: item.label || '',
        value: Number(item.value) || 0,
        suffix: item.suffix || '',
        order: item.order ?? 999,
      }))
      .sort((a, b) => a.order - b.order)
  })
}

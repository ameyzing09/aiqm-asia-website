import { useFirebaseQuery } from '../useFirebaseQuery'

/**
 * Hook to fetch stats from Firebase RTDB.
 * Transforms Firebase object to sorted array.
 */
export const useStats = () => {
  return useFirebaseQuery(['stats'], (data) => {
    if (!data) return []
    return Object.entries(data)
      .map(([id, item]) => ({
        id,
        label: item.label || '',
        value: Number(item.value) || 0,
        suffix: item.suffix || '',
        order: item.order || 0
      }))
      .sort((a, b) => a.order - b.order)
  })
}

import { useFirebaseQuery } from '../useFirebaseQuery'

/**
 * Hook to fetch certification benefits from Firebase RTDB.
 * Path: siteContent/certificationBenefits
 * Returns: Array of benefit objects
 */
export const useCertificationBenefits = () => {
  return useFirebaseQuery(['certificationBenefits'], data => {
    if (!data) return []

    // DEFENSIVE: Handle both array and object formats from Firebase
    const items = Array.isArray(data)
      ? data.map((item, index) => ({
          id: item.id || `benefit-${index}`,
          ...item,
        }))
      : Object.entries(data).map(([id, item]) => ({ id, ...item }))

    return items
      .map(item => ({
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        iconType: item.iconType || 'money', // money, globe, education
        order: item.order ?? 999,
      }))
      .sort((a, b) => a.order - b.order)
  })
}

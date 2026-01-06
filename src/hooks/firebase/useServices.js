import { useQuery } from '@tanstack/react-query'
import { ref, get } from 'firebase/database'
import { db } from '../../services/firebase'

/**
 * Hook to fetch services and their deliverables from Firebase RTDB.
 * Merges services with serviceDeliverables.
 */
export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      // Fetch services and deliverables in parallel with graceful degradation
      const results = await Promise.allSettled([
        get(ref(db, 'siteContent/services')),
        get(ref(db, 'siteContent/serviceDeliverables'))
      ])

      // Extract values, defaulting to empty on rejection
      const servicesData = results[0].status === 'fulfilled' && results[0].value.exists()
        ? results[0].value.val() : {}
      const deliverablesData = results[1].status === 'fulfilled' && results[1].value.exists()
        ? results[1].value.val() : {}

      // DEFENSIVE: Handle both array and object formats from Firebase
      const servicesItems = Array.isArray(servicesData)
        ? servicesData.map((item, index) => ({
            id: item.id || `service-${index}`,
            ...item
          }))
        : Object.entries(servicesData).map(([id, item]) => ({ id, ...item }))

      // Transform and merge
      return servicesItems
        .map((item) => {
          // DEFENSIVE: Get deliverables for this service with Array.isArray check
          const serviceDeliverables = deliverablesData[item.id] || {}
          const deliverables = Array.isArray(serviceDeliverables)
            ? serviceDeliverables
            : Object.values(serviceDeliverables)

          return {
            id: item.id,
            title: item.title || '',
            description: item.description || '',
            colorTheme: item.colorTheme || 'blue',
            image: item.image || '',
            order: item.order ?? 999,
            deliverables
          }
        })
        .sort((a, b) => a.order - b.order)
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

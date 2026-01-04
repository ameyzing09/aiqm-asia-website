import { useQuery } from '@tanstack/react-query'
import { ref, get } from 'firebase/database'
import { db } from '../../services/firebase'

/**
 * Hook to fetch leadership data from Firebase RTDB.
 * Combines director info, director's message, and faculty list.
 */
export const useLeadership = () => {
  return useQuery({
    queryKey: ['leadership'],
    queryFn: async () => {
      // Fetch all required data in parallel with graceful degradation
      const results = await Promise.allSettled([
        get(ref(db, 'siteContent/leadership')),
        get(ref(db, 'siteContent/faculty')),
        get(ref(db, 'siteContent/about'))
      ])

      // Extract values, defaulting to empty on rejection
      const leadership = results[0].status === 'fulfilled' && results[0].value.exists()
        ? results[0].value.val() : {}
      const facultyData = results[1].status === 'fulfilled' && results[1].value.exists()
        ? results[1].value.val() : {}
      const about = results[2].status === 'fulfilled' && results[2].value.exists()
        ? results[2].value.val() : {}

      // Transform faculty to sorted array
      const faculty = Object.entries(facultyData)
        .map(([id, item]) => ({
          id,
          name: item.name || '',
          title: item.title || '',
          experience: item.experience || '',
          expertise: item.expertise || '',
          photoUrl: item.photoUrl || '',
          order: item.order || 0
        }))
        .sort((a, b) => a.order - b.order)

      // Transform director impact to array
      const directorImpact = leadership.directorImpact
        ? Object.values(leadership.directorImpact)
        : []

      return {
        director: leadership.director || {},
        directorImpact,
        directorsMessage: about.directorsMessage || '',
        faculty
      }
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

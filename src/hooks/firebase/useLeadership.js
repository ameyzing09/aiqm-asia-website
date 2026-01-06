import { useQuery } from '@tanstack/react-query'
import { ref, get } from 'firebase/database'
import { db } from '../../services/firebase'

/**
 * Hook to fetch leadership data from Firebase RTDB.
 * Combines director info, director's message, and faculty list.
 * Path: siteContent/leadership + siteContent/faculty
 */
export const useLeadership = () => {
  return useQuery({
    queryKey: ['leadership'],
    queryFn: async () => {
      // Fetch leadership, faculty, and about (fallback for directorsMessage) in parallel
      const results = await Promise.allSettled([
        get(ref(db, 'siteContent/leadership')),
        get(ref(db, 'siteContent/faculty')),
        get(ref(db, 'siteContent/about')),
      ])

      // DEFENSIVE: Extract with fallback to empty object
      const leadership = results[0].status === 'fulfilled' && results[0].value.exists()
        ? results[0].value.val() : {}
      const facultyData = results[1].status === 'fulfilled' && results[1].value.exists()
        ? results[1].value.val() : {}
      const aboutData = results[2].status === 'fulfilled' && results[2].value.exists()
        ? results[2].value.val() : {}

      // DEFENSIVE: Faculty transformation with Array.isArray check + ID generation
      const facultyItems = Array.isArray(facultyData)
        ? facultyData.map((item, index) => ({
            id: item.id || `faculty-${index}`,
            ...item
          }))
        : Object.entries(facultyData).map(([id, item]) => ({ id, ...item }))

      const faculty = facultyItems
        .map((item) => ({
          id: item.id || '',
          name: item.name || '',
          title: item.title || '',
          experience: item.experience || '',
          expertise: item.expertise || '',
          photoUrl: item.photoUrl || '',
          order: item.order ?? 999,
        }))
        .sort((a, b) => a.order - b.order)

      // DEFENSIVE: DirectorImpact with Array.isArray check and SORTING
      const impactData = leadership.directorImpact || {}
      const impactItems = Array.isArray(impactData)
        ? impactData.map((item, index) => ({
            id: item.id || `impact-${index}`,
            ...(typeof item === 'object' ? item : { text: item })
          }))
        : Object.entries(impactData).map(([id, item]) => ({
            id,
            ...(typeof item === 'object' ? item : { text: item })
          }))

      const directorImpact = impactItems
        .map((item) => ({
          text: typeof item === 'string' ? item : (item.text || ''),
          order: typeof item === 'object' ? (item.order ?? 999) : 999,
        }))
        .sort((a, b) => a.order - b.order)

      // DEFENSIVE: Director with field-level defaults
      const director = {
        name: leadership.director?.name || '',
        title: leadership.director?.title || '',
        education: leadership.director?.education || '',
        credentials: leadership.director?.credentials || '',
        experience: leadership.director?.experience || '',
        recognition: leadership.director?.recognition || '',
        photoUrl: leadership.director?.photoUrl || '',
      }

      // DEFENSIVE: Try multiple paths for director's message (leadership, then about.director.message)
      const directorsMessage = leadership.directorMessage
        || aboutData?.director?.message
        || ''

      return {
        director,
        directorImpact,
        directorsMessage,
        faculty,
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}

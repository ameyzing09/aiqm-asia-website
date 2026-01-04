import { useQuery } from '@tanstack/react-query'
import { ref, get } from 'firebase/database'
import { db } from '../../services/firebase'

/**
 * Hook to fetch case studies and their outcomes from Firebase RTDB.
 * Merges caseStudies with caseStudyOutcomes.
 */
export const useCaseStudies = () => {
  return useQuery({
    queryKey: ['caseStudies'],
    queryFn: async () => {
      // Fetch case studies and outcomes in parallel with graceful degradation
      const results = await Promise.allSettled([
        get(ref(db, 'siteContent/caseStudies')),
        get(ref(db, 'siteContent/caseStudyOutcomes'))
      ])

      // Extract values, defaulting to empty on rejection
      const studiesData = results[0].status === 'fulfilled' && results[0].value.exists()
        ? results[0].value.val() : {}
      const outcomesData = results[1].status === 'fulfilled' && results[1].value.exists()
        ? results[1].value.val() : {}

      // Transform and merge
      return Object.entries(studiesData)
        .map(([id, item]) => {
          // Get outcomes for this case study and convert to array
          const studyOutcomes = outcomesData[id] || {}
          const outcomes = Object.values(studyOutcomes)

          return {
            id,
            industry: item.industry || '',
            companySize: item.companySize || '',
            challenge: item.challenge || '',
            solution: item.solution || '',
            timeline: item.timeline || '',
            teamSize: item.teamSize || '',
            colorTheme: item.colorTheme || 'blue',
            order: item.order || 0,
            outcomes
          }
        })
        .sort((a, b) => a.order - b.order)
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

import { useQuery } from '@tanstack/react-query'
import { ref, get } from 'firebase/database'
import { db } from '../../services/firebase'

/**
 * Hook to fetch feature blocks from Firebase RTDB.
 * Path: siteContent/featureBlocks + siteContent/featureBlockBenefits
 * Returns: Array of feature block objects with nested benefits
 */
export const useFeatureBlocks = () => {
  return useQuery({
    queryKey: ['featureBlocks'],
    queryFn: async () => {
      const results = await Promise.allSettled([
        get(ref(db, 'siteContent/featureBlocks')),
        get(ref(db, 'siteContent/featureBlockBenefits')),
      ])

      // DEFENSIVE: Extract with fallback to empty object
      const blocksData =
        results[0].status === 'fulfilled' && results[0].value.exists() ? results[0].value.val() : {}
      const benefitsData =
        results[1].status === 'fulfilled' && results[1].value.exists() ? results[1].value.val() : {}

      // DEFENSIVE: Handle both array and object formats
      const blockItems = Array.isArray(blocksData)
        ? blocksData.map((item, index) => ({
            id: item.id || `block-${index}`,
            ...item,
          }))
        : Object.entries(blocksData).map(([id, item]) => ({ id, ...item }))

      return blockItems
        .map(block => {
          // Get nested benefits with defensive handling
          const blockBenefits = benefitsData[block.id] || {}
          const benefits = Array.isArray(blockBenefits)
            ? blockBenefits
            : Object.values(blockBenefits)

          return {
            id: block.id,
            title: block.title || '',
            description: block.description || '',
            iconType: block.iconType || 'globe', // globe, education, briefcase
            colorFrom: block.colorFrom || 'blue-500',
            colorTo: block.colorTo || 'blue-700',
            benefits: benefits
              .map((b, idx) => ({
                text: typeof b === 'string' ? b : b.text || '',
                order: b.order ?? idx,
              }))
              .sort((a, b) => a.order - b.order)
              .map(b => b.text),
            order: block.order ?? 999,
          }
        })
        .sort((a, b) => a.order - b.order)
    },
    staleTime: 5 * 60 * 1000,
  })
}

import { useFirebaseQuery } from '../useFirebaseQuery'

/**
 * Hook to fetch story section content from Firebase RTDB.
 * Path: siteContent/about/story
 * Returns: Object with story paragraphs and founding info
 */
export const useStory = () => {
  return useFirebaseQuery(['about', 'story'], (data) => {
    if (!data) return null

    // DEFENSIVE: Handle both array and object formats for paragraphs
    const paragraphsData = data.paragraphs || []
    const paragraphs = Array.isArray(paragraphsData)
      ? paragraphsData.map((p, idx) => ({
          text: typeof p === 'string' ? p : p.text || '',
          order: p.order ?? idx,
        }))
      : Object.entries(paragraphsData).map(([id, p]) => ({
          id,
          text: typeof p === 'string' ? p : p.text || '',
          order: p.order ?? 999,
        }))

    return {
      foundingYear: data.foundingYear || '1998',
      foundingInstitutes: data.foundingInstitutes || 'IIT Bombay and IIM Ahmedabad',
      foundingCity: data.foundingCity || 'Mumbai',
      paragraphs: paragraphs.sort((a, b) => a.order - b.order).map(p => p.text),
    }
  })
}

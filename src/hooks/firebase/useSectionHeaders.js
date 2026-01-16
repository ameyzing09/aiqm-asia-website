import { useFirebaseQuery } from '../useFirebaseQuery'

/**
 * Hook to fetch section headers from Firebase RTDB.
 * Path: siteContent/sectionHeaders
 * Returns: Object with section headers keyed by section name
 */
export const useSectionHeaders = (section = null) => {
  return useFirebaseQuery(['sectionHeaders'], data => {
    if (!data) return section ? { title: '', description: '' } : {}

    // If specific section requested, return just that section
    if (section) {
      const sectionData = data[section] || {}
      return {
        title: sectionData.title || '',
        description: sectionData.description || '',
      }
    }

    // Return all section headers with defaults
    const sections = {}
    Object.entries(data).forEach(([key, value]) => {
      sections[key] = {
        title: value.title || '',
        description: value.description || '',
      }
    })
    return sections
  })
}

import { useFirebaseQuery } from '../useFirebaseQuery'

/**
 * Hook to fetch hero section content from Firebase
 * @param {string} page - The page identifier (home, certifications, consultancy, about)
 * @returns {Object} Query result with hero data
 *
 * Schema varies by page:
 * - home: headline, highlightText, subheadline, primaryCtaText, secondaryCtaText
 * - about: title, description, establishedBadge
 * - certifications: title, badge
 * - consultancy: title
 */
export const useHero = (page = 'home') => {
  return useFirebaseQuery(['heroes', page], data => {
    if (!data) return null

    // Return all fields with defaults - schema varies by page
    return {
      // Home page fields
      headline: data.headline || '',
      highlightText: data.highlightText || '',
      subheadline: data.subheadline || '',
      primaryCtaText: data.primaryCtaText || '',
      primaryCtaLink: data.primaryCtaLink || '',
      secondaryCtaText: data.secondaryCtaText || '',
      secondaryCtaLink: data.secondaryCtaLink || '',
      backgroundImage: data.backgroundImage || '',
      // Non-home page fields (about, certifications, consultancy)
      title: data.title || '',
      description: data.description || '',
      badge: data.badge || '',
      establishedBadge: data.establishedBadge || '',
      // Hero images for about/consultancy pages
      heroImage: data.heroImage || '',
    }
  })
}

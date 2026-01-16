import { useFirebaseQuery } from '../useFirebaseQuery'

/**
 * Hook to fetch CTA banner content from Firebase RTDB.
 * Path: siteContent/ctaBanners/{page}
 * Returns: Object with CTA content for specific page
 */
export const useCtaBanners = (page = 'courses') => {
  return useFirebaseQuery(['ctaBanners', page], data => {
    if (!data) return null

    return {
      headline: data.headline || '',
      subheadline: data.subheadline || '',
      primaryCtaText: data.primaryCtaText || '',
      secondaryCtaText: data.secondaryCtaText || '',
      primaryCtaLink: data.primaryCtaLink || '',
      secondaryCtaLink: data.secondaryCtaLink || '',
      batchInfo: data.batchInfo || '',
      trustIndicator1: data.trustIndicator1 || '',
      trustIndicator2: data.trustIndicator2 || '',
      trustIndicator3: data.trustIndicator3 || '',
    }
  })
}

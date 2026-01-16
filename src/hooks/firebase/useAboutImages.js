import { useFirebaseQuery } from '../useFirebaseQuery'

/**
 * Hook to fetch about page images from Firebase RTDB.
 * Path: siteContent/about
 * Returns: Object with storyImage and globalMapImage
 */
export const useAboutImages = () => {
  return useFirebaseQuery(['about'], data => {
    if (!data) return null

    return {
      storyImage: data.storyImage || '',
      globalMapImage: data.globalMapImage || '',
    }
  })
}

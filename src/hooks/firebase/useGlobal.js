import { useFirebaseQuery } from '../useFirebaseQuery'

/**
 * Hook to fetch global site settings from Firebase RTDB.
 * Path: siteContent/global
 * Returns: Object with companyInfo, contact, navigationLabels, socialLinks (as array), accreditations
 */
export const useGlobal = () => {
  return useFirebaseQuery(['global'], (data) => {
    if (!data) return null

    // DEFENSIVE: Transform socialLinks to array format
    const socialLinksData = data.socialLinks || {}
    const socialLinks = Array.isArray(socialLinksData)
      ? socialLinksData
      : Object.entries(socialLinksData).map(([id, item]) => ({
          id,
          name: item.name || id,
          url: item.url || '',
          order: item.order ?? 999,
        }))

    return {
      companyInfo: {
        name: data.companyInfo?.name || '',
        tagline: data.companyInfo?.tagline || '',
        shortTagline: data.companyInfo?.shortTagline || '',
        description: data.companyInfo?.description || '',
        establishedYear: data.companyInfo?.establishedYear || 1998,
        copyrightYear: data.companyInfo?.copyrightYear || new Date().getFullYear(),
      },
      contact: {
        email: data.contact?.email || '',
        phone: data.contact?.phone || '',
        address: data.contact?.address || '',
      },
      navigationLabels: {
        home: data.navigationLabels?.home || 'Home',
        courses: data.navigationLabels?.courses || 'Courses',
        certifications: data.navigationLabels?.certifications || 'Certifications',
        consultancy: data.navigationLabels?.consultancy || 'Consultancy',
        about: data.navigationLabels?.about || 'About',
        ctaButton: data.navigationLabels?.ctaButton || 'Enroll Now',
      },
      socialLinks: socialLinks.sort((a, b) => a.order - b.order), // SORTED ARRAY
      accreditations: data.accreditations || {},
    }
  })
}

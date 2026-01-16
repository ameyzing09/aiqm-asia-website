import { useQuery } from '@tanstack/react-query'
import { ref, get } from 'firebase/database'
import { db } from '../../services/firebase'
import { ALL_COURSES } from '../../constants/coursesData'

/**
 * Hook to fetch courses and their topics from Firebase RTDB.
 * Falls back to hardcoded constants if Firebase is empty or fails.
 */
export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      // Fetch courses and topics in parallel with graceful degradation
      const results = await Promise.allSettled([
        get(ref(db, 'siteContent/courses')),
        get(ref(db, 'siteContent/courseTopics')),
      ])

      // Extract values, defaulting to empty on rejection
      const coursesData =
        results[0].status === 'fulfilled' && results[0].value.exists()
          ? results[0].value.val()
          : null
      const topicsData =
        results[1].status === 'fulfilled' && results[1].value.exists() ? results[1].value.val() : {}

      // If no courses in Firebase, return hardcoded fallback
      if (
        !coursesData ||
        (typeof coursesData === 'object' && Object.keys(coursesData).length === 0)
      ) {
        return ALL_COURSES
      }

      // DEFENSIVE: Handle both array and object formats from Firebase
      const coursesItems = Array.isArray(coursesData)
        ? coursesData.map((item, index) => ({
            id: item.id || `course-${index}`,
            ...item,
          }))
        : Object.entries(coursesData).map(([id, item]) => ({ id, ...item }))

      // Transform and merge Firebase data
      const courses = coursesItems
        .map(course => {
          // DEFENSIVE: Get topics for this course with Array.isArray check
          const courseTopics = topicsData[course.id] || {}
          const topics = Array.isArray(courseTopics) ? courseTopics : Object.values(courseTopics)

          // Transform mode object to array format matching hardcoded structure
          const modeArray = []
          if (course.mode?.online) modeArray.push('Online')
          if (course.mode?.onsite) modeArray.push('Onsite')
          if (course.mode?.hybrid) modeArray.push('Hybrid')

          // Transform accreditation object to array format
          const accreditationArray = []
          if (course.accreditation?.cssc) accreditationArray.push('CSSC')
          if (course.accreditation?.iaf) accreditationArray.push('IAF')

          return {
            id: course.id,
            title: course.title || '',
            level: course.level || '',
            duration: course.duration || '',
            mode: modeArray.length > 0 ? modeArray : ['Online'],
            accreditation: accreditationArray.length > 0 ? accreditationArray : ['CSSC'],
            idealFor: course.idealFor || '',
            outcome: course.outcome || '',
            certification: course.certification || '',
            description: course.description || '',
            topics: topics.length > 0 ? topics : [],
            price: course.priceDisplay || '',
            order: course.order ?? 999,
            featured: course.featured ?? false,
            active: course.active !== false, // Default to true if not specified
            sampleCertificateUrl: course.sampleCertificateUrl || '',
          }
        })
        .filter(course => course.active)
        .sort((a, b) => a.order - b.order)

      // If transformation resulted in empty array, return fallback
      if (courses.length === 0) {
        return ALL_COURSES
      }

      return courses
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Return hardcoded data while loading to prevent empty state
    placeholderData: ALL_COURSES,
  })
}

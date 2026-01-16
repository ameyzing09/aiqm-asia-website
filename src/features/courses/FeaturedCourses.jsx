import { useCourses, useSectionHeaders } from '../../hooks/firebase'
import { CourseCard } from './CourseCard'

// Loading skeleton for featured course card
function FeaturedCourseSkeleton() {
  return (
    <div className="w-full md:w-[calc(33.333%-1.334rem)] bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
      {/* Header gradient skeleton */}
      <div className="h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
      {/* Content skeleton */}
      <div className="p-6 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24" />
        </div>
      </div>
    </div>
  )
}

export function FeaturedCourses() {
  const { data: allCourses, isLoading } = useCourses()
  const { data: sectionHeader } = useSectionHeaders('featuredCourses')

  // Filter to only featured courses, or take first 3 if no featured flag
  const featuredCourses =
    allCourses?.filter(course => course.featured).slice(0, 3) || allCourses?.slice(0, 3) || []

  return (
    <section id="courses" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {sectionHeader?.title || 'Featured Certification Programs'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {sectionHeader?.description ||
              'Industry-recognized certifications designed to transform your career'}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {isLoading
            ? // Show 3 skeleton cards while loading
              [1, 2, 3].map(i => <FeaturedCourseSkeleton key={i} />)
            : featuredCourses.map(course => <CourseCard key={course.id} course={course} />)}
        </div>
      </div>
    </section>
  )
}
